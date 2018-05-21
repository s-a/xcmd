// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import style from './Home.css'
import 'font-awesome/css/font-awesome.min.css'
import XTerminal from './XTerminal.jsx'
import Git from './git.jsx'
import Config from './config.js'

const config = new Config()
const chalk = require('chalk')
const chalkOptions = { enabled: true, level: 2 }
const forcedChalk = new chalk.constructor(chalkOptions)
const path = require('path')
const fs = require('fs')
const Color = require('color')


export default class Home extends Component<Props> {
  props: Props;

  constructor() {
    super()
    this.state = {
      theme: config.theme,
      version: require('electron').remote.app.getVersion()
    }
  }

  chalkTest() {
    const result = []
    result.push(forcedChalk.black('black'))
    result.push(forcedChalk.red('red'))
    result.push(forcedChalk.green('green'))
    result.push(forcedChalk.yellow('yellow'))
    result.push(forcedChalk.blue('blue'))
    result.push(forcedChalk.magenta('magenta'))
    result.push(forcedChalk.cyan('cyan'))
    result.push(forcedChalk.white('white'))
    result.push(forcedChalk.gray('blackBright'))
    result.push(forcedChalk.redBright('redBright'))
    result.push(forcedChalk.greenBright('greenBright'))
    result.push(forcedChalk.yellowBright('yellowBright'))
    result.push(forcedChalk.blueBright('blueBright'))
    result.push(forcedChalk.magentaBright('magentaBright'))
    result.push(forcedChalk.cyanBright('cyanBright'))
    result.push(forcedChalk.whiteBright('whiteBright'))
    return result.join(' ')
  }

  onInitXTerm(xterm) {
    this.xterm = xterm
    this.xterm.writeln(forcedChalk.hex(this.state.theme.blue)('configs at ') + forcedChalk.hex(this.state.theme.yellow)(config.filename()) + '\n')
    this.xterm.writeln(this.chalkTest() + '\n')
    config.save()
  }

  componentDidMount() {
    this.main.parentElement.classList.add('h-100')
    const alpha = this.state.theme.bgAlpha || 0.88
    let bgColor = Color(this.state.theme.bg || '#00').alpha(alpha).array()
    bgColor = (alpha === 1 ? ' rgb' : 'rgba') + '(' + bgColor.join(',') + ')'
    console.log(this.state.theme.bgAlpha, bgColor)
    window.document.getElementById('body').style.backgroundColor = bgColor;
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
    if (command === 'color') {
      this.xterm.____ignore = true
      this.xterm.writeln(this.chalkTest() + '\n')
    }
    console.info(command)
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
            <XTerminal ref={(e) => { this.terminal = e }} theme={this.state.theme} onInitXTerm={this.onInitXTerm.bind(this)} onCommand={this.onCommand} onSubmitCommand={this.onSubmitCommand.bind(this)} onDirectoryChange={this.onDirectoryChange.bind(this)} />
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
