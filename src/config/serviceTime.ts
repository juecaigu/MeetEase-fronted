import { STORAGE_KEY } from './constant'
let offsetMs: number | null = null

;(function restore() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v != null) offsetMs = Number(v)
    if (Number.isNaN(offsetMs as number)) offsetMs = null
  } catch {
    offsetMs = null
  }
})()

function toMs(input: string | number | Date): number {
  if (input instanceof Date) return input.getTime()
  if (typeof input === 'number') return input
  const s = input.includes('T') || input.includes('Z') ? input : input.replace(/-/g, '/')
  const ms = Date.parse(s) || 0
  return ms
}

export const setServerTime = (serverTime: string | number | Date): void => {
  const serverMs = toMs(serverTime)
  const clientNow = Date.now()
  offsetMs = serverMs - clientNow
  try {
    localStorage.setItem(STORAGE_KEY, String(offsetMs))
  } catch {
    offsetMs = null
  }
}

export const getServerNow = (): Date => {
  if (offsetMs == null) return new Date()
  return new Date(Date.now() + offsetMs)
}
