const Color = require('color')
const ThemeGenerator = require('./themeGenerator.js')
const themeGenerator = new ThemeGenerator()

//foreground: ,
const themeMonokai = {
  bg: '#1E1E1E',
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
  bg: '000000',
  bgAlpha: 0.9,
  black: Color('silver').hex(),
  red: Color('red').lighten(0.7).hex(),
  green: Color('green').lighten(0.9).hex(),
  yellow: Color('yellow').hex(),
  blue: Color('blue').lighten(0.3).hex(),
  magenta: Color('magenta').hex(),
  cyan: Color('cyan').hex(),
  white: Color('white').lighten(0.8).hex(),
}, 0.2, 0)

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

module.exports = {
  monokai: themeMonokai,
  rose: themeRose,
  neon: themeNeon,
  ghost: themeGhost,
  default: themeDefault,
  alert: themeAlert,
}
