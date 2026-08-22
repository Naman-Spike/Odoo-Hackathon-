export function formatDate(date: string | Date | null | undefined, includeDayOfWeek?: boolean): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  if (includeDayOfWeek) {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return 'U';
  if (firstName && !lastName) {
    const parts = firstName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (parts[0][0] || 'U').toUpperCase();
  }
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase() || 'U';
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PRESENT':
    case 'APPROVED':
      return 'text-green-700 bg-green-50 border-green-200';
    case 'ABSENT':
    case 'REJECTED':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'HALF_DAY':
    case 'PENDING':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case 'LEAVE':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
}

export function classNames(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function calculateDaysBetween(start: string | Date, end: string | Date): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

