import { CodingContract } from "cc/coding_contract.js";
import { lz_decompression } from "resource/lz.js";


export class LZDecompression extends CodingContract {
	solve(ns, data) {
		return lz_decompression(data);
	}
}
