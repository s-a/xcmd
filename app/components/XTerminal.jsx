import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './Home.css';
import * as Terminal from './../../node_modules/xterm/dist/xterm';
import * as attach from './../../node_modules/xterm/dist/addons/attach/attach';
import * as fit from './../../node_modules/xterm/dist/addons/fit/fit';
import * as fullscreen from './../../node_modules/xterm/dist/addons/fullscreen/fullscreen';
import * as search from './../../node_modules/xterm/dist/addons/search/search';
import * as webLinks from './../../node_modules/xterm/dist/addons/webLinks/webLinks';
import * as winptyCompat from './../../node_modules/xterm/dist/addons/winptyCompat/winptyCompat';
import os from 'os'
const pty = require('node-pty')



let xterm;
let terminalContainer;
let ptyProcess;

function setTerminalSize() {
	const cols = parseInt(80, 10);
	const rows = parseInt(20, 10);
	ptyProcess.resize(80, 20);
	const width = `${(cols * xterm.renderer.dimensions.actualCellWidth + xterm.viewport.scrollBarWidth).toString()}px`;
	const height = `${(rows * xterm.renderer.dimensions.actualCellHeight).toString()}px`;
	// terminalContainer.style.width = width;
	//terminalContainer.style.height = height;
	xterm.fit();
}

window.onresize = function (event) {
	xterm.fit();
};

function createTerminal() {
	// Clean terminal
	terminalContainer = document.getElementById('terminal-container');

	while (terminalContainer.children && terminalContainer.children.length) {
		terminalContainer.removeChild(terminalContainer.children[0]);
	}

	xterm = new Terminal.default({
		macOptionIsMeta: true,
		cursorBlink: true,
		/*    scrollback: parseInt(optionElements.scrollback.value, 10),
		   tabStopWidth: parseInt(optionElements.tabstopwidth.value, 10), */
		screenReaderMode: false,
		cursorStyle: 'underline',
		bellStyle: 'none',
		theme: {
			background: 'transparent'
		},
		allowTransparency: true
	});


	xterm.open(terminalContainer);
	xterm.winptyCompatInit();
	xterm.webLinksInit();
	xterm.fit();
	xterm.focus();
}

function runRealTerminal() {
	// Initialize node-pty with an appropriate shell
	const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
	ptyProcess = pty.spawn(shell, [], {
		name: 'xterm-color',
		cols: 80,
		rows: 30,
		cwd: process.cwd(),
		env: process.env
	});

	// Setup communication between xterm.js and node-pty
	xterm.on('data', (data) => {
		ptyProcess.write(data);
		// console.info(ptyProcess)
	});
	ptyProcess.on('data', (data) => {
		xterm.write(data);

	});
}

function runFakeTerminal() {
	if (xterm._initialized) {
		return;
	}

	xterm._initialized = true;

	const shellprompt = '$ ';

	xterm.prompt = function () {
		xterm.write(`\r\n${shellprompt}`);
	};
	const chalk = require('chalk');
	let options = { enabled: true, level: 2 };
	const forcedChalk = new chalk.constructor(options);

	xterm.writeln(forcedChalk.green('Welcome to xterm.js http://www.google.de'));
	xterm.writeln(forcedChalk.hex('#39ff14').bold('Welcome to xterm.js http://www.google.de'));
	xterm.writeln(forcedChalk.hex('#39ff14').bold('This is a local terminal emulation, without a real terminal in the back-end.'));
	xterm.writeln(forcedChalk.hex('#39ff14').bold('Type some keys and commands to play around.'));
	xterm.writeln(forcedChalk.hex('#39ff14').bold(''));
	xterm.writeln(forcedChalk.green('Hello from \\033[1;3;31mxterm.js\\033[0m $ '))
	xterm.writeln(forcedChalk.hex('#39ff14').bold('\u001b[34mHello\u001b[39m World\u001b[31m!\u001b[39m'))
	xterm.prompt();

	/* xterm.on('key', function (key, ev) {
		var printable = (
			!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
		);

		if (ev.keyCode == 13) {
			xterm.prompt();
		} else if (ev.keyCode == 8) {
			// Do not delete the prompt
			if (xterm.x > 2) {
				xterm.write('\b \b');
			}
		} else if (printable) {
			// xterm.write(key);
		}
	});

	xterm.on('paste', function (data, ev) {
		xterm.write(data);
	}); */
}


export default class XTerminal extends Component<Props> {

	constructor() {
		super()
		Terminal.applyAddon(attach);
		Terminal.applyAddon(fit);
		Terminal.applyAddon(fullscreen);
		Terminal.applyAddon(search);
		Terminal.applyAddon(webLinks);
		Terminal.applyAddon(winptyCompat);
	}

	componentDidMount() {
		createTerminal();
		runFakeTerminal();
		runRealTerminal();
		/* 
		*/
		//setTerminalSize();
	}
	render() {
		return (<div className="h-100 w-100 d-inline-block mh-100" id="terminal-container" ></div>)
	}
}