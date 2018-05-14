const windows = /(([a-z]|[A-Z]):(?=\\(?![\0-\37<>:"/\\|?*])|\/(?![\0-\37<>:"/\\|?*])|$)|^\\(?=[\\\/][^\0-\37<>:"/\\|?*]+)|^(?=(\\|\/)$)|^\.(?=(\\|\/)$)|^\.\.(?=(\\|\/)$)|^(?=(\\|\/)[^\0-\37<>:"/\\|?*]+)|^\.(?=(\\|\/)[^\0-\37<>:"/\\|?*]+)|^\.\.(?=(\\|\/)[^\0-\37<>:"/\\|?*]+))((\\|\/)[^\0-\37<>:"/\\|?*]+|(\\|\/)$)*()/g
const unix = /[/].*[\\/]*/g
var isWin = process.platform === "win32"

module.exports = function parsePathFromString(str) {
  let result = null
  if (isWin) {
    result = str.match(windows)
  } else {
    result = str.match(unix)
  }
  return result || []
}
