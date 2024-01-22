import { CodingContract } from "cc/coding_contract.js";


export class MinimumPathSumInATriangle extends CodingContract {
	solve(ns, data) {
		var t = [];

		function get_value(i, j) {
			if (i >= data.length || j >= data[i].length || i < 0 || j < 0)
				return Infinity;
			return t[i][j];
		}

		t.push([data[0][0]]);

		for (var i = 1; i < data.length; ++i) {
			t.push([]);
			for (var j = 0; j < data[i].length; ++j) {
				var min = Math.min(get_value(i - 1, j - 1), get_value(i - 1, j));
				t[i].push(min + data[i][j]);
			}
		}

		return Math.min(...t[data.length - 1]);
	}
}
