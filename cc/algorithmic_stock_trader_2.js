import { CodingContract } from "cc/coding_contract.js";


export class AlgorithmicStockTrader2 extends CodingContract {
	solve(ns, data) {
		var result = 0, last = 0;
		for (var i = data.length - 1; i >= 0; --i) {
			if (data[i] < last)
				result += last - data[i];
			last = data[i];
		}
		return result;
	}
}
