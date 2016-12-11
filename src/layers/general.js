import toCamelCase from 'to-camel-case'
import { blendModeNumberToString, colorToString } from '../util'
import { getType } from './types'

export default class GeneralLayer {
  constructor (layer) {
    this._layer = layer
  }

  id () {
    return '' + this._layer.objectID()
  }

  shortId () {
    return ('' + this._layer.objectID().sha1()).substr(0, 5)
  }

  symbolId () {
    return null
  }

  dirName () {
    return (this.name() + ' - ' + this.shortId()).replace(new RegExp('/'), ':')
  }

  name () {
    return '' + this._layer.name()
  }

  className () {
    return '' + this._layer.className()
  }

  stringValue () {
    return '' + this._layer.stringValue()
  }

  layers () {
    var re = []
    if (this._layer.layers) {
      re = this._layer.layers()
    }

    return re
  }

  setLayers (layers) {
    this._layers = layers
  }

  type () {
    return getType(this._layer)
  }

  bounds () {
    var b = this._layer.frame()
    return {
      origin: {
        x: parseFloat(b.x()).toFixed(3),
        y: parseFloat(b.y()).toFixed(3)
      },
      size: {
        width: parseFloat(b.width()).toFixed(3),
        height: parseFloat(b.height()).toFixed(3)
      }
    }
  }

  styles () {
    var re = {}

    if (!this._layer.isVisible()) {
      re.hidden = true
    }

    if (this._layer.isLocked()) {
      re.locked = true
    }

    re.bounds = this.bounds()

    return {
      ...re,
      ...this.rotation(),
      ...this.blendMode()
    }
  }

  rotation () {
    var re = {}
    var rotation = this._layer.rotation()
    if (rotation) {
      re.rotation = rotation
    }
    return re
  }

  cssAttributes () {
    var re = {}
    var styles = this._layer.CSSAttributes()

    for (var i = 0; i < styles.length; i++) {
      var s = '' + styles[i]
      if (s.indexOf('/*') === 0 || // eslint-disable-line
          (new RegExp('^background:')).test(s) ||
          (new RegExp('^border:')).test(s) ||
          (new RegExp('^letter-spacing:')).test(s) ||
          (new RegExp('^box-shadow:')).test(s) ||
          (new RegExp('linear-gradient')).test(s)) {
        continue
      }
      const parseRegex = new RegExp('^(.*): (.*);$')
      const parsed = parseRegex.exec(s)
      re[toCamelCase(parsed[1])] = parsed[2].replace('px', '')
    }

    return {
      ...re,
      ...this.cssBackgrounds(),
      ...this.cssBorders()
    }
  }

  cssBackgrounds () {
    return {}
  }

  cssBorders () {
    var re = {}

    if (!this._layer.styleGeneric().hasEnabledBorder()) {
      return re
    }

    var borders = this._layer.style().borders()
    re.borders = []
    for (var i = 0; i < borders.length; i++) {
      const border = {
        color: colorToString(borders[i].color()),
        thickness: borders[i].thickness()
      }
      if (!borders[i].isEnabled()) {
        border.enabled = false
      }
      re.borders.push(border)
    }

    return re
  }

  blendMode () {
    var re = {}

    if (this._layer.style) {
      var mode = this._layer.style().contextSettings().blendMode()
      if (mode > 0) {
        re.blendMode = blendModeNumberToString(mode)
      }
    }

    return re
  }

  images () {
    return []
  }

  setSavedImages (images) {
    this.savedImages = images
  }

  path () {
    return ''
  }
}
