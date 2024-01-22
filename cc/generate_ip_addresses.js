import { CodingContract } from "cc/coding_contract.js";


export class GenerateIPAddresses extends CodingContract {
	solve(ns, data) {
		var indices = [];
		function find(i, n, until_now) {
			if (n == 4) {
				if (i == data.length)
					indices.push(until_now);
				return;
			}
			if (i == data.length)
				return;

			find(i + 1, n + 1, until_now.concat([i]));
			find(i + 1, n, until_now);
		}

		find(0, 0, []);

		function verify(e) {
			return e.length <= 3 && (e.length == 1 || e[0] != "0") && Number.parseInt(e) < 256;
		}

		var result = [];
		indices.forEach((v, _i, _a) => {
			var ip = "";
			var index = 0;
			for (var j = 0; j < v.length; ++j) {
				if (j > 0)
					ip += ".";
				var s = data.substring(index, v[j] + 1);
				if (!verify(s))
					return;
				ip += s;
				index = v[j] + 1;
			}
			result.push(ip);
		});

		return result;
	}
}
