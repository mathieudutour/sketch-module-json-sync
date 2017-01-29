var textTransformMap = {
  0: 'normal',
  1: 'uppercase',
  2: 'lowercase'
}

function textTransformNumberToString (num) {
  if (textTransformMap[num]) {
    return textTransformMap[num]
  }
  throw new Error('Unknow text-transform type. type=' + num)
}

function textTransformToNumber (str) {
  var keys = Object.keys(textTransformMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (textTransformMap[key] === str) {
      return parseInt(key)
    }
  }
  throw new Error('Unknow text-transform type. type=' + str)
}

var underlineMap = {
  0: 'normal',
  1: 'underline',
  9: 'double-underline'
}

function underlineNumberToString (num) {
  if (underlineMap[num]) {
    return underlineMap[num]
  }
  throw new Error('Unknow underline type. type=' + num)
}

function underlineToNumber (str) {
  var keys = Object.keys(underlineMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (underlineMap[key] === str) {
      return parseInt(key)
    }
  }
  throw new Error('Unknow underline type. type=' + str)
}

export function exportTextDecoration (attrs) {
  const re = {}
  // Underline
  if (attrs.NSUnderline > 0) {
    re.textDecoration = underlineNumberToString(attrs.NSUnderline)
  }

  // Line through
  if (attrs.NSStrikethrough > 0) {
    re.textDecoration = 'line-through'
  }

  // Text transform
  if (attrs.MSAttributedStringTextTransformAttribute > 0) {
    re.textTransform = textTransformNumberToString(attrs.MSAttributedStringTextTransformAttribute)
  }
  return re
}

export function importTextDecoration (obj, s) {
  if (s.textDecoration == 'line-through') {
    obj.addAttribute_value('NSStrikethrough', 1)
  } else if (s.textDecoration) {
    obj.addAttribute_value('NSUnderline', underlineToNumber(s.textDecoration))
  }
  if (s.textTransform) {
    obj.addAttribute_value('MSAttributedStringTextTransformAttribute', textTransformToNumber(s.textTransform))
  }
}
