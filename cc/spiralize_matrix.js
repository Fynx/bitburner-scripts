import { CodingContract } from "cc/coding_contract.js";

export class SpiralizeMatrix extends CodingContract {
	solve(ns, data) {
		function range(e1, e2) {
			var result = [];
			if (e1 <= e2) {
				for (var i = e1; i <= e2; ++i)
					result.push(i);
			} else {
				for (var i = e1; i >= e2; --i)
					result.push(i);
			}
			return result;
		}

		function subarray(x1, x2, y1, y2) {
			var result = [];
			var rx = range(x1, x2);
			var ry = range(y1, y2);
			for (var i in ry)
				for (var j in rx)
					result.push(data[ry[i]][rx[j]]);
			return result;
		}

		function walk(min_x, max_x, min_y, max_y) {
			if (min_x == max_x || min_y == max_y)
				return subarray(min_x, max_x, min_y, max_y);

			var result = subarray(min_x, max_x, min_y, min_y);
			result = result.concat(subarray(max_x, max_x, min_y + 1, max_y));
			result = result.concat(subarray(max_x - 1, min_x, max_y, max_y));
			result = result.concat(subarray(min_x, min_x, max_y - 1, min_y + 1));
			if (max_x - min_x > 1 && max_y - min_y > 1)
				result = result.concat(walk(min_x + 1, max_x - 1, min_y + 1, max_y - 1));
			return result;
		}

		return walk(0, data[0].length - 1, 0, data.length - 1);
	}
}
