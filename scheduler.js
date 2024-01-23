import { PriorityQueue } from "lib/priority_queue.js"
import { parseargs } from "lib/parseargs.js"


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
		"--debug": {"name": "debug", "type": "bool_yes"},
	};

	const parsed_args = parseargs(ns, args_structure);

	const hosts_with_ram = parsed_args["host"];
	let hosts = [];
	let host_ram = [];
	for (var i in hosts_with_ram) {
		var s = hosts_with_ram[i].split(":");
		hosts.push(s[0]);

		if (s.length > 1)
			host_ram.push(s[1]);
		else
			host_ram.push("max");
	}

	const target = parsed_args["target"];
	const debug = parsed_args["debug"];

	// TODO per server
	const host_server = ns.getServer(hosts[0]);
	const target_server = ns.getServer(target);
	const player = ns.getPlayer();

	const hack_threads = Math.floor(0.5 / ns.formulas.hacking.hackPercent(target_server, player));
	const grow_threads = Math.ceil(1.0 / (ns.formulas.hacking.growPercent(target_server, 1, player, host_server.cpuCores) - 1));
	const weaken1_threads = Math.ceil(hack_threads * 0.002 / 0.05);
	const weaken2_threads = Math.ceil(grow_threads * 0.004 / 0.05);

	const grow_script = "base/grow_routine.js";
	const weaken_script = "base/weaken_routine.js";
	const hack_script = "base/hack_routine.js";

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
				return `free ${ns.formatRam(this.value)} (${this.host}) at ${format_date(new Date(this.time))}`;
			else if (this.event_type == "cleanup")
				return `finish (${this.host}) at ${format_date(new Date(this.time))}`;
		}
	}

	class Cluster {
		constructor(hosts, host_ram) {
			this.hosts = hosts;
			this.ram = [];
			this.used_ram = [];
			for (var i in hosts) {
				var max_ram = ns.getServerMaxRam(hosts[i]);
				if (host_ram[i] != "max")
					max_ram = Math.min(host_ram[i], max_ram);
				this.ram.push(max_ram);
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

	const grow_ram = ns.getScriptRam(grow_script) * grow_threads;
	const weaken1_ram = ns.getScriptRam(weaken_script) * weaken1_threads;
	const weaken2_ram = ns.getScriptRam(weaken_script) * weaken2_threads;
	const hack_ram = ns.getScriptRam(hack_script) * hack_threads;

	const ram_needed = grow_ram + weaken1_ram + hack_ram + weaken2_ram;

	const grow_time = ns.formulas.hacking.growTime(target_server, player);
	const weaken_time = ns.formulas.hacking.weakenTime(target_server, player);
	const hack_time = ns.formulas.hacking.hackTime(target_server, player);

	const set_time = Math.max(grow_time, weaken_time, hack_time);
	const safety_margin = 100;

	let cluster = new Cluster(hosts, host_ram);
	let job_queue = new PriorityQueue((a, b) => a.time < b.time);
	let event_queue = new PriorityQueue((a, b) => a.time < b.time);

	const estimated_sets = Math.floor(cluster.totalRam() / ram_needed);
	const estimated_time_between_sets = set_time / estimated_sets - 6 * interval;
	const time_between_sets = interval; //Math.max(estimated_time_between_sets * 0.4, interval); // hahah nice try.

	ns.printf(`hack threads:      ${hack_threads}`);
	ns.printf(`weaken threads:    ${weaken1_threads}`);
	ns.printf(`grow threads:      ${grow_threads}`);
	ns.printf(`weaken threads:    ${weaken2_threads}`);
	ns.print("");
	ns.printf(`total ram:         ${ns.formatRam(cluster.totalRam())}`);
	ns.printf(`ram needed:        ${ns.formatRam(ram_needed)}`);
	ns.printf(`estimated sets:    ${estimated_sets}`)
	ns.printf(`set time:          ${ns.tFormat(set_time)}`);
	ns.printf(`interval:          ${ns.tFormat(interval, true)}`);
	ns.printf(`time between sets: ${ns.tFormat(time_between_sets, true)}`)

	let last_scheduled = 0;
	let blocked = false;
	let drop_next = false;

	function check_completion() {
		return ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target) &&
			ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target);
	}

	function print_error_state() {
		ns.print(`money:     ${ns.nFormat(ns.getServerMoneyAvailable(host), "$0.000a")} / ${ns.nFormat(ns.getServerMaxMoney(host), "$0.000a")}`);
		ns.print(`ram:       ${ns.formatRam(ns.getServerUsedRam(host))} / ${ns.formatRam(ns.getServerMaxRam(host))}`);
	}

	ns.printf(`target: ${target}`);
	ns.printf(`start scheduling: ${cluster}`);

	const hack_chance = ns.formulas.hacking.hackPercent(target_server, player);
	const start_time = new Date().getTime() / 1000;
	let last_check = start_time / 5;
	let collected = 0;

	while (true) {
		const now = new Date().getTime();

		if (last_check < Math.floor(now / 5000)) {
			last_check = Math.floor(now / 5000);
			ns.print(cluster.toString());
			var money = ns.nFormat(collected / (now / 1000 - start_time), "$0.000a");
			ns.print(`${money} / s`)
			ns.print(`total: ${ns.nFormat(collected, "$0.000a")}`);
			ns.print('----------------');
		}

		while (!event_queue.isEmpty() && now >= event_queue.peek().time) {
			var obj = event_queue.pop();
			if (obj.event_type == "cleanup") {
				if (debug)
					ns.tprint(`finishing set on ${obj.host}: ${cluster}`);
				blocked = true;
			} else {
				if (debug)
					ns.tprint(`finished set on ${obj.host}: ${cluster}`);
				if (!check_completion) {
					ns.print("Critical failure when finishing jobs, needs cleanup");
					print_error_state();
					return;
				}
				cluster.freeRam(obj.value, obj.host);
				blocked = false;
				collected += ns.getServerMaxMoney(target) * hack_chance / 2;
			}
		}

		while (!blocked && !job_queue.isEmpty() && now >= job_queue.peek().time) {
			var obj = job_queue.pop();

			if (!check_completion) {
				ns.print("Critical failure when starting jobs, needs cleanup");
				print_error_state();
				return;
			}

			while (ns.getServerMaxRam(obj.host) - ns.getServerUsedRam(obj.host) < ns.getScriptRam(obj.script)) {
				ns.printf(`WARN: waiting for ram`);
				drop_next = true;
				await ns.sleep(interval);
			}
			ns.exec(obj.script, obj.host, obj.threads, target);
		}

		if (drop_next) {
			last_scheduled += time_between_sets + 5 * interval;
			drop_next = false;
		}

		var host = cluster.tryGetRam(ram_needed);
		if (host != null) {
			var finish_time = Math.max(last_scheduled + time_between_sets, now + set_time + safety_margin);
			last_scheduled = finish_time + 5 * interval;

			event_queue.push(new Event(host, "cleanup", null, finish_time));
			job_queue.push(new Job(host, hack_threads, hack_script, finish_time + interval - hack_time));
			job_queue.push(new Job(host, weaken1_threads, weaken_script, finish_time + 2 * interval - weaken_time));
			job_queue.push(new Job(host, grow_threads, grow_script, finish_time + 3 * interval - grow_time));
			job_queue.push(new Job(host, weaken2_threads, weaken_script, finish_time + 4 * interval - weaken_time));
			event_queue.push(new Event(host, "finish", ram_needed, last_scheduled));
		} else {
			await ns.sleep(sleep_time);
		}
	}
}
