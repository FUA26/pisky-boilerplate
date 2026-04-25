export function formatRelativeTime(date: Date) {
  const now = new Date()
  const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000)
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  const absSeconds = Math.abs(diffSeconds)
  if (absSeconds < 60) return rtf.format(diffSeconds, "second")

  const diffMinutes = Math.round(diffSeconds / 60)
  const absMinutes = Math.abs(diffMinutes)
  if (absMinutes < 60) return rtf.format(diffMinutes, "minute")

  const diffHours = Math.round(diffMinutes / 60)
  const absHours = Math.abs(diffHours)
  if (absHours < 24) return rtf.format(diffHours, "hour")

  const diffDays = Math.round(diffHours / 24)
  const absDays = Math.abs(diffDays)
  if (absDays < 30) return rtf.format(diffDays, "day")

  const diffMonths = Math.round(diffDays / 30)
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month")

  const diffYears = Math.round(diffMonths / 12)
  return rtf.format(diffYears, "year")
}
