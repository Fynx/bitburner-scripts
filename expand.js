import { make_cyan, make_red, make_yellow, make_brightyellow } from "lib/utils.js";
import { solve_coding_contract } from "solve_cc.js";
import { inject_command } from "lib/inject_command.js";


export async function main(ns) {
	var visited = new Set();

	async function run_all(parent, host, prefix) {
		var status;
		if (ns.hasRootAccess(host))
			status = "(root access)"
		else
			status = "(no root access)"

		ns.tprintf(`visiting ${prefix} ${status}`);
		if (ns.hasRootAccess(host)) {
			if (ns.getServerMaxMoney(host) > 0)
				ns.tprintf(`${make_cyan()} ${host}: money = ${ns.nFormat(ns.getServerMaxMoney(host), "$0.000a")}`);
		} else {
			ns.tprintf(`${make_red()} ${host}: hacking = ${ns.getServerRequiredHackingLevel(host)}, ports = ${ns.getServerNumPortsRequired(host)}`);
		}

		var local_files = ns.ls(host);
		for (var i in local_files) {
			var filename = local_files[i];
			if (filename.endsWith(".cct")) {
				var ctype = ns.codingcontract.getContractType(filename, host);
				var cdata = ns.codingcontract.getData(filename, host);
				ns.tprintf(`${make_yellow()} coding contract available: ${filename} (${ctype})`);
				var result = solve_coding_contract(ns, ctype, cdata);
				if (result != null) {
					var reward = ns.codingcontract.attempt(result, filename, host);
					if (reward)
						ns.tprintf(`${make_brightyellow()}   contract solved successfully: ${reward}`);
					else
						ns.tprintf(`${make_brightyellow()}   failed to solve the contract`);
				}
			} else if (!filename.endsWith(".js") && !ns.fileExists(filename, "home")) {
				ns.tprintf(`${make_yellow()} downloading: ${filename}`);
				ns.scp(filename, "home", host);
			}
		}

		visited.add(host);
		if (parent !== null) {
			if (!ns.hasRootAccess(host)) {
				if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(host))
					return;

				var open_ports = 0;

				if (ns.fileExists("BruteSSH.exe")) {
					ns.brutessh(host);
					++open_ports;
				}

				if (ns.fileExists("FTPCrack.exe")) {
					ns.ftpcrack(host);
					++open_ports;
				}

				if (ns.fileExists("relaySMTP.exe")) {
					ns.relaysmtp(host);
					++open_ports;
				}

				if (ns.fileExists("HTTPWorm.exe")) {
					ns.httpworm(host);
					++open_ports;
				}

				if (ns.fileExists("SQLInject.exe")) {
					ns.sqlinject(host);
					++open_ports;
				}

				if (ns.getServerNumPortsRequired(host) > open_ports)
					return;

				ns.nuke(host);

				inject_command(`connect ${parent}; connect ${host}; backdoor; home`);
				// add singularity call for regular backdoor when available
			}
		}

		var available = ns.scan(host);
		for (var index in available) {
			var val = available[index];
			if (!visited.has(val))
				await run_all(host, val, `${prefix} -> ${val}`);
		}
	}

	await run_all(null, "home", "home");
}
