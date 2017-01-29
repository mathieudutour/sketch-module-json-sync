const blendModeMap = {
  0: 'normal',
  1: 'darken',
  2: 'multiply',
  3: 'colorBurn',
  4: 'lighten',
  5: 'screen',
  6: 'colorDodge',
  7: 'overlay',
  8: 'softLight',
  9: 'hardLight',
  10: 'difference',
  11: 'exclusion',
  12: 'hue',
  13: 'saturation',
  14: 'color',
  15: 'lumiosity'
}

function blendModeNumberToString (num) {
  if (blendModeMap[num]) {
    return blendModeMap[num]
  }
  throw new Error('Unknow blendMode type. type=' + num)
}

function blendModeToNumber (str) {
  var keys = Object.keys(blendModeMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (blendModeMap[key] === str) {
      return i
    }
  }
  throw new Error('Unknow blendMode type. type=' + str)
}

export function exportBlendMode (blendMode) {
  return blendModeNumberToString(blendMode)
}

export function importBlendMode (string) {
  return blendModeToNumber(string)
}
