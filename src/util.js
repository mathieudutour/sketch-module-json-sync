var blurMap = {
  0: 'gaussian',
  1: 'motion',
  2: 'zoom',
  3: 'background'
}

var booleanOperationMap = {
  0: 'union',
  1: 'subtract',
  2: 'intersect',
  3: 'difference'
}

var blendModeMap = {
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

var underlineMap = {
  0: 'normal',
  1: 'underline',
  9: 'double-underline'
}

export function isNull (obj) {
  return obj == null || Object.prototype.toString.call(obj) == '[object Null]'
}

export function toArray (t) {
  for (var n = t.count(), r = [], e = 0; n > e; e++) {
    r.push(t.objectAtIndex(e))
  }
  return r
}

export function dataToHexdecimal (data) {
  return data.sha1AsString()
}

export function sha1 (str) {
  const s = NSString.alloc().initWithString(str)
  return s.sha1()
}

export function imageName (image) {
  return image.sha1.substr(0, 7) + '.png'
}

export function imageId (image) {
  return '' + image.sha1().sha1AsString()
}

function system (path, args) {
  if (!args) {
    args = []
  }
  var task = NSTask.alloc().init()
  task.launchPath = path
  task.arguments = args
  var stdout = NSPipe.pipe()
  task.standardOutput = stdout
  task.launch()
  task.waitUntilExit()
  var data = stdout.fileHandleForReading().readDataToEndOfFile()

  return NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding)
}

export function shasum (path) {
  const out = '' + system('/usr/bin/shasum', [path])
  return out.substr(0, 40)
}

export function colorToString (_color) {
  if (_color.svgRepresentation) {
    return '' + _color.svgRepresentation()
  }
  var c = _color.RGBADictionary()
  var color = MSImmutableColor.colorWithRed_green_blue_alpha(c.r, c.g, c.b, c.a)
  return '' + color.stringValueWithAlpha(true)
}

export function stringToColor (str) {
  return MSImmutableColor.colorWithSVGString(str)
}

export function isContains (array, item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === item) {
      return true
    }
  }
  return false
}

export function booleanOperationToNumber (str) {
  var keys = Object.keys(booleanOperationMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (booleanOperationMap[key] === str) {
      return i
    }
  }
  throw new Error('Unknow booleanOperation type. type=' + str)
}

export function blurTypeToString (num) {
  if (blurMap[num]) {
    return blurMap[num]
  }
  throw new Error('Unknow blur type. type=' + num)
}

export function blurTypeToNumber (str) {
  var keys = Object.keys(blurMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (blurMap[key] === str) {
      return i
    }
  }
  throw new Error('Unknow blur type. type=' + str)
}

export function blendModeNumberToString (num) {
  if (blendModeMap[num]) {
    return blendModeMap[num]
  }
  throw new Error('Unknow blendMode type. type=' + num)
}

export function blendModeToNumber (str) {
  var keys = Object.keys(blendModeMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (blendModeMap[key] === str) {
      return i
    }
  }
  throw new Error('Unknow blendMode type. type=' + str)
}

export function underlineNumberToString (num) {
  if (underlineMap[num]) {
    return underlineMap[num]
  }
  throw new Error('Unknow underline type. type=' + num)
}

export function underlineToNumber (str) {
  var keys = Object.keys(underlineMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (underlineMap[key] === str) {
      return parseInt(key)
    }
  }
  throw new Error('Unknow underline type. type=' + str)
}

export function findImage (savedImages, image) {
  for (var i = 0; i < savedImages.length; i++) {
    if (savedImages[i].name == imageId(image)) {
      return savedImages[i]
    }
  }
  return null
}

export function getCurrentDirectory (context) {
  return context.document.fileURL().URLByDeletingLastPathComponent().path()
}

export function getCurrentFileName (context) {
  return context.document.fileURL().lastPathComponent().replace('.sketch', '')
}
