import { parseargs } from "lib/parseargs.js";
import { MANAGER_PORT, MSG_CLEANUP_FINISHED } from "lib/definitions.js";


const cfg = {
	"sigma-cosmetics":   ["home:2097152"],
	"syscore":           ["home:2097152"],
	"alpha-ent":         ["home:16777216"],
	"rothman-uni":       ["home:8388608"],
	"summit-uni":        ["fnx_01s"],
	"neo-net":           ["fnx_02s"],
	"the-hub":           ["fnx_03s"],
	"foodnstuff":        ["fnx_04s"],
	"lexo-corp":         ["fnx_05s", "fnx_06s", "fnx_07s", "fnx_24s"],
	//"joesguns":          [],
	//"harakiri-sushi":    [],
	"nectar-net":        ["fnx_08s"],
	"hong-fang-tea":     ["fnx_09s"],
	"netlink":           ["fnx_10s"],
	"zer0":              ["fnx_11s"],
	"phantasy":          ["fnx_12s"],
	"johnson-ortho":     ["fnx_13s"],
	"silver-helix":      ["fnx_14s"],
	"omega-net":         ["fnx_15s"],
	"crush-fitness":     ["fnx_16s"],
	"iron-gym":          ["fnx_17s"],
	"max-hardware":      ["fnx_18s"],
	"millenium-fitness": ["fnx_19s"],
	"computek":          ["fnx_20s"],
	"rho-construction":  ["fnx_21s"],
	"catalyst":          ["fnx_22s"],
	//"rothman-uni":       ["fnx_23s"],
	"aevum-police":      ["fnx_25s"],
};

function do_run(ns, target, debug) {
	const hosts = cfg[target];

	var targetstr = `${target}:`;
	while (targetstr.length < 20)
		targetstr += " ";

	var process_args = ["scheduler.js", 1, "--target", target];
	for (var j in hosts) {
		process_args.push("--host");
		process_args.push(hosts[j]);
	}

	if (debug)
		process_args.push("--debug");

	var pid = ns.run(...process_args);
	ns.printf(`run ${targetstr} (${hosts}): pid = ${pid}`);
	return pid;
}

function do_cleanup(ns, target, debug) {
	const hosts = cfg[target];

	ns.printf(`cleanup ${targetstr} (${hosts}): pid = ${pid}`);
	return ns.run("cleanup.js", 1, hosts[0], target);
}


const args_structure = {
	1: {"name": "target", "type": "string", "mandatory": true},
	"--debug": {"name": "debug", "type": "bool_yes"},
	"--cleanup": {"name": "cleanup", "type": "bool_yes"},
	"--without": {"name": "without", "type": "list"},
	"--daemon": {"name": "daemon", "type": "bool_yes"},
	"-d": {"alias": "--daemon"},
	"--run": {"name": "run", "type": "bool_yes"},
};

export function autocomplete(data, args) {
	var targets = [];
	targets = ["all"];
	for (var k in cfg)
		targets.push(k);

	if (args.length == 0)
		return [...targets];

	const last_arg = args[args.length - 1];
	var empty = false;

	if (args.length == 1) {
		var result = [];
		targets.forEach((v, _i, _a) => {
			if (v == last_arg)
				empty = true;
			else if (v.startsWith(last_arg))
				result.push(v);
		})
		if (result.length > 0)
			return result;
	}

	var params = [];
	for (var k in args_structure) {
		if (empty || k.startsWith(last_arg) && k != last_arg)
			params.push(k);
	}
	console.log(params.toString());
	console.log(last_arg);
	return [...params];
}

export async function main(ns) {
	ns.resizeTail(1200, 600);
	// clearing the queue
	var port = ns.getPortHandle(MANAGER_PORT);
	while (!port.empty())
		port.read();

	const parsed_args = parseargs(ns, args_structure);
	const selected_target = parsed_args["target"];
	const debug = parsed_args["debug"];
	const cleanup = parsed_args["cleanup"];
	const without = parsed_args["without"];
	const daemon = parsed_args["daemon"];
	const run_flag = parsed_args["run"];  // perform normal run when finished cleanup

	let processes = [];

	for (const target in cfg) {
		if ((selected_target == "all" || target == selected_target) && !without.includes(target)) {
			if (cleanup)
				processes.push(do_cleanup(ns, target, debug));
			else
				do_run(ns, target, debug);
		}
	}

	if (cleanup) {
		var finished_processes = 0;
		while (finished_processes < processes.length) {
			ns.printf(`Finished processes: ${finished_processes}/${processes.length}`);
			while (port.empty())
    			await ns.sleep(3000);

			const msg_type = port.read();

			if (msg_type == MSG_CLEANUP_FINISHED) {
				while (port.empty())
    				await ns.sleep(3000);
				const target = port.read();
				++finished_processes;

				if (run_flag)
					do_run(ns, target, debug);
			}
		}
	}

	if (daemon) {
		while (true) {
			await ns.sleep(5000);
			// print some statistics maybe
		}
	}
}
