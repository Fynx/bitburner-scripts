import { CodingContract } from "cc/coding_contract.js";


export class ArrayJumpingGame2 extends CodingContract {
	solve(ns, data) {
		var shortest = new Array(data.length);
		shortest[0] = 0;

		var head = 1;
		for (var i = 0; i < data.length; ++i) {
			if (shortest[i] !== undefined) {
				while (head <= Math.min(data.length - 1, i + data[i]))
					shortest[head++] = shortest[i] + 1;
			}
		}

		if (shortest[data.length - 1] === undefined)
			return 0;
		return shortest[data.length - 1];
	}
}
