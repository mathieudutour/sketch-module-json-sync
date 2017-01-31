import { round } from '../util'

const alignMap = {
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
    re.paragraphSpacing = round(nsparagraphstyle.paragraphSpacing())
  }
  if (nsparagraphstyle.lineSpacing && nsparagraphstyle.lineSpacing() > 0) {
    re.lineHeight = round(nsparagraphstyle.lineSpacing())
  }
  if (nsparagraphstyle.paragraphSpacingBefore && nsparagraphstyle.paragraphSpacingBefore() > 0) {
    re.paragraphSpacingBefore = round(nsparagraphstyle.paragraphSpacingBefore())
  }
  if (nsparagraphstyle.headIndent && nsparagraphstyle.headIndent() > 0) {
    re.headIndent = round(nsparagraphstyle.headIndent())
  }
  if (nsparagraphstyle.tailIndent && nsparagraphstyle.tailIndent() > 0) {
    re.tailIndent = round(nsparagraphstyle.tailIndent())
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
