import { CodingContract } from "cc/coding_contract.js";


export class UniquePathsInAGrid2 extends CodingContract {
	solve(ns, data) {
		function make_key(x, y) {
			return `${x},${y}`;
		}

		var t = {};
		var queue = [];
		var qtail = 0;
		var max_x = data[0].length;
		var max_y = data.length;

		const directions = [[1, 0], [0, 1]];

		t[make_key(0, 0)] = 1;
		queue.push([0, 0]);

		while (qtail < queue.length) {
			var cc = queue[qtail++];
			var x = cc[0], y = cc[1];

			for (var i in directions) {
				const c = directions[i];

				var xp = x - c[1], yp = y - c[0];
				if (xp >= 0 && yp >= 0 && data[yp][xp] == 0)
					t[make_key(x, y)] += t[make_key(xp, yp)];

				var xm = x + c[1], ym = y + c[0];
				if (xm < max_x && ym < max_y && data[ym][xm] == 0) {
					if (make_key(xm, ym) in t === false) {
						queue.push([xm, ym]);
						t[make_key(xm, ym)] = 0;
					}
				}
			}
		}

		if (make_key(max_x - 1, max_y - 1) in t)
			return t[make_key(max_x - 1, max_y - 1)];
		return 0;
	}
}
