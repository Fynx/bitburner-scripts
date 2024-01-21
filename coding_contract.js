class CodingContract {
	solve(data) {
		throw new Error("");
	}
}

export function solve_coding_contract(ctype, data) {
	const ctypes = {
		"Find Largest Prime Factor": FindLargestPrimeFactor,
		"Subarray with Maximum Sum": SubarrayWithMaximumSum,
		"Total Ways to Sum": TotalWaysToSum1,
		"Total Ways to Sum II": TotalWaysToSum2,
		"Spiralize Matrix": SpiralizeMatrix,
		"Array Jumping Game": ArrayJumpingGame1,
		"Array Jumping Game II": ArrayJumpingGame2,
		"Merge Overlapping Intervals": MergeOverlappingIntervals,
		"Generate IP Addresses": GenerateIPAddresses,
		"Algorithmic Stock Trader I": AlgorithmicStockTrader1,
		"Algorithmic Stock Trader II": AlgorithmicStockTrader2,
		"Algorithmic Stock Trader III": AlgorithmicStockTrader3,
		"Algorithmic Stock Trader IV": AlgorithmicStockTrader4,
		"Minimum Path Sum in a Triangle": MinimumPathSumInATriangle,
		"Unique Paths in a Grid I": UniquePathsInAGrid1,
		"Unique Paths in a Grid II": UniquePathsInAGrid2,
		"Shortest Path in a Grid": ShortestPathInAGrid,
		"Sanitize Parentheses in Expression": SanitizeParenthesesInExpression,
		"Find All Valid Math Expressions": FindAllValidMathExpressions,
		"HammingCodes: Integer to Encoded Binary": IntegerToEncodedBinary,
		"HammingCodes: Encoded Binary to Integer": EncodedBinaryToInteger,
		"Proper 2-Coloring of a Graph": ProperTwoColoringOfAGraph,
		"Compression I: RLE Compression": RLECompression,
		"Compression II: LZ Decompression": LZDecompression,
		"Compression III: LZ Compression": LZCompression,
		"Encryption I: Caesar Cipher": CaesarCipher,
		"Encryption II: Vigenère Cipher": VigenereCipher,
	};
	return ctypes[ctype].constructor().solve(data);
}

export function main(ns) {

	var e = ns.codingcontract.getContractTypes();
	var res = "{\n"
	for (var i in e) {
		var c = e[i];
		res += `\t"${c}": ,\n`;
	}
	res += `}`;
	ns.tprintf(res);
}
