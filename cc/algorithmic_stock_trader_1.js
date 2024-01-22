import { CodingContract } from "cc/coding_contract.js";


export class AlgorithmicStockTrader1 extends CodingContract {
	solve(ns, data) {
		var min = Infinity;
		var best = 0;
		for (var i = 0; i < data.length; ++i) {
			min = Math.min(data[i], min);
			best = Math.max(data[i] - min, best);
		}
		return best;
	}
}
