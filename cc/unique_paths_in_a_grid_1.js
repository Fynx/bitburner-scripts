import { CodingContract } from "cc/coding_contract.js";
import { UniquePathsInAGrid2 } from "cc/unique_paths_in_a_grid_2.js";


export class UniquePathsInAGrid1 extends CodingContract {
	solve(ns, data) {
		var x = data[0];
		var y = data[1];

		var t = new Array(y);
		for (var i = 0; i < y; ++i) {
			var tr = new Array(x);
			for (var j = 0; j < x; ++j)
				tr[j] = 0;
			t[i] = tr;
		}

		var s = new UniquePathsInAGrid2();
		return s.solve(ns, t);
	}
}
