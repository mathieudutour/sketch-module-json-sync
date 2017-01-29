var alignMap = {
  0: 'left',
  1: 'right',
  2: 'center',
  3: 'justified'
}

function alignNumberToString (num) {
  if (alignMap[num]) {
    return alignMap[num]
  }
  throw new Error('Unknow align type. type=' + num)
}

function alignToNumber (str) {
  var keys = Object.keys(alignMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (alignMap[key] === str) {
      return parseInt(key)
    }
  }
  throw new Error('Unknow align type. type=' + str)
}

export function exportSpacing (nsparagraphstyle) {
  const re = {}
  if (nsparagraphstyle.paragraphSpacing && nsparagraphstyle.paragraphSpacing() > 0) {
    re.paragraphSpacing = parseFloat(nsparagraphstyle.paragraphSpacing()).toFixed(3)
  }
  if (nsparagraphstyle.lineSpacing && nsparagraphstyle.lineSpacing() > 0) {
    re.lineHeight = parseFloat(nsparagraphstyle.lineSpacing()).toFixed(3)
  }
  if (nsparagraphstyle.paragraphSpacingBefore && nsparagraphstyle.paragraphSpacingBefore() > 0) {
    re.paragraphSpacingBefore = parseFloat(nsparagraphstyle.paragraphSpacingBefore()).toFixed(3)
  }
  if (nsparagraphstyle.headIndent && nsparagraphstyle.headIndent() > 0) {
    re.headIndent = parseFloat(nsparagraphstyle.headIndent()).toFixed(3)
  }
  if (nsparagraphstyle.tailIndent && nsparagraphstyle.tailIndent() > 0) {
    re.tailIndent = parseFloat(nsparagraphstyle.tailIndent()).toFixed(3)
  }
  re.textAlign = alignNumberToString(nsparagraphstyle.alignment())
  return re
}

export function importSpacing (obj, s) {
  if (s.paragraphSpacing) {
    obj.paragraphStyle().setParagraphSpacing(Number(s.paragraphSpacing))
  }
  if (s.lineHeight) {
    obj.lineHeight = Number(s.lineHeight)
  }
  if (s.paragraphSpacingBefore) {
    obj.paragraphStyle().setParagraphSpacingBefore(Number(s.paragraphSpacingBefore))
  }
  if (s.headIndent) {
    obj.paragraphStyle().setHeadIndent(Number(s.headIndent))
  }
  if (s.tailIndent) {
    obj.paragraphStyle().setTailIndent(Number(s.tailIndent))
  }
  obj.textAlignment = alignToNumber(s.textAlign)
}
