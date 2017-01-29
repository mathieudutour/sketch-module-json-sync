export function exportFont (nsfont) {
  var fontFamily = String(nsfont.fontDescriptor().objectForKey(NSFontNameAttribute))
  var fontSize = String(nsfont.fontDescriptor().objectForKey(NSFontSizeAttribute)) * 1
  return {
    fontFamily,
    fontSize
  }
}

export function importFont (s) {
  return NSFont.fontWithName_size(s.fontFamily, s.fontSize)
}
