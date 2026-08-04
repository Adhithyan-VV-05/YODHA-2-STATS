/**
 * Utility functions for formatting dates, times, and durations in Indian Standard Time (IST, UTC+5:30).
 */

export function formatIST(dateInput?: string | Date | number | null): {
  date: string;
  time: string;
  dateTime: string;
  dayTime: string;
} {
  if (!dateInput) {
    return { date: 'N/A', time: 'N/A', dateTime: 'N/A', dayTime: 'N/A' };
  }

  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return { date: 'N/A', time: 'N/A', dateTime: 'N/A', dayTime: 'N/A' };
    }

    const date = d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const time = d.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }) + ' IST';

    const dateTime = `${date}, ${time}`;

    const dayName = d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
    });

    const dayTime = `${dayName}, ${date} • ${time}`;

    return { date, time, dateTime, dayTime };
  } catch (error) {
    console.error('Error formatting IST date:', error);
    return { date: 'N/A', time: 'N/A', dateTime: 'N/A', dayTime: 'N/A' };
  }
}

export function formatISTDate(dateInput?: string | Date | number | null): string {
  return formatIST(dateInput).date;
}

export function formatISTTime(dateInput?: string | Date | number | null): string {
  return formatIST(dateInput).time;
}

export function formatISTDateTime(dateInput?: string | Date | number | null): string {
  return formatIST(dateInput).dateTime;
}

export function formatDuration(seconds?: number | null): string {
  if (seconds === undefined || seconds === null || isNaN(seconds) || seconds < 0) {
    return '0s';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (mins === 0) {
    return `${secs}s`;
  }
  if (secs === 0) {
    return `${mins}m`;
  }
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}
