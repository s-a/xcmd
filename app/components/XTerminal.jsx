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
const stripAnsi = require('strip-ansi')

let xterm;
let terminalContainer;
let ptyProcess;


window.onresize = function (event) {
	xterm.fit();
};


function getCommandInput() {
	const clearLines = []
	const lines = xterm.linkifier._terminal.buffers._activeBuffer._lines._array
	if (lines.length) {
		for (let i = 0; i < lines.length; i++) {
			const clearLine = []
			const line = lines[i]
			if (line) {
				for (let r = 0; r < line.length; r++) {
					const row = line[r]
					clearLine.push(row[1])
				}

				const text = clearLine.join('').trim()
				if (text !== '') {
					clearLines.push(text)
				}
			} else {
				break
			}
		}
	}
	let lastLine = clearLines[clearLines.length - 1]

	var isWin = process.platform === "win32"
	const splitChar = (isWin ? '>' : '$')
	lastLine = (lastLine.split(splitChar)[1])
	return lastLine
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
		this.xterm = xterm
	}

	createTerminal() {
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
		this.props.onInitXTerm(xterm)
		/* 
			xterm.setOption('theme', {
				background: 'transparent',
				white: '#ccc',
				red: '#F00',
				brightRed: '#F22',
				// ... (can be a partial list)
			}); */
		xterm.open(terminalContainer);
		xterm.winptyCompatInit();
		xterm.webLinksInit();
		xterm.fit();
		xterm.focus();
	}


	componentDidMount() {
		this.createTerminal()
		runFakeTerminal()
		this.runRealTerminal()
	}
	to_image() {
		console.log('save')
		const CanvasToImage = require('canvas-to-image-node')
		let canvas = window.document.getElementsByClassName('xterm-text-layer')
		if (canvas) {
			canvas = canvas[0]
			const img = CanvasToImage.convertToPNG(canvas, canvas.width, canvas.height);
			const data = canvas.toDataURL().split(';base64,').pop();
			const fn = "c:\\temp\\out.png"
			require("fs").writeFileSync(fn, data, { encoding: 'base64' });
			const b = Buffer.from(data, 'base64')
		}
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
			if (xterm.____ignore === true) {
				ptyProcess.write(String.fromCharCode(27))
				xterm.____ignore = false
			} else {
				ptyProcess.write(data)
			}
		})

		xterm.on('linefeed', function (key) {
			/* self.to_image()
			console.log('key') */
		})

		xterm.on('key', function (a, e) {
			if (e.keyCode === 13) {
				const cmd = getCommandInput()
				self.props.onSubmitCommand(cmd)
			}
		})

		ptyProcess.on('exit', function (key, e) {
			require('electron').remote.app.quit()
		})

		ptyProcess.on('data', function (data) {
			if (!ptyProcessReady) {
				xterm.fit()
				ptyProcessReady = true
				self.props.onDirectoryChange({
					path: process.cwd(),
					local: true
				})

			}
			const lines = data.split('\n')
			const lastLine = stripAnsi(lines[lines.length - 1])

			const isWin = process.platform === "win32"
			const splitChar = (isWin ? '>' : '$')
			let dir = lastLine.split(splitChar)[0]
			dir = pathParser(dir)[0]

			// Sanitize the string to be safe for use as a filename.
			if (data.indexOf('ssh ') !== -1) {
				console.warn(data)
			}
			if (dir && dir.length > 1 && dir !== self.dir) {
				self.dir = dir
				const localDirecory = fs.existsSync(dir)

				self.props.onDirectoryChange({
					path: localDirecory ? self.dir : lastLine,
					local: localDirecory
				})
			}
			xterm.write(data)
		});
	}

	render() {
		return (<div className="h-100 w-100 d-inline-block mh-100" id="terminal-container" ></div>)
	}
}