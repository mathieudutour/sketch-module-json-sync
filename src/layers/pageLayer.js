import GeneralLayer from './general'

export default class PageLayer extends GeneralLayer {
  bounds () {
    var b = this._layer.contentBounds()
    return {
      origin: {
        x: parseFloat(b.origin.x).toFixed(3),
        y: parseFloat(b.origin.y).toFixed(3)
      },
      size: {
        width: parseFloat(b.size.width).toFixed(3),
        height: parseFloat(b.size.height).toFixed(3)
      }
    }
  }

  static importJSON (doc, json, parent, current) {
    const page = doc.addBlankPage()
    page.objectID = json.objectId
    page.setName(json.name)
    current.object = page
  }
}
