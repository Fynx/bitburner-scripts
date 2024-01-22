import { CodingContract } from "cc/coding_contract.js";
import { ArrayJumpingGame2 } from "cc/array_jumping_game_2.js"


export class ArrayJumpingGame1 extends CodingContract {
	solve(ns, data) {
		var s = new ArrayJumpingGame2();
		if (s.solve(ns, data) > 0)
			return 1;
		return 0;
	}
}
