/**
 * Utility functions for date calculations, comparisons, and formatting.
 */

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function getDaysDifference(targetDateStr: string): number {
  if (!targetDateStr) return 0;
  const todayStr = getTodayString();
  const [tY, tM, tD] = todayStr.split('-').map(Number);
  const [targetY, targetM, targetD] = targetDateStr.split('-').map(Number);

  const todayMidnight = new Date(tY, tM - 1, tD).getTime();
  const targetMidnight = new Date(targetY, targetM - 1, targetD).getTime();

  const diffTime = targetMidnight - todayMidnight;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getFollowUpStatus(dateStr?: string): 'overdue' | 'today' | 'upcoming' | 'none' {
  if (!dateStr) return 'none';
  const diff = getDaysDifference(dateStr);
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'today';
  return 'upcoming';
}

export function getFollowUpBadgeInfo(dateStr?: string): {
  status: 'overdue' | 'today' | 'upcoming' | 'none';
  label: string;
  badgeClass: string;
  rowHighlightClass: string;
} {
  if (!dateStr) {
    return {
      status: 'none',
      label: 'No follow-up set',
      badgeClass: 'text-slate-400',
      rowHighlightClass: '',
    };
  }

  const diff = getDaysDifference(dateStr);

  if (diff < 0) {
    const days = Math.abs(diff);
    return {
      status: 'overdue',
      label: days === 1 ? 'Overdue by 1 day' : `Overdue by ${days} days`,
      badgeClass: 'text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/30 font-semibold',
      rowHighlightClass: 'bg-[#E50914]/5 hover:bg-[#E50914]/10 border-l-3 border-l-[#E50914]',
    };
  }

  if (diff === 0) {
    return {
      status: 'today',
      label: 'Due today',
      badgeClass: 'text-[#B81D24] bg-[#B81D24]/10 border border-[#B81D24]/30 font-semibold',
      rowHighlightClass: 'bg-[#B81D24]/5 hover:bg-[#B81D24]/10 border-l-3 border-l-[#B81D24]',
    };
  }

  if (diff === 1) {
    return {
      status: 'upcoming',
      label: 'Due tomorrow',
      badgeClass: 'text-[#221F1F] bg-[#EAEAE5] border border-[#DCDCD2]',
      rowHighlightClass: 'hover:bg-[#EAEAE5]/60',
    };
  }

  return {
    status: 'upcoming',
    label: `In ${diff} days`,
    badgeClass: 'text-[#221F1F] bg-[#EAEAE5] border border-[#DCDCD2]',
    rowHighlightClass: 'hover:bg-[#EAEAE5]/60',
  };
}

export function addDaysFromToday(days: number): string {
  const now = new Date();
  now.setDate(now.getDate() + days);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
