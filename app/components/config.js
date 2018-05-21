const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')


const linuxHome = function () {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
}

const osxHome = function () {
  return path.join(process.env.HOME, 'Library/Preferences')
}

const Config = function () {
  this.settings = {
    defaultTheme: 'default',
    themes: require('./themes.js')
  }
  this.theme = this.settings.themes[this.settings.defaultTheme]
  this.save()
  return this
}

Config.prototype.homeFolder = function () {
  let result = process.env.APPDATA || (process.platform === 'darwin' ? osxHome() : linuxHome())
  return path.join(result, 'xcmd')
}

Config.prototype.filename = function () {
  return path.join(this.homeFolder(), 'config.json')
}

Config.prototype.save = function () {
  mkdirp.sync(this.homeFolder())
  const data = JSON.stringify(this.settings, '\t', 2)
  fs.writeFileSync(this.filename(), data)
  return path.join(this.homeFolder(), 'config.json')
}



module.exports = Config
