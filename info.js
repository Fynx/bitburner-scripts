export function autocomplete(data, args) {
    return [...data.servers];
}

export async function main(ns) {
	const host = ns.args[0];

	ns.tprint(`

	money:     ${ns.nFormat(ns.getServerMoneyAvailable(host), "$0.000a")} / ${ns.nFormat(ns.getServerMaxMoney(host), "$0.000a")}
	ram:       ${ns.formatRam(ns.getServerUsedRam(host))} / ${ns.formatRam(ns.getServerMaxRam(host))}
	security:  ${Number.parseFloat(ns.getServerSecurityLevel(host)).toFixed(2)} / ${ns.getServerMinSecurityLevel(host)}

	grow time:    ${ns.tFormat(ns.getGrowTime(host), true)}
	weaken time:  ${ns.tFormat(ns.getWeakenTime(host), true)}
	hack time:    ${ns.tFormat(ns.getHackTime(host), true)}

	grow ram:     ${ns.getScriptRam("base/grow_routine.js")}
	weaken ram:   ${ns.getScriptRam("base/weaken_routine.js")}
	hack ram:     ${ns.getScriptRam("base/hack_routine.js")}
`);
}
