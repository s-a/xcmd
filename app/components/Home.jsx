// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import style from './Home.css'
import XTerminal from './XTerminal.jsx'

const chalk = require('chalk');
const chalkOptions = { enabled: true, level: 2 };
const forcedChalk = new chalk.constructor(chalkOptions);
const EventEmitter = require('events')
const path = require('path')
const fs = require('fs')


export default class Home extends Component<Props> {
  props: Props;

  constructor() {
    super()
    this.state = {
      version: require('electron').remote.app.getVersion()
    }

    this.emitter = new EventEmitter()
  }

  componentDidMount() {
    this.main.parentElement.classList.add('h-100')
  }

  onDirectoryChange(info) {
    if (info.local) {
      window.document.title = info.path
    } else {
      window.document.title = '[' + info.path + ']'
    }
  }

  onSubmitCommand(command) {
    if (command === 'xcmd') {
      const color = forcedChalk.hex('#39ff14')
      /* 	const p = path.join(__dirname, '../app/package.json')
      const v = JSON.parse(fs.readFileSync(p).toString()).version
      xterm */
      // debugger
      this.xterm.____ignore = true
      this.xterm.writeln(color(`\nloading config\n`));
    }
    console.info(command)
  }

  onInitXTerm(xterm) {
    this.xterm = xterm
  }

  render() {
    return (
      <div ref={(e) => { this.main = e }} className="container-fluid d-flex h-100 flex-column">
        <div className="row flex-shrink-0">
          <div className="col">
            <div className="xcmd-title" style={{ WebkitAppRegion: 'drag', fontFamily: 'courier-new, courier, monospace', color: '#39ff14' }}>
              $ xcmd Version [{this.state.version}]
            </div>
          </div>
        </div>
        <div className="row flex-fill d-flex justify-content-start overflow-auto">
          <div className="col portlet-container portlet-dropzone mh-100" style={{ backgroundColor: '' }}>
            <XTerminal ref={(e) => { this.terminal = e }} emitter={this.emitter} onInitXTerm={this.onInitXTerm.bind(this)} onCommand={this.onCommand} onSubmitCommand={this.onSubmitCommand.bind(this)} onDirectoryChange={this.onDirectoryChange} />
          </div>
        </div>
        <div className="row flex-shrink-0">
          <div className="col">
            <div className="xcmd-title" style={{ WebkitAppRegion: 'drag' }} id="nterm-title">title</div>
          </div>
        </div>
      </div >
    );
  }
}
