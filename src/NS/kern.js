import { round } from '../util'

export function exportKern (nskern) {
  return round(nskern)
}

export function importKern (string) {
  return Number(string)
}
