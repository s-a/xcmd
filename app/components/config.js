const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const Color = require('color')
const ThemeGenerator = require('./themeGenerator.js')
const themeGenerator = new ThemeGenerator()

const linuxHome = function () {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
}

const osxHome = function () {
  return path.join(process.env.HOME, 'Library/Preferences')
}
//foreground: ,
const themeMonokai = {
  bg: '#000000',
  bgAlpha: 0.88,
  foreground: Color('#2ee2a6').hex(),
  background: 'transparent',
  cursor: '#efd966',
  cursorAccent: '#efd966',
  // selection: 'red',
  black: "#333333",
  red: "#C4265E",
  green: "#86B42B",
  yellow: "#B3B42B",
  blue: "#6A7EC8",
  magenta: "#8C6BC8",
  cyan: "#56ADBC",
  white: "#e3e3dd",
  brightBlack: "#666666",
  brightRed: "#f92672",
  brightGreen: "#A6E22E",
  brightYellow: "#e2e22e",
  brightBlue: "#819aff",
  brightMagenta: "#AE81FF",
  brightCyan: "#66D9EF",
  brightWhite: "#f8f8f2"
}
const themeRose = {
  bg: '#000000',
  bgAlpha: 0.88,
  foreground: Color('#FF99A1').hex(),
  background: 'transparent',
  cursor: Color('#FF99A1').hex(),
  cursorAccent: Color('#FF99A1').hex(),
  black: Color('#101110').hex(),
  red: Color('#A8000E').lighten(0.7).hex(),
  green: Color('#229922').hex(),
  yellow: Color('#FFFFFF').hex(),
  blue: Color('#DDAADD').hex(),
  magenta: Color('#FF99A1').hex(),
  cyan: Color('#118877').hex(),
  white: Color('#EEFFFF').hex(),
  brightBlack: Color('#4C3D3E').hex(),
  brightRed: Color('#FFCCD0').hex(),
  brightGreen: Color('#83F279').hex(),
  brightYellow: Color('#F2F2F2').hex(),
  brightCyan: Color('#DDD7D7').hex(),
  brightWhite: Color('#F2F2F2').hex()
}

const themeNeon = themeGenerator.generate({
  bg: '000000',
  bgAlpha: 0.9,
  black: 'EEE8CD',
  red: 'FF5333',
  green: 'AAFF00',
  yellow: 'FFAA00',
  blue: '00AAFF',
  magenta: 'FF00AA',
  cyan: 'AA00FF',
  white: 'FFE1FF'
}, 0.25)

const themeGhost = themeGenerator.generate({
  bg: '000000',
  bgAlpha: 0.4,
}, 0.25)

const themeDefault = themeGenerator.generate({
  bg: '1E1E1E',
  bgAlpha: 0.9,
  black: Color('black').lighten(0.9).hex(),
  red: Color('red').lighten(0.7).hex(),
  green: Color('green').lighten(0.9).hex(),
  yellow: Color('yellow').hex(),
  blue: Color('blue').hex(),
  magenta: Color('magenta').hex(),
  cyan: Color('cyan').hex(),
  white: Color('white').hex(),
}, 0.25)

const themeAlert = themeGenerator.generate({
  bg: '660000',
  bgAlpha: 1,
  black: Color('#660000').darken(0.8).hex(),
  red: 'FF9999',
  green: '229999',
  yellow: 'FFF247',
  blue: '229999',
  magenta: '3F7F7F',
  cyan: 'AADDDD',
  white: 'FFFFFF',
}, 0.25)


const Config = function () {
  this.settings = {
    defaultTheme: 'alert',
    themes: {
      monokai: themeMonokai,
      rose: themeRose,
      neon: themeNeon,
      ghost: themeGhost,
      default: themeDefault,
      alert: themeAlert,
    }
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

Config.prototype.watch = function () {

  // Define our watching parameters
  var path = process.cwd()
  const listener = function (changeType, fullPath, currentStat, previousStat) {
    switch (changeType) {
      case 'update':
        console.log('the file', fullPath, 'was updated', currentStat, previousStat)
        break
      case 'create':
        console.log('the file', fullPath, 'was created', currentStat)
        break
      case 'delete':
        console.log('the file', fullPath, 'was deleted', previousStat)
        break
    }
  }

  function next(err) {
    if (err) return console.log('watch failed on', path, 'with error', err)
    console.log('watch successful on', path)
  }

  // Watch the path with the change listener and completion callback
  var stalker = watchr.open(this.filename, listener, next)
}

Config.prototype.save = function () {
  mkdirp.sync(this.homeFolder())
  const data = JSON.stringify(this.settings, '\t', 2)
  fs.writeFileSync(this.filename(), data)
  return path.join(this.homeFolder(), 'config.json')
}



module.exports = Config
