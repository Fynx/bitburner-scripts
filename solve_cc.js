import { ShortestPathInAGrid } from "cc/shortest_path_in_a_grid.js";
import { CodingContract } from "cc/coding_contract.js";
import { MinimumPathSumInATriangle } from "cc/minimum_path_sum_in_a_triangle.js";
import { SpiralizeMatrix } from "cc/spiralize_matrix.js";
import { IntegerToEncodedBinary } from "cc/integer_to_encoded_binary.js";
import { EncodedBinaryToInteger } from "cc/encoded_binary_to_integer.js";
import { ArrayJumpingGame1 } from "cc/array_jumping_game_1.js";
import { ArrayJumpingGame2 } from "cc/array_jumping_game_2.js";
import { UniquePathsInAGrid1 } from "cc/unique_paths_in_a_grid_1.js";
import { UniquePathsInAGrid2 } from "cc/unique_paths_in_a_grid_2.js";
import { CaesarCipher } from "cc/caesar_cipher.js";
import { TotalWaysToSum1 } from "cc/total_ways_to_sum_1.js";
import { TotalWaysToSum2 } from "cc/total_ways_to_sum_2.js";
import { FindLargestPrimeFactor } from "cc/find_largest_prime_factor.js";
import { ProperTwoColoringOfAGraph } from "cc/proper_two_coloring_of_a_graph.js";
import { MergeOverlappingIntervals } from "cc/merge_overlapping_intervals.js";
import { AlgorithmicStockTrader1 } from "cc/algorithmic_stock_trader_1.js";
import { AlgorithmicStockTrader4 } from "cc/algorithmic_stock_trader_4.js";


class SubarrayWithMaximumSum extends CodingContract {}
class GenerateIPAddresses extends CodingContract {}
class AlgorithmicStockTrader2 extends CodingContract {}
class AlgorithmicStockTrader3 extends CodingContract {}
class SanitizeParenthesesInExpression extends CodingContract {}
class FindAllValidMathExpressions extends CodingContract {}
class RLECompression extends CodingContract {}
class LZDecompression extends CodingContract {}
class LZCompression extends CodingContract {}
class VigenereCipher extends CodingContract {}

export function solve_coding_contract(ns, ctype, data) {
	const ctypes = {
		"Find Largest Prime Factor": new FindLargestPrimeFactor(),
		"Subarray with Maximum Sum": new SubarrayWithMaximumSum(),
		"Total Ways to Sum": new TotalWaysToSum1(),
		"Total Ways to Sum II": new TotalWaysToSum2(),
		"Spiralize Matrix": new SpiralizeMatrix(),
		"Array Jumping Game": new ArrayJumpingGame1(),
		"Array Jumping Game II": new ArrayJumpingGame2(),
		"Merge Overlapping Intervals": new MergeOverlappingIntervals(),
		"Generate IP Addresses": new GenerateIPAddresses(),
		"Algorithmic Stock Trader I": new AlgorithmicStockTrader1(),
		"Algorithmic Stock Trader II": new AlgorithmicStockTrader2(),
		"Algorithmic Stock Trader III": new AlgorithmicStockTrader3(),
		"Algorithmic Stock Trader IV": new AlgorithmicStockTrader4(),
		"Minimum Path Sum in a Triangle": new MinimumPathSumInATriangle(),
		"Unique Paths in a Grid I": new UniquePathsInAGrid1(),
		"Unique Paths in a Grid II": new UniquePathsInAGrid2(),
		"Shortest Path in a Grid": new ShortestPathInAGrid(),
		"Sanitize Parentheses in Expression": new SanitizeParenthesesInExpression(),
		"Find All Valid Math Expressions": new FindAllValidMathExpressions(),
		"HammingCodes: Integer to Encoded Binary": new IntegerToEncodedBinary(),
		"HammingCodes: Encoded Binary to Integer": new EncodedBinaryToInteger(),
		"Proper 2-Coloring of a Graph": new ProperTwoColoringOfAGraph(),
		"Compression I: RLE Compression": new RLECompression(),
		"Compression II: LZ Decompression": new LZDecompression(),
		"Compression III: LZ Compression": new LZCompression(),
		"Encryption I: Caesar Cipher": new CaesarCipher(),
		"Encryption II: Vigenère Cipher": new VigenereCipher(),
	};
	return new ctypes[ctype].constructor().solve(ns, data);
}

export function main(ns) {
	const filename = ns.args[0];
	const host = ns.args[1];

	const ctype = ns.codingcontract.getContractType(filename, host);
	const cdata = ns.codingcontract.getData(filename, host);

	var result = solve_coding_contract(ns, ctype, cdata);
	ns.tprintf(result.toString());
}
