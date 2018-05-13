// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './Home.css';
import XTerminal from './XTerminal.jsx';


/* colsElement.addEventListener('change', setTerminalSize);
rowsElement.addEventListener('change', setTerminalSize); */


export default class Home extends Component<Props> {
  props: Props;
  componentDidMount() {
    this.main.parentElement.classList.add('h-100')

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
            <XTerminal />
          </div>
        </div>
        <div className="row flex-shrink-0">
          <div className="col">
            <div className="text-danger" style={{ WebkitAppRegion: 'drag' }} id="nterm-title">title</div>
          </div>
        </div>
      </div>



    );
  }
}
