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
import KeyCode from 'key-code';

const pty = require('node-pty')
const path = require('path')
const fs = require('fs')
const pathParser = require('./path-parser.js')

let xterm;
let terminalContainer;
let ptyProcess;


window.onresize = function (event) {
	xterm.fit();
};

function createTerminal() {
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

	const color = forcedChalk.hex('#39ff14')
	/* 	const p = path.join(__dirname, '../app/package.json')
		const v = JSON.parse(fs.readFileSync(p).toString()).version
		xterm.writeln(color(`$ xcmd [Version ${v}]`)); */
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
		Terminal.applyAddon(attach)
		Terminal.applyAddon(fit)
		Terminal.applyAddon(fullscreen)
		Terminal.applyAddon(search)
		Terminal.applyAddon(webLinks)
		Terminal.applyAddon(winptyCompat)
		this.dir = process.cwd()
	}

	componentDidMount() {
		createTerminal()
		runFakeTerminal()
		this.runRealTerminal()
	}

	runRealTerminal() {
		const self = this
		const defaultShell = require('default-shell')
		ptyProcess = pty.spawn(defaultShell, [], {
			name: 'xterm-color',
			cols: 80,
			rows: 30,
			cwd: this.dir,
			env: process.env
		})

		let ptyProcessReady = false

		xterm.on('data', function (data) {
			ptyProcess.write(data)
		})

		ptyProcess.on('exit', function (key, e) {
			require('electron').remote.app.quit()
		})

		ptyProcess.on('data', function (data) {
			if (!ptyProcessReady) {
				xterm.fit()
				ptyProcessReady = true
			}
			let dir = data.split('\n')
			dir = dir[dir.length - 1]
			dir = dir.split('>')[0]
			dir = pathParser(dir)[0]


			// Sanitize the string to be safe for use as a filename.

			if (fs.existsSync(dir) && dir !== self.dir) {
				debugger
				self.dir = dir
				self.props.onDirectoryChange(self.dir)
			}
			xterm.write(data)
		});
	}

	render() {
		return (<div className="h-100 w-100 d-inline-block mh-100" id="terminal-container" ></div>)
	}
}