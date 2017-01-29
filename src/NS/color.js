export function exportColor (nscolor) {
  if (nscolor.svgRepresentation) {
    return '' + nscolor.svgRepresentation()
  }
  let c = {}
  if (nscolor.RGBADictionary) {
    c = nscolor.RGBADictionary()
  } else {
    c.r = nscolor.redComponent()
    c.g = nscolor.greenComponent()
    c.b = nscolor.blueComponent()
    c.a = nscolor.alphaComponent()
  }
  const color = MSImmutableColor.colorWithRed_green_blue_alpha(c.r, c.g, c.b, c.a)
  return '' + color.stringValueWithAlpha(true)
}

export function importColor (string) {
  return MSImmutableColor.colorWithSVGString(string)
}
