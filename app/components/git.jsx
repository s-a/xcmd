// @flow
import React, { Component } from 'react'

const chalk = require('chalk');
const chalkOptions = { enabled: true, level: 2 };
const forcedChalk = new chalk.constructor(chalkOptions);
const path = require('path')
const fs = require('fs')
const branch = require('git-branch')
const isGitClean = require('is-git-clean')
const shell = require('shelljs')

const findup = function (basedir, filename) {
    var result = null;
    if (fs.existsSync(path.join(basedir, filename))) {
        result = {
            dir: basedir,
            filename: filename,
            fullpath: path.join(basedir, filename)
        };
    } else {
        var newdir = path.join(basedir, "..");
        if (newdir !== basedir) {
            result = findup(newdir, filename);
        }
    }

    return result;
}

export default class Git extends Component<Props> {
    props: Props;

    constructor() {
        super()
        this.state = {
            fullpath: null
        }
    }

    componentWillMount() {

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
    componentDidUpdate() {
        if (this.state.fullpath !== this.props.fullpath) {
            this.fetchDirectoryInformation()
        }
    }

    fetchDirectoryInformation() {
        const self = this
        const state = function (msg) {
            self.state.fullpath = self.props.fullpath
            self.setState({
                gitInfo: msg,
                fullpath: self.props.fullpath
            })
            console.error(msg)
        }
        if (this.props && this.props.fullpath && fs.existsSync(this.props.fullpath)) {
            const gitFolder = findup(this.props.fullpath, '.git')
            if (gitFolder) {
                const currentBranch = branch.sync(gitFolder.fullpath)
                const clean = isGitClean.sync(self.props.fullpath)
                const color = (clean ? self.props.theme.green : self.props.theme.red)
                const gitStatus = (clean ? `${currentBranch} (clean)` : `${currentBranch} (not clean)`)
                self.setState({
                    gitInfo: gitStatus,
                    gitInfoColor: color,
                    fullpath: this.props.fullpath
                })
            } else {
                state(null)
            }
        } else {
            state(null)
        }
    }

    render() {
        if (this.state.gitInfo) {
            return (
                <div style={{ color: this.state.gitInfoColor }}>
                    <svg width="18" className="footer-status-icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"><path d="M251.172 116.594L139.4 4.828c-6.433-6.437-16.873-6.437-23.314 0l-23.21 23.21 29.443 29.443c6.842-2.312 14.688-.761 20.142 4.693 5.48 5.489 7.02 13.402 4.652 20.266l28.375 28.376c6.865-2.365 14.786-.835 20.269 4.657 7.663 7.66 7.663 20.075 0 27.74-7.665 7.666-20.08 7.666-27.749 0-5.764-5.77-7.188-14.235-4.27-21.336l-26.462-26.462-.003 69.637a19.82 19.82 0 0 1 5.188 3.71c7.663 7.66 7.663 20.076 0 27.747-7.665 7.662-20.086 7.662-27.74 0-7.663-7.671-7.663-20.086 0-27.746a19.654 19.654 0 0 1 6.421-4.281V94.196a19.378 19.378 0 0 1-6.421-4.281c-5.806-5.798-7.202-14.317-4.227-21.446L81.47 39.442l-76.64 76.635c-6.44 6.443-6.44 16.884 0 23.322l111.774 111.768c6.435 6.438 16.873 6.438 23.316 0l111.251-111.249c6.438-6.44 6.438-16.887 0-23.324" fill="#DE4C36" /></svg>
                    {this.state.gitInfo}
                </div>
            )
        } else {
            return null
        }
    }
}
