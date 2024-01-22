import { CodingContract } from "cc/coding_contract.js";


export class FindLargestPrimeFactor extends CodingContract {
	solve(ns, data) {
		var result = [];
		for (var i = 2; i <= Math.sqrt(data); ++i) {
			while (data % i == 0) {
				result.push(i);
				data /= i;
			}
		}
		if (data > 0)
			result.push(data);
		return Math.max(...result);
	}
}
