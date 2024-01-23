import { AlgorithmicStockTrader1 } from "cc/algorithmic_stock_trader_1.js";
import { AlgorithmicStockTrader2 } from "cc/algorithmic_stock_trader_2.js";
import { AlgorithmicStockTrader3 } from "cc/algorithmic_stock_trader_3.js";
import { AlgorithmicStockTrader4 } from "cc/algorithmic_stock_trader_4.js";
import { ArrayJumpingGame1 } from "cc/array_jumping_game_1.js";
import { ArrayJumpingGame2 } from "cc/array_jumping_game_2.js";
import { CaesarCipher } from "cc/caesar_cipher.js";
import { EncodedBinaryToInteger } from "cc/encoded_binary_to_integer.js";
import { FindAllValidMathExpressions } from "cc/find_all_valid_math_expressions.js";
import { FindLargestPrimeFactor } from "cc/find_largest_prime_factor.js";
import { GenerateIPAddresses } from "cc/generate_ip_addresses.js";
import { IntegerToEncodedBinary } from "cc/integer_to_encoded_binary.js";
import { LZDecompression } from "cc/lz_decompression.js";
import { LZCompression } from "cc/lz_compression.js";
import { MergeOverlappingIntervals } from "cc/merge_overlapping_intervals.js";
import { MinimumPathSumInATriangle } from "cc/minimum_path_sum_in_a_triangle.js";
import { ProperTwoColoringOfAGraph } from "cc/proper_two_coloring_of_a_graph.js";
import { RLECompression } from "cc/rle_compression.js";
import { ShortestPathInAGrid } from "cc/shortest_path_in_a_grid.js";
import { SanitizeParenthesesInExpression } from "cc/sanitize_parentheses_in_expression.js";
import { SpiralizeMatrix } from "cc/spiralize_matrix.js";
import { SubarrayWithMaximumSum } from "cc/subarray_with_maximum_sum.js";
import { TotalWaysToSum1 } from "cc/total_ways_to_sum_1.js";
import { TotalWaysToSum2 } from "cc/total_ways_to_sum_2.js";
import { UniquePathsInAGrid1 } from "cc/unique_paths_in_a_grid_1.js";
import { UniquePathsInAGrid2 } from "cc/unique_paths_in_a_grid_2.js";
import { VigenereCipher } from "cc/vigenere_cipher.js";


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

export function autocomplete(data, args) {
    return [...data.servers];
}

export function main(ns) {
	const host = ns.args[0];
	const filename = ns.args[1];

	const ctype = ns.codingcontract.getContractType(filename, host);
	const cdata = ns.codingcontract.getData(filename, host);

	var result = solve_coding_contract(ns, ctype, cdata);
	ns.tprintf(result.toString());
}
