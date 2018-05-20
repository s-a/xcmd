// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import style from './Home.css'
import 'font-awesome/css/font-awesome.min.css'
import XTerminal from './XTerminal.jsx'

const chalk = require('chalk');
const chalkOptions = { enabled: true, level: 2 };
const forcedChalk = new chalk.constructor(chalkOptions);
const EventEmitter = require('events')
const path = require('path')
const fs = require('fs')
const branch = require('git-branch')
const isGitClean = require('is-git-clean')
const shell = require('shelljs')

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
      version: require('electron').remote.app.getVersion(),
      gitInfo: ''
    }

    this.emitter = new EventEmitter()
  }

  componentDidMount() {
    this.main.parentElement.classList.add('h-100')
  }

  /* checkCommitsBehind = async repository => {
    return new Promise((resolve, reject) => {
      const gitFolder = path.join(repository, '.git')
      const executionResult = await shell.exec(`git --git-dir=${gitFolder} rev-list --left-right --count development...HEAD`, {
        silent: true
      })
      if (executionResult.code === 0) {
        const s = executionResult.stdout.replace(/\n/g, '').split('\t')
        const behind = parseInt(s[0], 10)
        const ahead = parseInt(s[1], 10)
        resolve({ behind, ahead })
      } else {
        reject(new Error(executionResult.stderr))
      }
    })
  } */


  onDirectoryChange(info) {
    const self = this
    if (info.local) {
      window.document.title = info.path

      const gitFolder = path.join(info.path, '.git')
      if (fs.existsSync(gitFolder)) {
        const err = function (err) {
          self.setState({
            gitInfo: err.message
          })
          console.error(err)
        }
        branch(gitFolder)
          .then(name => {
            const clean = isGitClean(info.path).then(function (clean) {

              const color = (clean ? self.state.theme.brightGreen : self.state.theme.brightRed)
              const gitStatus = (clean ? `${name} (clean)` : `${name} (not clean)`)
              self.setState({
                gitInfo: gitStatus,
                gitInfoColor: color,
                titleColor: color
              })
            }).catch(err)
          }).catch(err)
      } else {
        this.setState({
          gitInfo: '',
          titleColor: self.state.theme.brightBlue
        })
      }

    } else {
      window.document.title = '[' + info.path + ']'
      this.setState({
        gitInfo: '',
        titleColor: this.state.theme.brightRed
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
    const renderGitInfo = () => {
      if (this.state.gitInfo) {
        return (
          <div>
            <svg id="git-status-icon" width="18" height="18" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"><path d="M251.172 116.594L139.4 4.828c-6.433-6.437-16.873-6.437-23.314 0l-23.21 23.21 29.443 29.443c6.842-2.312 14.688-.761 20.142 4.693 5.48 5.489 7.02 13.402 4.652 20.266l28.375 28.376c6.865-2.365 14.786-.835 20.269 4.657 7.663 7.66 7.663 20.075 0 27.74-7.665 7.666-20.08 7.666-27.749 0-5.764-5.77-7.188-14.235-4.27-21.336l-26.462-26.462-.003 69.637a19.82 19.82 0 0 1 5.188 3.71c7.663 7.66 7.663 20.076 0 27.747-7.665 7.662-20.086 7.662-27.74 0-7.663-7.671-7.663-20.086 0-27.746a19.654 19.654 0 0 1 6.421-4.281V94.196a19.378 19.378 0 0 1-6.421-4.281c-5.806-5.798-7.202-14.317-4.227-21.446L81.47 39.442l-76.64 76.635c-6.44 6.443-6.44 16.884 0 23.322l111.774 111.768c6.435 6.438 16.873 6.438 23.316 0l111.251-111.249c6.438-6.44 6.438-16.887 0-23.324" fill="#DE4C36" /></svg>
            {this.state.gitInfo}
          </div>
        )
      }
    }

    return (
      <div ref={(e) => { this.main = e }} className="container-fluid d-flex h-100 flex-column">
        <div className="row flex-shrink-0">
          <div className="col">
            <div className="xcmd-title" style={{ WebkitAppRegion: 'drag', fontFamily: 'courier-new, courier, monospace', color: this.state.titleColor }}>
              $ xcmd Version [{this.state.version}]
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
              {renderGitInfo()}
            </div>
          </div>
        </div>
      </div >
    );
  }
}
