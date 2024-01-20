export async function main(ns) {
	const host = ns.args[0];

	ns.tprint(`

	money:     ${ns.nFormat(ns.getServerMoneyAvailable(host), "$0.000a")} / ${ns.nFormat(ns.getServerMaxMoney(host), "$0.000a")}
	ram:       ${ns.formatRam(ns.getServerUsedRam(host))} / ${ns.formatRam(ns.getServerMaxRam(host))}
	security:  ${Number.parseInt(ns.getServerSecurityLevel(host))} / ${ns.getServerMinSecurityLevel(host)}

	grow time:    ${ns.tFormat(ns.getGrowTime(host), true)}
	weaken time:  ${ns.tFormat(ns.getWeakenTime(host), true)}
	hack time:    ${ns.tFormat(ns.getHackTime(host), true)}

	grow ram:     ${ns.getScriptRam("grow_routine.js")}
	weaken ram:   ${ns.getScriptRam("weaken_routine.js")}
	hack ram:     ${ns.getScriptRam("hack_routine.js")}
`);
}
