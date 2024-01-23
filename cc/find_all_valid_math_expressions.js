import { CodingContract } from "cc/coding_contract.js";


export class FindAllValidMathExpressions extends CodingContract {
	solve(ns, data) {
		const values = data[0].split("");
		const n = data[1];

		var candidates = new Set();

		function is_digit(c) {
			return c >= "0" && c <= "9";
		}

		function find(index, expr) {
			if (index == values.length) {
				candidates.add(expr);
			} else {
				var next = values[index];
				find(index + 1, `${expr}+${next}`);
				find(index + 1, `${expr}-${next}`);
				find(index + 1, `${expr}*${next}`);
				if (index == 0 || expr[expr.length - 1] != "0" || (index > 1 && is_digit(expr[expr.length - 2])))
					find(index + 1, `${expr}${next}`);
			}
		}

		find(1, values[0]);

		function read_number(src, index) {
			var result = 0;
			while (index < src.length && is_digit(src[index]))
				result = result * 10 + Number.parseInt(src[index++]);
			return [result, index];
		}

		function evaluate(expr) {
			var elem = read_number(expr, 0);
			var sum = [elem[0]];

			for (var i = elem[1]; i < expr.length; i = elem[1]) {
				elem = read_number(expr, i + 1);
				switch (expr[i]) {
					case "+":
						sum.push(elem[0]);
						break;
					case "-":
						sum.push(-elem[0]);
						break;
					case "*":
						sum.push(sum.pop() * elem[0]);
						break;
				}
			}
			return sum.reduce((a, b) => a + b, 0);
		}

		var result = [];
		for (const v of candidates) {
			if (evaluate(v) == n)
				result.push(v);
		}

		return result;
	}
}
