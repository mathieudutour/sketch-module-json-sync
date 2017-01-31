import { round } from '../util'
import { getType } from './types'

function getBound (json) {
  return CGRectMake(
    parseFloat(json.styles.bounds.origin.x),
    parseFloat(json.styles.bounds.origin.y),
    parseFloat(json.styles.bounds.size.width),
    parseFloat(json.styles.bounds.size.height)
  )
}

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
        x: round(b.x()),
        y: round(b.y())
      },
      size: {
        width: round(b.width()),
        height: round(b.height())
      }
    }
  }

  styles () {
    var re = {}

    if (this._layer.isFlippedHorizontal()) {
      re.flippedHorizontal = true
    }

    if (this._layer.isFlippedVertical()) {
      re.flippedVertical = true
    }

    if (this._layer.rotation()) {
      re.rotation = this._layer.rotation()
    }

    if (this._layer.resizingType()) {
      re.resizingType = this._layer.resizingType()
    }

    if (this.bounds()) {
      re.bounds = this.bounds()
    }

    return re
  }

  exportJSON () {
    const re = {
      objectId: this.id(),
      type: this.type(),
      className: this.className(),
      name: this.name(),
      styles: this.styles()
    }

    if (!this._layer.isVisible()) {
      re.hidden = true
    }

    if (this._layer.isLocked()) {
      re.locked = true
    }

    if (this._layer.shouldBreakMaskChain()) {
      re.breakMaskChain = true
    }

    if (this._layer.hasClickThrough && this._layer.hasClickThrough()) {
      re.clickThrough = true
    }

    return re
  }

  static importBound (json) {
    return getBound(json)
  }

  static importLayerProps (layer, json) {
    layer.objectID = json.objectId
    layer.setName(json.name)
    if (json.hidden) {
      layer.isVisible = false
    }
    if (json.locked) {
      layer.isLocked = true
    }
    if (json.styles.flippedHorizontal) {
      layer.isFlippedHorizontal = true
    }
    if (json.styles.flippedVertical) {
      layer.isFlippedVertical = true
    }
    if (json.breakMaskChain) {
      layer.shouldBreakMaskChain = true
    }
    if (json.styles.rotation) {
      layer.rotation = json.styles.rotation
    }
    if (json.clickThrough) {
      layer.hasClickThrough = true
    }
    if (json.styles.bounds) {
      return MSRect.rectWithRect(getBound(json))
    }
  }

  images () {
    return []
  }

  setSavedImages (images) {
    this.savedImages = images
  }
}
