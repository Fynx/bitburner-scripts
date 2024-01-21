import { CodingContract } from "cc/coding_contract.js";

export class ShortestPathInAGrid extends CodingContract {
	solve(ns, data) {
		function make_key(x, y) {
			return `${x},${y}`;
		}

		var t = {};
		var queue = [];
		var qtail = 0;
		var max_x = data[0].length;
		var max_y = data.length;

		const directions = [[1, 0, "D"], [0, 1, "R"], [-1, 0, "U"], [0, -1, "L"]];

		t[make_key(0, 0)] = "*";
		queue.push([0, 0]);

		var cnt = 0;
		while (qtail < queue.length) {
			var cc = queue[qtail++];
			var x = cc[0], y = cc[1];

			for (var i in directions) {
				var c = directions[i];
				var xm = x + c[1], ym = y + c[0], dir = c[2];
				if (xm >= 0 && xm < max_x && ym >= 0 && ym < max_y && data[ym][xm] == 0) {
					if (make_key(xm, ym) in t !== true) {
						t[make_key(xm, ym)] = dir;
						queue.push([xm, ym]);
					}
				}
			}
		}

		var x = max_x - 1;
		var y = max_y - 1;
		if (make_key(x, y) in t) {
			var result = "";
			var cnt = 0;
			while (x != 0 || y != 0) {
				result = t[make_key(x, y)] + result;
				var xm = {"D": 0, "U": 0, "L": 1, "R": -1}[t[make_key(x, y)]];
				var ym = {"D": -1, "U": 1, "L": 0, "R": 0}[t[make_key(x, y)]];

				x += xm;
				y += ym;
			}
			return result;
		} else {
			return "";
		}
	}
}
