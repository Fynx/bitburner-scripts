// https://www.reddit.com/r/Bitburner/comments/114j6k7/contract_solvers/

export function hamming_codes_encoded_binary_to_integer(ns, data) {
	let err = 0;
	const bits= [];

	for (const i in data.split("")) {
		const bit = parseInt(data[i]);
		bits[i] = bit;

		if (bit) {
			err ^= +i;
		}
	}

	if (err) {
		/* Flip to correct */
		bits[err] = bits[err] ? 0 : 1;
	}

	let ans = "";

	for (let i = 1; i < bits.length; i++) {
		/* i is not a power of two so it's not a parity bit */
		if ((i & (i - 1)) !== 0) {
			ans += bits[i];
		}
	}

	return parseInt(ans, 2);
}

export function hamming_codes_integer_to_encoded_binary(ns, data){
	const enc= [0];
	const data_bits= data.toString(2).split("").reverse();

	data_bits.forEach((e, i, a) => {
		a[i] = parseInt(e);
	});

	let k = data_bits.length;

	for (let i = 1; k > 0; i++) {
		if ((i & (i - 1)) !== 0) {
			enc[i] = data_bits[--k];
		} else {
			enc[i] = 0;
		}
	}

	let parity= 0;

	/* Figure out the subsection parities */
	for (let i = 0; i < enc.length; i++) {
		if (enc[i]) {
			parity ^= i;
		}
	}

	parity = parity.toString(2).split("").reverse();
	parity.forEach((e, i, a) => {
		a[i] = parseInt(e);
	});

	/* Set the parity bits accordingly */
	for (let i = 0; i < parity.length; i++) {
		enc[2 ** i] = parity[i] ? 1 : 0;
	}

	parity = 0;
	/* Figure out the overall parity for the entire block */
	for (let i = 0; i < enc.length; i++) {
		if (enc[i]) {
			parity++;
		}
	}

	/* Finally set the overall parity bit */
	enc[0] = parity % 2 === 0 ? 0 : 1;

	return enc.join("");
}
