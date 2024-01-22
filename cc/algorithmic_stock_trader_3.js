import { CodingContract } from "cc/coding_contract.js";
import { AlgorithmicStockTrader4 } from "cc/algorithmic_stock_trader_4.js";


export class AlgorithmicStockTrader3 extends CodingContract {
	solve(ns, data) {
		var r = new AlgorithmicStockTrader4();
		return r.solve(ns, [2, data]);
	}
}
