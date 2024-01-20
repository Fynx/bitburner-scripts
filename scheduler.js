import { PriorityQueue } from "priority_queue.js"
import { parseargs } from "parseargs.js"


function format_date(date) {
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var millisecs = "0" + date.getMilliseconds();
	return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}:${millisecs}`;
}


export async function main(ns) {
	ns.disableLog("ALL");

	const args_structure = {
		"--host": {"name": "host", "mandatory": true, "type": "list"},
		"--target": {"name": "target", "mandatory": true, "type": "str"},
		"--thread-mult": {"name": "thread_multiplier", "mandatory": true, "type": "str"},
		"--grow-mult": {"name": "grow_multplier", "mandatory": true, "type": "int"},
		"--weaken-mult": {"name": "weaken_multiplier", "type": "int", "default": 2},
		"--hack-mult": {"name": "hack_multiplier", "type": "int", "default": 1},
		"--debug": {"name": "debug", "type": "bool_yes"},
	};

	const parsed_args = parseargs(ns, args_structure);

	const hosts = parsed_args["host"];
	const target = parsed_args["target"];
	const thread_multiplier = parsed_args["thread_multiplier"];
	const grow_multiplier = parsed_args["grow_multplier"];
	const weaken_multiplier = parsed_args["weaken_multiplier"];
	const hack_multiplier = parsed_args["hack_multiplier"];

	const debug = parsed_args["debug"];

	const grow_script = "grow_routine.js";
	const weaken_script = "weaken_routine.js";
	const hack_script = "hack_routine.js";

	for (var i in hosts) {
		var host = hosts[i];
		ns.scp(grow_script, host);
		ns.scp(weaken_script, host);
		ns.scp(hack_script, host);
	}

	const interval = 30;
	const sleep_time = interval;

	class Job {
		constructor(host, threads, script, time) {
			this.threads = threads;
			this.host = host;
			this.script = script;
			this.time = time;
			if (debug)
				ns.tprint(`created ${this}`);
		}
		toString() { return `job ${this.host}: ${target} -> ${this.script} (${this.threads} threads) at ${format_date(new Date(this.time))}`; }
	}

	class Event {
		constructor(host, event_type, value, time) {
			this.value = value;
			this.host = host;
			this.time = time;
			this.event_type = event_type;
			if (debug)
				ns.tprint(this.toString());
		}
		toString() {
			if (this.event_type == "finish")
				return `free ${ns.formatRam(this.value)} ({this.host}) at ${format_date(new Date(this.time))}`;
			else if (this.event_type == "cleanup")
				return `finish (${this.host}) at ${format_date(new Date(this.time))}`;
		}
	}

	class Cluster {
		constructor(hosts) {
			this.hosts = hosts;
			this.ram = [];
			this.used_ram = [];
			for (var i in hosts) {
				this.ram.push(ns.getServerMaxRam(hosts[i]) * 1.1);  // TODO FIX THIS DANGEROUS HACK
				this.used_ram.push(0);
			}
		}
		tryGetRam(ram) {
			for (var i in hosts) {
				if (this.ram[i] - this.used_ram[i] >= ram) {
					this.used_ram[i] += ram;
					if (debug)
						ns.tprintf(`${this.hosts[i]}: using ${ram} GB, ${this.ram[i] - this.used_ram[i]} GB left`);
					return hosts[i];
				}
			}
			return null;
		}
		totalRam() {
			var ram = 0;
			for (var i in hosts)
				ram += this.ram[i];
			return ram;
		}
		getAllRam(ram) {
			var maxram = 0;
			var selected_host;
			for (var i in hosts) {
				if (this.ram[i] - this.used_ram[i] > maxram) {
					selected_host = i;
					maxram = this.ram[i] - this.used_ram[i];
				}
			}
			this.ram[selected_host] += maxram;
			return [hosts[i], maxram];
		}
		freeRam(ram, host) {
			for (var i in hosts) {
				if (hosts[i] == host)
					this.used_ram[i] -= ram;
			}
		}
		toString() {
			var result = "";
			for (var i in this.hosts) {
				if (result != "")
					result += ", ";
				var percent = Number.parseFloat(this.used_ram[i] * 100.0 / this.ram[i]).toFixed(2);
				result += `${this.hosts[i]}: ${percent}%%`;
			}
			return result;
		}
	}

	const grow_threads = grow_multiplier * thread_multiplier;
	const weaken_threads = weaken_multiplier * thread_multiplier;
	const hack_threads = hack_multiplier * thread_multiplier;
	// TODO use formulas

	const grow_ram = ns.getScriptRam(grow_script) * grow_threads;
	const weaken_ram = ns.getScriptRam(weaken_script) * weaken_threads;
	const hack_ram = ns.getScriptRam(hack_script) * hack_threads;

	const ram_needed = grow_ram + weaken_ram + hack_ram + weaken_ram;

	const grow_time = ns.getGrowTime(target);
	const weaken_time = ns.getWeakenTime(target);
	const hack_time = ns.getHackTime(target);

	const set_time = Math.max(grow_time, weaken_time, hack_time);
	const safety_margin = 100;

	let cluster = new Cluster(hosts);
	let job_queue = new PriorityQueue((a, b) => a.time < b.time);
	let event_queue = new PriorityQueue((a, b) => a.time < b.time);

	const estimated_sets = Math.floor(cluster.totalRam() / ram_needed);
	const estimated_time_between_sets = set_time / estimated_sets - 6 * interval;
	const time_between_sets = interval; //Math.max(estimated_time_between_sets * 0.4, interval); // hahah nice try.

	ns.tprintf(`total ram:         ${ns.formatRam(cluster.totalRam())}`);
	ns.tprintf(`ram needed:        ${ns.formatRam(ram_needed)}`);
	ns.tprintf(`estimated sets:    ${estimated_sets}`)
	ns.tprintf(`set time:          ${Number.parseInt(set_time)}`);
	ns.tprintf(`interval:          ${interval}`);
	ns.tprintf(`time between sets: ${time_between_sets}`)

	let used_ram = 0;
	let last_scheduled = 0;
	let blocked = false;
	let drop_next = false;

	ns.tprintf(`target: ${target}`);
	ns.tprintf(`start scheduling: ${cluster}`);

	while (true) {
		const now = new Date().getTime();

		while (!event_queue.isEmpty() && now >= event_queue.peek().time) {
			var obj = event_queue.pop();
			if (obj.event_type == "cleanup") {
				blocked = true;
			} else {
				if (debug)
					ns.tprint(`finished set on ${ns.formatRam(obj.value)} (${obj.host}): ${cluster}`);
				cluster.freeRam(obj.value, obj.host);
				blocked = false;
			}
		}

		while (!blocked && !job_queue.isEmpty() && now >= job_queue.peek().time) {
			var obj = job_queue.pop();
			if (debug)
				ns.tprint(`running ${obj.script} (${obj.threads} threads) -> ${weaken_ram} GB (${ns.getScriptRam(weaken_script)} GB per instance)`);
			while (ns.getServerMaxRam(obj.host) - ns.getServerUsedRam(obj.host) < ns.getScriptRam(obj.script)) {
				ns.printf(`WARN: waiting for ram`);
				drop_next = true;
				await ns.sleep(interval);
			}
			ns.exec(obj.script, obj.host, obj.threads, target);
		}

		if (drop_next) {
			last_scheduled += estimated_time_between_sets + 5 * interval;
			drop_next = false;
		}

		var host = cluster.tryGetRam(ram_needed);
		if (host != null) {
			var finish_time = Math.max(last_scheduled + estimated_time_between_sets, now + set_time + safety_margin);
			last_scheduled = finish_time + 5 * interval;

			event_queue.push(new Event(host, "cleanup", null, finish_time));
			job_queue.push(new Job(host, hack_threads, hack_script, finish_time + interval - hack_time));
			job_queue.push(new Job(host, weaken_threads, weaken_script, finish_time + 2 * interval - weaken_time));
			job_queue.push(new Job(host, grow_threads, grow_script, finish_time + 3 * interval - grow_time));
			job_queue.push(new Job(host, weaken_threads, weaken_script, finish_time + 4 * interval - weaken_time));
			event_queue.push(new Event(host, "finish", ram_needed, last_scheduled));
		} else {
			await ns.sleep(sleep_time);
		}
	}
}