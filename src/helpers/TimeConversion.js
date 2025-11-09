export const timeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  }

  for (let interval in intervals) {
    const value = Math.floor(seconds / intervals[interval])
    if (value > 1) return `${value} ${interval}s ago`
    if (value === 1) return `1 ${interval} ago`
  }

  return 'Just now'
}
