const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

export function isValidEmail(value?: string | null): boolean {
  const email = value?.trim() ?? "";
  return email.length > 0 && email.length <= 254 && EMAIL_PATTERN.test(email);
}
