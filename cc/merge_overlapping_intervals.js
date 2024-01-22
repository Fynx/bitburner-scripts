import { CodingContract } from "cc/coding_contract.js";


export class MergeOverlappingIntervals extends CodingContract {
	solve(ns, data) {
		const sorted = data.sort((a, b) => a[0] == b[0] ? a[1] - b[1] : a[0] - b[0]);

		let result = [];
		let current = [-1, -1];

		sorted.forEach((v, _i, _a) => {
			if (current[1] < v[0]) {
				if (current[0] != -1)
					result.push(current);
				current = v;
			}
			current[1] = Math.max(current[1], v[1]);
		});
		if (current[0] != -1)
			result.push(current);

		return result;
	}
}
