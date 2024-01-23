import { CodingContract } from "cc/coding_contract.js";


export class SubarrayWithMaximumSum extends CodingContract {
	solve(ns, data) {
		var sum = 0, best_sum = -Infinity;
		data.forEach((v, i, a) => {
			if (sum < 0)
				sum = 0;
			sum += v;
			best_sum = Math.max(best_sum, sum);
		});
		return best_sum;
	}
}
