export type PhoneFormat = 'us' | 'international'

export function usePhoneFormat() {
  function formatUS(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  function formatInternational(value: string): string {
    const digits = value.replace(/[^\d+]/g, '')
    if (!digits.startsWith('+')) return '+' + digits.replace(/\D/g, '').slice(0, 15)
    return '+' + digits.slice(1).replace(/\D/g, '').slice(0, 15)
  }

  function formatPhone(value: string, format: PhoneFormat): string {
    if (!value) return ''
    return format === 'us' ? formatUS(value) : formatInternational(value)
  }

  function phonePlaceholder(format: PhoneFormat): string {
    return format === 'us' ? '(555) 123-4567' : '+1 555 123 4567'
  }

  function phonePattern(format: PhoneFormat): string {
    return format === 'us'
      ? '\\(\\d{3}\\) \\d{3}-\\d{4}'
      : '\\+\\d{1,15}'
  }

  return { formatPhone, phonePlaceholder, phonePattern }
}