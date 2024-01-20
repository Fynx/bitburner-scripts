/** @param {NS} ns */
export async function main(ns) {
	const hostname = ns.args[0];
	const target = ns.args[1];

	const ram_used = ns.getServerMaxRam(hostname);
	while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) || ns.getServerMaxMoney(target) > ns.getServerMoneyAvailable(target)) {
		var weaken_time = ns.getWeakenTime(target);

		ns.exec("grow_routine.js", hostname, Math.floor(ram_used / 2 / ns.getScriptRam("grow_routine.js")), target);
		ns.exec("weaken_routine.js", hostname, Math.floor(ram_used / 2 / ns.getScriptRam("weaken_routine.js")), target);

		await ns.sleep(weaken_time);
	}
}
