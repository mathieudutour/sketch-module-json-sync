import { isNull } from '../util'
import { exportTextStyle, importTextStyle } from '../sharedTextStyle'
import { exportStyle, importStyle } from '../sharedStyle'
import GeneralLayer from './general'

export default class TextLayer extends GeneralLayer {
  styles () {
    return {
      ...super.styles(),
      ...this.cssText(),
      ...exportStyle(this._layer.styleGeneric(), this.savedImages)
    }
  }

  cssText () {
    var re = {}
    if (this.className() == 'MSTextLayer') {
      // Content
      re.content = this.stringValue()

      const attrs = this._layer.styleAttributes()

      // Shared style
      if (this._layer.style().sharedObjectID()) {
        re.sharedStyleId = '' + this._layer.style().sharedObjectID()
      }

      // Text Behaviour: 0:auto 1:fixed
      re.textBehaviour = this._layer.textBehaviour() == 0 ? 'auto' : 'fixed'

      re = {
        ...exportTextStyle(attrs),
        ...re
      }
    }
    return re
  }

  static importJSON (doc, json, parent, current) {
    if (isNull(parent) || (!isNull(parent) && !parent.object)) {
      return
    }

    var text = MSTextLayer.alloc().init()
    if (json.styles.content) {
      text.stringValue = json.styles.content
    }

    if (json.styles.sharedStyleId) {
      const sharedStyles = doc.documentData().layerTextStyles().objects()
      const sharedStyle = sharedStyles.find(({objectID}) => objectID() == json.styles.sharedStyleId)
      if (sharedStyle) {
        text.setStyle(sharedStyle.newInstance())
      }
    }

    importStyle(text, json.styles)
    importTextStyle(text, json.styles)

    if (json.styles.textBehaviour) {
      text.textBehaviour = json.styles.textBehaviour == 'auto' ? 0 : 1
    }

    text.frame = GeneralLayer.importLayerProps(text, json)

    parent.object.addLayer(text)
  }
}
