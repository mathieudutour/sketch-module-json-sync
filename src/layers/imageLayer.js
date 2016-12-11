import { findImage, imageName, imageId, isNull } from '../util'
import { exportShadow, exportBlur } from './layerMixin'
import { parseStyle, setShadow, setBlur } from '../importUtils'
import GeneralLayer from './general'

export default class ImageLayer extends GeneralLayer {
  constructor (...args) {
    super(...args)

    this.shadow = exportShadow.bind(this)
    this.blur = exportBlur.bind(this)
  }

  styles () {
    return {
      ...super.styles(),
      ...this.cssAttributes(),
      ...this.blur(),
      ...this.shadow()
    }
  }

  cssBackgrounds () {
    var re = {}
    var image = findImage(this.savedImages, this._layer.image())
    re.image = imageName(image)
    return re
  }

  images () {
    var re = []
    var image = this._layer.image()
    re.push({
      name: imageId(image),
      image: image.image()
    })
    return re
  }

  static importJSON (doc, json, parent, current) {
    if (!isNull(parent) && !parent.object) {
      return
    }

    var s = parseStyle(json.styles)
    var imagePath = current.path + '/' + s.backgroundImage[0].image
    var image = NSImage.alloc().initWithContentsOfFile(imagePath)
    var imageData = MSImageData.alloc().initWithImage_convertColorSpace(image, false)
    var bitmap = MSBitmapLayer.alloc().initWithFrame_image(s.rect, imageData)
    bitmap.objectID = json.objectId
    bitmap.setName(json.name)

    if (s.rotation) {
      bitmap.rotation = s.rotation
    }

    if (s.blur) {
      setBlur(bitmap, s.blur)
    }

    if (s.shadow) {
      setShadow(bitmap, s.shadow)
    }

    if (s.hidden) {
      bitmap.isVisible = false
    }

    if (s.opacity) {
      bitmap.style().contextSettings().opacity = s.opacity
    }

    if (s.blendMode) {
      bitmap.style().contextSettings().blendMode = s.blendMode
    }

    if (s.locked) {
      bitmap.isLocked = true
    }

    parent.object.addLayer(bitmap)
  }
}
