import { CodingContract } from "cc/coding_contract.js";


export class ProperTwoColoringOfAGraph extends CodingContract {
	solve(ns, data) {
		const n = data[0];
		const edges = data[1];

		let edge_list = Array(n);
		for (var i = 0; i < n; ++i)
			edge_list[i] = [];
		edges.forEach((v, i, a) => {
			edge_list[v[0]].push(v[1]);
			edge_list[v[1]].push(v[0]);
		});

		let colors = Array(n);
		let failed = false;

		function run_color(node, color) {
			edge_list[node].forEach((v, i, a) => {
				if (colors[v] === undefined) {
					colors[v] = color;
					run_color(v, (color + 1) % 2);
				} else if (colors[v] == colors[node]) {
					failed = true;
				}
			});
		}

		for (var i = 0; i < n; ++i) {
			if (colors[i] === undefined) {
				colors[i] = 0;
				run_color(i, 1);
			}
		}

		if (failed)
			return [];
		return colors;
	}
}
