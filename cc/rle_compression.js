import { CodingContract } from "cc/coding_contract.js";

export class RLECompression extends CodingContract {
	solve(ns, data) {
		var result = "";
		var last_char = "!";
		var number = 0;
		for (var i = 0; i < data.length; ++i) {
			if (data[i] != last_char) {
				if (number > 0)
					result += `${number}${last_char}`;
				last_char = data[i];
				number = 1;
			} else {
				++number;
				if (number == 9) {
					result += `${number}${last_char}`;
					number = 0;
				}
			}
		}
		result += `${number}${last_char}`;
		return result;
	}
}
