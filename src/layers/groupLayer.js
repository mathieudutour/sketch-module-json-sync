import { exportShadow } from './layerMixin'
import { isNull } from '../util'
import { parseStyle, setShadow } from '../importUtils'
import GeneralLayer from './general'

export default class GroupLayer extends GeneralLayer {
  constructor (...args) {
    super(...args)

    this.shadow = exportShadow.bind(this)
  }

  styles () {
    return {
      ...super.styles(),
      ...this.cssAttributes(),
      ...this.shadow()
    }
  }

  static importJSON (doc, json, parent, current) {
    if (!isNull(parent) && !parent.object) {
      return
    }

    var s = parseStyle(json.styles)
    var group = MSLayerGroup.alloc().init()
    group.objectID = json.objectId
    group.frame = MSRect.rectWithRect(s.rect)
    group.setName(json.name)

    if (s.hidden) {
      group.isVisible = false
    }

    if (s.locked) {
      group.isLocked = true
    }

    if (s.opacity) {
      group.style().contextSettings().opacity = s.opacity
    }

    if (s.blendMode) {
      group.style().contextSettings().blendMode = s.blendMode
    }

    if (s.rotation) {
      group.rotation = s.rotation
    }

    if (s.shadow) {
      setShadow(group, s.shadow)
    }

    parent.object.addLayer(group)
    current.object = group
  }
}
