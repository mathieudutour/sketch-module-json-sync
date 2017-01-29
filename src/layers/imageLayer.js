import { findImage, imageName, imageId, isNull } from '../util'
import { exportStyle, importStyle } from '../sharedStyle'
import GeneralLayer from './general'

export default class ImageLayer extends GeneralLayer {
  styles () {
    const image = findImage(this.savedImages, this._layer.image())
    return {
      ...super.styles(),
      image: image.sha1,
      ...exportStyle(this._layer.styleGeneric(), this.savedImages)
    }
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

    var imagePath = current.path + '/' + imageName({sha1: json.styles.image})
    var image = NSImage.alloc().initWithContentsOfFile(imagePath)
    var imageData = MSImageData.alloc().initWithImage_convertColorSpace(image, false)
    var bitmap = MSBitmapLayer.alloc().initWithFrame_image(GeneralLayer.importBound(json), imageData)
    GeneralLayer.importLayerProps(bitmap, json)

    importStyle(bitmap, json.styles)

    parent.object.addLayer(bitmap)
  }
}
