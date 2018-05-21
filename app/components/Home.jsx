// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import style from './Home.css'
import 'font-awesome/css/font-awesome.min.css'
import XTerminal from './XTerminal.jsx'
import Git from './git.jsx'

const chalk = require('chalk')
const chalkOptions = { enabled: true, level: 2 }
const forcedChalk = new chalk.constructor(chalkOptions)
const path = require('path')
const fs = require('fs')

const theme = {
  foreground: '#2ee2a6',
  background: 'transparent',
  cursor: '#efd966',
  cursorAccent: '#efd966',
  // selection: 'red',
  black: "#333333",
  red: "#C4265E", // the bright color with ~75% transparent on the background
  green: "#86B42B",
  yellow: "#B3B42B",
  blue: "#6A7EC8",
  magenta: "#8C6BC8",
  cyan: "#56ADBC",
  white: "#e3e3dd",
  brightBlack: "#666666",
  brightRed: "#f92672",
  brightGreen: "#A6E22E",
  brightYellow: "#e2e22e", // hue shifted #A6E22E
  brightBlue: "#819aff", // hue shifted #AE81FF
  brightMagenta: "#AE81FF",
  brightCyan: "#66D9EF",
  brightWhite: "#f8f8f2"
}

export default class Home extends Component<Props> {
  props: Props;

  constructor() {
    super()
    this.state = {
      theme,
      version: require('electron').remote.app.getVersion()
    }
  }

  componentDidMount() {
    this.main.parentElement.classList.add('h-100')
  }


  onDirectoryChange(info) {
    const self = this
    if (info.local) {
      window.document.title = info.path

      this.setState({ fullpath: info.path })
    } else {
      window.document.title = '[' + info.path + ']'
      this.setState({
        titleColor: this.state.theme.brightRed,
        fullpath: info.path
      })
    }
  }

  onSubmitCommand(command) {
    if (command === 'xcmd') {
      const color = forcedChalk.red
      /* 	const p = path.join(__dirname, '../app/package.json')
      const v = JSON.parse(fs.readFileSync(p).toString()).version
      xterm */
      this.xterm.____ignore = true
      this.xterm.writeln(color(` loading config\n`));
      window.document.getElementById('body').style.backgroundColor = 'rgba(0, 0, 0, 0.88)';
    }
    console.info(command)
  }

  onInitXTerm(xterm) {
    this.xterm = xterm
  }

  render() {

    const renderFooter = () => {
      return (
        <div className="">
          <div className="row">
            <div className="col-md-4">
              <Git fullpath={this.state.fullpath} theme={this.state.theme} />
            </div>
            <div className="col-md-4">
              {renderNpmInfo()}
            </div>
            <div className="col-md-4">
            </div>
          </div>
        </div>
      )
    }

    const renderNpmInfo = () => {
      if (this.state.gitInfo) {
        return (
          <div>
            <svg width="36" className="footer-status-icon" viewBox="0 0 18 7">
              <path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z" />
              <polygon fill="#FFFFFF" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 " />
              <path fill="#FFFFFF" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z" />
              <polygon fill="#FFFFFF" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 " />
            </svg>
          </div>
        )
      }
    }

    return (
      <div ref={(e) => { this.main = e }} className="container-fluid d-flex h-100 flex-column">
        <div className="row flex-shrink-0">
          <div className="col">
            <div className="xcmd-title" style={{ WebkitAppRegion: 'drag', fontFamily: 'courier-new, courier, monospace', color: this.state.theme.white }}>
              xcmd v{this.state.version}
            </div>
          </div>
        </div>
        <div className="row flex-fill d-flex justify-content-start overflow-auto">
          <div className="col portlet-container portlet-dropzone mh-100" style={{ backgroundColor: '' }}>
            <XTerminal ref={(e) => { this.terminal = e }} theme={this.state.theme} emitter={this.emitter} onInitXTerm={this.onInitXTerm.bind(this)} onCommand={this.onCommand} onSubmitCommand={this.onSubmitCommand.bind(this)} onDirectoryChange={this.onDirectoryChange.bind(this)} />
          </div>
        </div>
        <div className="row flex-shrink-0">
          <div className="col">
            <div id="nterm-footer" style={{ color: this.state.gitInfoColor }}>
              {renderFooter()}
            </div>
          </div>
        </div>
      </div >
    )
  }
}
