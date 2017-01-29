import { exportFills, importFills } from './fill'

var positionMap = {
  0: 'center',
  1: 'inside',
  2: 'outside'
}

function positionNumberToString (num) {
  if (positionMap[num]) {
    return positionMap[num]
  }
  throw new Error('Unknow position type. type=' + num)
}

function positionToNumber (str) {
  var keys = Object.keys(positionMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (positionMap[key] === str) {
      return parseInt(key)
    }
  }
  throw new Error('Unknow position type. type=' + str)
}

export function exportBorders (borders) {
  return exportFills(borders).map((b, i) => {
    return {
      ...b,
      position: positionNumberToString(borders[i].position()),
      thickness: borders[i].thickness()
    }
  })
}

export function importBorders (borders) {
  return importFills(borders, '', () => MSStyleBorder.alloc().init()).map((b, i) => {
    b.position = positionToNumber(borders[i].position)
    b.thickness = borders[i].thickness
    return b
  })
}
