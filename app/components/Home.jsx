// @flow
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

const os = require('os');
const pty = require('node-pty');

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);
Terminal.applyAddon(search);
Terminal.applyAddon(webLinks);
Terminal.applyAddon(winptyCompat);
type Props = {};

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

/* colsElement.addEventListener('change', setTerminalSize);
rowsElement.addEventListener('change', setTerminalSize); */

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

  window.term = xterm; // Expose `term` to window for debugging purposes
  /*   term.on('resize', function (size) {
      if (!pid) {
        return;
      }
      var cols = size.cols,
        rows = size.rows,
        url = '/terminals/' + pid + '/size?cols=' + cols + '&rows=' + rows;

      fetch(url, { method: 'POST' });
    }); */

  xterm.open(terminalContainer);
  xterm.winptyCompatInit();
  xterm.webLinksInit();
  xterm.fit();
  xterm.focus();

  // fit is called within a setTimeout, cols and rows need this.
  /*   setTimeout(function () {
      colsElement.value = term.cols;
      rowsElement.value = term.rows;
      paddingElement.value = 0;

      // Set terminal size again to set the specific dimensions on the demo
      setTerminalSize();

      fetch('/terminals?cols=' + term.cols + '&rows=' + term.rows, { method: 'POST' }).then(function (res) {

        res.text().then(function (processId) {
          pid = processId;
          socketURL += processId;
          socket = new WebSocket(socketURL);
          socket.onopen = runRealTerminal;
          socket.onclose = runFakeTerminal;
          socket.onerror = runFakeTerminal;
        });
      });
    }, 0); */
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

  /*  term.on('key', function (key, ev) {
     var printable = (
       !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
     );

     if (ev.keyCode == 13) {
       term.prompt();
     } else if (ev.keyCode == 8) {
       // Do not delete the prompt
       if (term.x > 2) {
         term.write('\b \b');
       }
     } else if (printable) {
       // term.write(key);
     }
   }); */

  /*   term.on('paste', function (data, ev) {
      term.write(data);
    }); */
}

export default class Home extends Component<Props> {
  props: Props;
  componentDidMount() {
    this.main.parentElement.classList.add('h-100')
    createTerminal();
    runFakeTerminal();
    runRealTerminal();
    //setTerminalSize();
  }
  render() {
    return (

      <div ref={(e) => { this.main = e }} className="container-fluid d-flex h-100 flex-column" style={{ backgroundColor: '' }}>

        <div className="row flex-shrink-0">
          <div className="col">
            <div className="text-danger" style={{ WebkitAppRegion: 'drag' }} id="nterm-title">title</div>
          </div>
        </div>
        <div className="row flex-fill d-flex justify-content-start overflow-auto">

          <div className="col portlet-container portlet-dropzone mh-100" style={{ backgroundColor: '' }}>
            <div className="h-100 w-100 d-inline-block mh-100" id="terminal-container" ></div>
          </div>
        </div>
      </div>



    );
  }
}
