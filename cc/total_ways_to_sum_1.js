import { CodingContract } from "cc/coding_contract.js";

export class TotalWaysToSum1 extends CodingContract {
	solve(ns, data) {
		var t = {};
		const max = 5000;

		function get_field(x, y) {
			return t[max * y + x];
		}

		function set_field(x, y, v) {
			t[max * y + x] = v;
		}

		set_field(1, 1, 1);
		for (var i = 2; i <= data; ++i) {
			var sum = 0;
			for (var j = 1; j < i; ++j) {
				var r;
				if (j >= i - j)
					r = get_field(i - j, i - j);
				else
					r = get_field(i - j, j);
				sum += r;
				set_field(i, j, sum);
			}
			set_field(i, i, sum + 1);
		}
		return get_field(data, data) - 1;
	}
}
