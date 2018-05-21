const Color = require('color')

function ThemeGenerator() {
  return this
}

ThemeGenerator.prototype.generate = function (colors, darken) {
  for (const key in colors) {
    if (colors.hasOwnProperty(key)) {
      if (key !== 'bgAlpha') {
        colors[key] = '#' + colors[key].replace(/#/g, '')
      }
    }
  }

  const result = {
    bgAlpha: colors.bgAlpha || 0.88,
    bg: colors.bg || '#000000',
    foreground: Color(colors.white || 'white').hex(),
    background: 'transparent',
    cursor: Color(colors.white || 'white').hex(),
    cursorAccent: Color(colors.white || 'white').hex(),
    black: Color(colors.black || 'black').darken(darken).hex(),
    red: Color(colors.red || 'red').darken(darken).hex(),
    green: Color(colors.green || 'green').darken(darken).hex(),
    yellow: Color(colors.yellow || 'yellow').darken(darken).hex(),
    blue: Color(colors.blue || 'blue').darken(darken).hex(),
    magenta: Color(colors.magenta || 'magenta').darken(darken).hex(),
    cyan: Color(colors.cyan || 'cyan').darken(darken).hex(),
    white: Color(colors.white || 'white').darken(darken).hex(),
    brightBlack: Color(colors.black || 'black').hex(),
    brightRed: Color(colors.red || 'red').hex(),
    brightGreen: Color(colors.green || 'green').hex(),
    brightYellow: Color(colors.yellow || 'yellow').hex(),
    brightCyan: Color(colors.cyan || 'cyan').hex(),
    brightWhite: Color(colors.white || 'white').hex()
  }

  return result
}

module.exports = ThemeGenerator
