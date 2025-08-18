import React, { useMemo } from 'react'

type SlotStatus = 0 | 1

export interface TimeSlot {
  startTime: string // YYYY-MM-DD HH:mm:ss
  endTime: string // YYYY-MM-DD HH:mm:ss
  status: SlotStatus // 1=已使用 0=空闲
}

interface TimeLineProps {
  timeSlots: TimeSlot[]
  currentTime: string
  onCellClick?: (overlapSlots: TimeSlot[]) => void
}

const HALF_HOUR_MS = 30 * 60 * 1000

function parseDateTime(s: string) {
  const [datePart, timePart = '00:00:00'] = s.split(' ')
  const [y, m, d] = datePart.split('-').map((n) => parseInt(n, 10))
  const [hh, mm, ss] = timePart.split(':').map((n) => parseInt(n, 10))
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, ss || 0)
}

function clampRangeToDay(start: Date, end: Date, dayStart: Date, dayEnd: Date) {
  const s = Math.max(start.getTime(), dayStart.getTime())
  const e = Math.min(end.getTime(), dayEnd.getTime())
  return [s, e] as const
}

const TimeLine: React.FC<TimeLineProps> = ({ timeSlots, currentTime, onCellClick }) => {
  const { cells, hourLabels } = useMemo(() => {
    const now = parseDateTime(currentTime)
    const dayStart = new Date(now)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(now)
    dayEnd.setHours(23, 59, 59, 999)

    const cellList = Array.from({ length: 48 }, (_, i) => {
      const start = new Date(dayStart.getTime() + i * HALF_HOUR_MS)
      const end = new Date(Math.min(start.getTime() + HALF_HOUR_MS, dayEnd.getTime()))
      return { index: i, start, end }
    })

    const computedCells = cellList.map((cell) => {
      const overlaps: TimeSlot[] = []
      let used = false

      for (const slot of timeSlots || []) {
        const s = parseDateTime(slot.startTime)
        const e = parseDateTime(slot.endTime)
        const [cs, ce] = clampRangeToDay(s, e, dayStart, dayEnd)
        const hasOverlap = Math.max(cs, cell.start.getTime()) < Math.min(ce, cell.end.getTime())
        if (hasOverlap) {
          overlaps.push(slot)
          if (slot.status === 1) used = true
        }
      }

      const isPast = cell.end.getTime() <= now.getTime()
      const isGray = used || isPast

      return {
        ...cell,
        overlaps,
        used,
        isPast,
        isGray,
      }
    })

    const labels = Array.from({ length: 48 }, (_, h) => (h % 2 === 0 ? `${String(h / 2).padStart(2, '0')}` : ''))

    return { cells: computedCells, hourLabels: labels }
  }, [timeSlots, currentTime])

  return (
    <div className="w-full">
      <div className="flex w-full border border-gray-200 rounded overflow-hidden">
        {cells.map((cell) => {
          const title = `${cell.start.toTimeString().slice(0, 8)} - ${cell.end
            .toTimeString()
            .slice(0, 8)} ${cell.used ? '已使用' : cell.isPast ? '已过期' : '空闲'}`
          return (
            <div
              key={cell.index}
              title={title}
              className={`h-4 flex-1 border-r border-gray-200 last:border-r-0 ${cell.isGray ? 'bg-gray-300' : 'bg-white'}`}
              onClick={() => onCellClick?.(cell.overlaps)}
            />
          )
        })}
      </div>

      <div className="mt-2 flex w-full text-xs text-gray-500 relative">
        {hourLabels.map((label, idx) => (
          <div key={idx} className="flex-1 text-center -translate-x-1/2">
            {label}
          </div>
        ))}
        <div className="absolute right-0 top-0 translate-x-1/2">00</div>
      </div>
    </div>
  )
}

export default TimeLine
