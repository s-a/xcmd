const Color = require('color')

function ThemeGenerator() {
  return this
}

ThemeGenerator.prototype.generate = function (colors, darken, saturate = 0) {
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
    background: 'transparent',
    cursor: Color(colors.white || 'white').saturate(saturate).hex(),
    cursorAccent: Color(colors.white || 'white').saturate(saturate).hex(),
    black: Color(colors.black || 'black').darken(darken).saturate(saturate).hex(),
    red: Color(colors.red || 'red').darken(darken).saturate(saturate).hex(),
    green: Color(colors.green || 'green').darken(darken).saturate(saturate).hex(),
    yellow: Color(colors.yellow || 'yellow').darken(darken).saturate(saturate).hex(),
    blue: Color(colors.blue || 'blue').darken(darken).saturate(saturate).hex(),
    magenta: Color(colors.magenta || 'magenta').darken(darken).saturate(saturate).hex(),
    cyan: Color(colors.cyan || 'cyan').darken(darken).saturate(saturate).hex(),
    white: Color(colors.white || 'white').darken(darken).saturate(saturate).hex(),
    brightBlack: Color(colors.black || 'black').saturate(saturate).hex(),
    brightRed: Color(colors.red || 'red').saturate(saturate).hex(),
    brightGreen: Color(colors.green || 'green').saturate(saturate).hex(),
    brightYellow: Color(colors.yellow || 'yellow').saturate(saturate).hex(),
    brightCyan: Color(colors.cyan || 'cyan').saturate(saturate).hex(),
    brightWhite: Color(colors.white || 'white').saturate(saturate).hex()
  }

  result.foreground = result.white

  return result
}

module.exports = ThemeGenerator
