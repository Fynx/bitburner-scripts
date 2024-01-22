import { CodingContract } from "cc/coding_contract.js";
import { hamming_codes_integer_to_encoded_binary } from "cc/hamming.js";

export class IntegerToEncodedBinary extends CodingContract {
	solve(ns, data) {
		return hamming_codes_integer_to_encoded_binary(ns, data);
	}
}
