import { CodingContract } from "cc/coding_contract.js";


export class AlgorithmicStockTrader4 extends CodingContract {
	solve(ns, data) {
		const m = data[0];
		const arr = data[1];
		const n = arr.length;

		var t = {};
		const max = 5000;

		function getv(x, y) {
			if (x < 0 || y < 0)
				return 0;
			if (max * y + x in t)
				return t[max * y + x];
			return 0;
		}

		function setv(x, y, v) {
			t[max * y + x] = v;
		}

		for (var i = 1; i < n; ++i) {
			for (var j = 0; j < i; ++j) {
				for (var k = 1; k <= m; ++k)
					setv(k, i, Math.max(getv(k, i - 1), getv(k, i), getv(k - 1, j - 1) + arr[i] - arr[j]));
			}
		}

		var result = 0;
		for (var k = 1; k <= m; ++k)
			result = Math.max(result, getv(k, n - 1));
		return result;
	}
}
