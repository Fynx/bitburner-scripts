import { CodingContract } from "cc/coding_contract.js";


export class VigenereCipher extends CodingContract {
	solve(ns, data) {
		const text = data[0];
		const code = data[1];

		function sum(a, b) {
			// A 65
			// Z 90
			//   32
			var ca = a.charCodeAt(0);
			var cb = b.charCodeAt(0);
			return String.fromCharCode((ca + cb) % (91 - 65) + 65);
		}

		var index = 0;
		var result = "";
		for (var i = 0; i < text.length; ++i) {
			if (text[i] == " ")
				result += " ";
			else
				result += sum(code[index++], text[i]);
			if (index == code.length)
				index = 0;
		}

		return result;
	}
}
