import fs from 'sketch-module-fs'
import { exportColor, importColor } from './NS/color'
import { exportFont, importFont } from './NS/font'
import { exportKern, importKern } from './NS/kern'
import { exportSpacing, importSpacing } from './NS/spacing'
import { exportTextDecoration, importTextDecoration } from './NS/textDecoration'

export function exportTextStyle (attrs) {
  let re = {}
  if (attrs.NSColor) {
    re.color = exportColor(attrs.NSColor)
  }

  if (attrs.NSFont) {
    re = {...exportFont(attrs.NSFont), ...re}
  }

  if (attrs.NSKern) {
    re.letterSpacing = exportKern(attrs.NSKern)
  }

  if (attrs.NSParagraphStyle) {
    re = {...exportSpacing(attrs.NSParagraphStyle), ...re}
  }

  return {...exportTextDecoration(attrs), ...re}
}

export function exportSharedTextStyle (path, layer, index) {
  const json = {
    objectId: String(layer.objectID()),
    name: String(layer.name()),
    index,
    styles: exportTextStyle(layer.style().textStyle().attributes())
  }

  fs.writeFile(path + '/' + json.name + '.json', JSON.stringify(json, null, '  '))
}

export function importTextStyle (text, s) {
  if (s.fontFamily) {
    text.font = importFont(s)
  }
  if (s.letterSpacing) {
    text.setKerning(importKern(s.letterSpacing))
  }
  importSpacing(text, s)
  importTextDecoration(text, s)
  if (s.color) {
    text.textColor = importColor(s.color)
  }
}

export function importSharedTextStyle (doc, json) {
  const sharedTextStyles = doc.documentData().layerTextStyles()

  const text = MSTextLayer.alloc().init()
  text.stringValue = 'temp text layer for shared style'

  importTextStyle(text, json.styles)

  sharedTextStyles.addSharedStyleWithName_firstInstance(json.name, text.style())
  sharedTextStyles.objects()[sharedTextStyles.objects().length - 1].objectID = json.objectId
}
