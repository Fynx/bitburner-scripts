/** @param {NS} ns */
export async function main(ns) {
	const command = ns.args[0];
	const version = ns.args[1];
	const prefix = "fnx_";

	const ram_for_version = {
		"f": 256,     //     14,080,000
		"e": 1024,    //     56,320,000
		"d": 4096,    //    225,280,000
		"c": 16384,   //    901,120,000
		"b": 65536,   //  3,604,480,000
		"a": 524288,  // 28,835,840,000
		"s": 1048576, // 57,671,680,000
	};

	function make_hostname(index, version) {
		var result = prefix;
		if (index < 10)
		result += "0";
		return result + i + version
	}

	var i = 1;
	var hostname = make_hostname(i, version);
	while (ns.serverExists(hostname))
	hostname = make_hostname(++i, version);

	if (command == "buy") {
		ns.purchaseServer(hostname, ram_for_version[version]);
	} else if (command == "upgrade") {
		const old_hostname = ns.args[2];
		ns.upgradePurchasedServer(old_hostname, ram_for_version[version]);
		ns.renamePurchasedServer(old_hostname, hostname);
	} else {
		throw new Error("Unrecognised command: " + command + " (allowed: buy, upgrade)");
	}
}
