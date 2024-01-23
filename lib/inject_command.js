export function inject_command(cmdline) {
	const terminal_input = document.getElementById("terminal-input");
	terminal_input.value = cmdline;
	const handler = Object.keys(terminal_input)[1];
	terminal_input[handler].onChange({ target: terminal_input });
	terminal_input[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
}
