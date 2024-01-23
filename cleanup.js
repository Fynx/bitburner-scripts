import { MANAGER_PORT, MSG_CLEANUP_FINISHED } from "lib/definitions.js";


export async function main(ns) {
	const host = ns.args[0].split(":")[0];
	const target = ns.args[1];

	let ram_used = ns.getServerMaxRam(host);
	if (ns.args[0].split(":").length > 1)
		ram_used = Math.min(ns.args[0].split(":")[1], ram_used);

	const grow_script = "base/grow_routine.js";
	const weaken_script = "base/weaken_routine.js";

	ns.scp(grow_script, host);
	ns.scp(weaken_script, host);

	while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)
		|| ns.getServerMaxMoney(target) > ns.getServerMoneyAvailable(target)
	) {
		var weaken_time = ns.getWeakenTime(target);
		var grow_time = ns.getGrowTime(target);
		var grow_ram = ns.getScriptRam(grow_script);
		var weaken_ram = ns.getScriptRam(weaken_script);

		if (grow_ram == Infinity)
			grow_ram = 524288;
		if (weaken_ram == Infinity)
			weaken_ram = 524288;

		if (ns.getServerMaxMoney(target) > ns.getServerMoneyAvailable(target))
			ns.exec(grow_script, host, Math.floor(ram_used / 2 / grow_ram), target);
		ns.exec(weaken_script, host, Math.floor(ram_used / 2 / weaken_ram), target);

		await ns.sleep(Math.max(weaken_time, grow_time));
	}

	var port = ns.getPortHandle(MANAGER_PORT);
	while (!port.tryWrite(MSG_CLEANUP_FINISHED))
    	await ns.sleep(3000);
	while (!port.tryWrite(target))
    	await sleep(3000);
}
