import { underlineNumberToString, isNull, underlineToNumber } from '../util'
import { exportShadow, exportBlur } from './layerMixin'
import { parseStyle, setBlur, setShadow } from '../importUtils'
import GeneralLayer from './general'

export default class TextLayer extends GeneralLayer {
  constructor (...args) {
    super(...args)

    this.shadow = exportShadow.bind(this)
    this.blur = exportBlur.bind(this)
  }

  styles () {
    return {
      ...super.styles(),
      ...this.cssAttributes(),
      ...this.cssText(),
      ...this.blur(),
      ...this.shadow()
    }
  }

  cssText () {
    var re = {}
    if (this.className() == 'MSTextLayer') {
      // Text Behaviour: 0:auto 1:fixed
      re.textBehaviour = this._layer.textBehaviour() == 0 ? 'auto' : 'fixed'

      // Text Align
      var textAlign
      if (this._layer.textAlignment() == 0) {
        textAlign = 'left'
      } else if (this._layer.textAlignment() == 1) {
        textAlign = 'right'
      } else if (this._layer.textAlignment() == 2) {
        textAlign = 'center'
      }
      re.textAlign = textAlign

      // Letter Spacing
      if (this._layer.characterSpacing() && this._layer.characterSpacing() > 0) {
        re.letterSpacing = parseFloat(this._layer.characterSpacing()).toFixed(3)
      }

      // Content
      re.content = this.stringValue()

      var attrs = this._layer.styleAttributes()

      // Underline
      if (attrs.NSUnderline > 0) {
        re.textDecoration = underlineNumberToString(attrs.NSUnderline)
      }

      // Line through
      if (attrs.NSStrikethrough > 0) {
        re.textDecoration = 'line-through'
      }
    }
    return re
  }

  static importJSON (doc, json, parent, current) {
    if (isNull(parent) || (!isNull(parent) && !parent.object)) {
      return
    }

    var s = parseStyle(json.styles)
    var text = MSTextLayer.alloc().init()
    text.objectID = json.objectId

    if (s.content) {
      text.stringValue = s.content
    }

    text.font = NSFont.fontWithName_size(s.fontFamily, s.fontSize)
    if (s.color) {
      text.textColor = s.color
    }

    if (s.lineHeight) {
      text.lineHeight = s.lineHeight
    }

    if (s.textAlign) {
      if (s.textAlign == 'left') {
        text.textAlignment = 0
      } else if (s.textAlign == 'right') {
        text.textAlignment = 1
      } else if (s.textAlign == 'center') {
        text.textAlignment = 2
      }
    }

    if (s.letterSpacing) {
      text.characterSpacing = s.letterSpacing
    }

    if (s.textBehaviour) {
      text.textBehaviour = s.textBehaviour == 'auto' ? 0 : 1
    }

    if (s.rotation) {
      text.rotation = s.rotation
    }

    if (s.blur) {
      setBlur(text, s.blur)
    }

    if (s.shadow) {
      setShadow(text, s.shadow)
    }

    if (s.hidden) {
      text.isVisible = false
    }

    if (s.opacity) {
      text.style().contextSettings().opacity = s.opacity
    }

    if (s.blendMode) {
      text.style().contextSettings().blendMode = s.blendMode
    }

    if (s.textDecoration) {
      if (s.textDecoration == 'line-through') {
        text.addAttribute_value('NSStrikethrough', 1)
      } else {
        text.addAttribute_value('NSUnderline', underlineToNumber(s.textDecoration))
      }
    }

    if (s.locked) {
      text.isLocked = true
    }

    text.frame = MSRect.rectWithRect(s.rect)
    text.setName(json.name)
    parent.object.addLayer(text)
  }
}
