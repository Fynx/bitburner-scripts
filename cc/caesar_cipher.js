import { CodingContract } from "cc/coding_contract.js";

export class CaesarCipher extends CodingContract {
	solve(ns, data) {
		ns.tprintf(data.toString());

		function rotate(e, n) {
			// A 65
			// Z 90
			//   32
			var cc = e.charCodeAt(0);
			if (cc == 32)
				return e;
			if (cc - n >= 65)
				return String.fromCharCode(cc - n);
			return String.fromCharCode(91 - 65 + cc - n);
		}

		const word = data[0].split("");
		const d = data[1];
		let result = Array(word.length);

		word.forEach((v, i, a) => {
			result[i] = rotate(v, d);
		});

		return result.join("");
	}
}
