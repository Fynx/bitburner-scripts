import { CodingContract } from "cc/coding_contract.js";


export class TotalWaysToSum2 extends CodingContract {
	solve(ns, data) {
		var n = data[0];
		var input = data[1];

		function count(sum, index) {
			if (sum == n)
				return 1;
			if (sum > n || index == input.length)
				return 0;
			return count(sum, index + 1) + count(sum + input[index], index);
		}

		return count(0, 0);
	}
}
