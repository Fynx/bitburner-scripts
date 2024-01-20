/** @param {NS} ns */
export async function main(ns) {
	const hostname = ns.args[0].split(":")[0];
	const target = ns.args[1];

	let ram_used = ns.getServerMaxRam(hostname);
	if (ns.args[0].split(":").length > 1)
		ram_used = Math.min(ns.args[0].split(":")[1], ram_used);

	while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) || ns.getServerMaxMoney(target) > ns.getServerMoneyAvailable(target)) {
		var weaken_time = ns.getWeakenTime(target);

		ns.exec("grow_routine.js", hostname, Math.floor(ram_used / 2 / ns.getScriptRam("grow_routine.js")), target);
		ns.exec("weaken_routine.js", hostname, Math.floor(ram_used / 2 / ns.getScriptRam("weaken_routine.js")), target);

		await ns.sleep(weaken_time);
	}
}
