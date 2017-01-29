import { isNull } from '../util'
import { exportStyle, importStyle } from '../sharedStyle'
import GeneralLayer from './general'

export default class GroupLayer extends GeneralLayer {
  styles () {
    return {
      ...super.styles(),
      ...exportStyle(this._layer.styleGeneric(), this.savedImages)
    }
  }

  static importJSON (doc, json, parent, current) {
    if (!isNull(parent) && !parent.object) {
      return
    }

    var group = MSLayerGroup.alloc().init()

    group.frame = GeneralLayer.importLayerProps(group, json)
    importStyle(group, json.styles)

    parent.object.addLayer(group)
    current.object = group
  }
}
