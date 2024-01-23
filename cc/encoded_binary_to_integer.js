import { CodingContract } from "cc/coding_contract.js";
import { hamming_codes_encoded_binary_to_integer } from "resource/hamming.js";


export class EncodedBinaryToInteger extends CodingContract {
	solve(ns, data) {
		return hamming_codes_encoded_binary_to_integer(ns, data);
	}
}
