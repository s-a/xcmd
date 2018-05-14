// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './Home.css';
import XTerminal from './XTerminal.jsx';


const path = require('path')
const fs = require('fs')


export default class Home extends Component<Props> {
  props: Props;

  constructor() {
    super()
    this.state = {
      version: require('electron').remote.app.getVersion()
    }
  }

  componentDidMount() {
    this.main.parentElement.classList.add('h-100')
  }

  onCommand(command) {
    console.info(command)
  }

  onDirectoryChange(direcory) {
    window.document.title = direcory
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
            <XTerminal ref={(e) => { this.terminal = e }} onCommand={this.onCommand} onDirectoryChange={this.onDirectoryChange} />
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
