import { CodingContract } from "cc/coding_contract.js";
import { lz_compression } from "resource/lz.js";


export class LZCompression extends CodingContract {
	solve(ns, data) {
		return lz_compression(data);
	}
}
