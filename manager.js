import { parseargs } from "parseargs.js";


export async function main(ns) {
	const args_structure = {
		1: {"name": "target", "type": "string", "mandatory": true},
		"--debug": {"name": "debug", "type": "bool_yes"},
		"--cleanup": {"name": "cleanup", "type": "bool_yes"},
		"--without": {"name": "without", "type": "list"},
		"--print": {"name": "print", "type": "bool_yes"},
	};
	const parsed_args = parseargs(ns, args_structure);
	const selected_target = parsed_args["target"];
	const debug = parsed_args["debug"];
	const cleanup = parsed_args["cleanup"];
	const without = parsed_args["without"];
	const print_flag = parsed_args["print"];

	const cfg = [
		[["fnx_01s"], "summit-uni", 32, 56, 6],
		[["fnx_02s"], "neo-net", 80, 56, 6],
		[["fnx_03s"], "the-hub", 32, 56, 6],
		[["fnx_04s"], "foodnstuff", 16, 56, 6],
		[["fnx_04s"], "sigma-cosmetics", 16, 56, 6],
		[["fnx_04s"], "n00dles", 16, 56, 6],
		[["fnx_06s"], "joesguns", 48, 56, 6],
		[["fnx_07s"], "harakiri-sushi", 32, 56, 6],
		[["fnx_08s"], "nectar-net", 40, 56, 6],
		[["fnx_09s"], "hong-fang-tea", 32, 56, 6],
		[["fnx_10s"], "netlink", 32, 56, 6],
		[["fnx_11s"], "zer0", 32, 56, 6],
		[["fnx_12s"], "phantasy", 16, 56, 6],
		[["fnx_13s"], "johnson-ortho", 32, 56, 6],
		[["fnx_14s"], "silver-helix", 32, 56, 6],
		[["fnx_15s"], "omega-net", 32, 56, 6],
		[["fnx_16s"], "crush-fitness", 32, 56, 6],
		[["fnx_17s"], "iron-gym", 32, 56, 6],
		[["fnx_18s"], "max-hardware", 32, 56, 6],
		[["fnx_19s"], "millenium-fitness", 32, 56, 6],
		[["fnx_20s"], "computek", 32, 56, 6],
		[["fnx_21s"], "rho-construction", 32, 56, 6],
		[["fnx_22s"], "catalyst", 32, 56, 6],
		[["fnx_23s"], "rothman-uni", 32, 56, 6],
		//[["fnx_19s", "fnx_24s", "fnx_25s"], "millenium-fitness", 32, 56, 6],
	];

	for (var i in cfg) {
		var hosts = cfg[i][0];
		var target = cfg[i][1];

		if ((selected_target == "all" || target == selected_target) && !without.includes(target)) {

			if (cleanup) {
				ns.exec("cleanup.js", "home", 1, hosts[0], target);
				continue;
			}

			var thread_mult = cfg[i][2];
			var grow_mult = cfg[i][3];
			var weaken_mult = cfg[i][4];

			if (print_flag) {
				target += ":";
				while (target.length < 20)
					target += " ";
				ns.tprintf(`${target}: ${hosts} (${thread_mult} threads, grow multiplier = ${grow_mult}, weaken multiplier = ${weaken_mult})`);
				continue;
			}

			var args = [
				"scheduler.js", "home", 1,
				"--target", target,
				"--thread-mult", thread_mult,
				"--weaken-mult", weaken_mult,
				"--grow-mult", grow_mult,
			];
			for (var j in hosts) {
				args.push("--host");
				args.push(hosts[j]);
			}

			if (debug)
				args.push("--debug");

			ns.exec(...args);
		}
	}
}
