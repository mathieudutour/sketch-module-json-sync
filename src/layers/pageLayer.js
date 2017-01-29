import GeneralLayer from './general'

export default class PageLayer extends GeneralLayer {
  bounds () {
    return null
  }

  static importJSON (doc, json, parent, current) {
    const page = doc.addBlankPage()
    page.objectID = json.objectId
    page.setName(json.name)
    current.object = page
  }
}
