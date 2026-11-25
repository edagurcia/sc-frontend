import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";

export const DNI_LENGTH = 13;
export const PHONE_LENGTH = 8;

const DIGITS_ONLY_REGEX = /\D+/g;
const ALLOWED_CONTROL_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

export function sanitizeDigitsOnly(value: string, maxLength?: number): string {
  const digits = value.replace(DIGITS_ONLY_REGEX, "");
  return typeof maxLength === "number" ? digits.slice(0, maxLength) : digits;
}

export function handleDigitsKeyDown(
  event: KeyboardEvent<HTMLInputElement>,
): void {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (ALLOWED_CONTROL_KEYS.has(event.key)) return;
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
}

export function handleDigitsPaste(
  event: ClipboardEvent<HTMLInputElement>,
  onSanitizedChange: (cleanValue: string) => void,
  maxLength?: number,
): void {
  event.preventDefault();
  const pastedText = event.clipboardData.getData("text");
  onSanitizedChange(sanitizeDigitsOnly(pastedText, maxLength));
}

export function handleDigitsChange(
  event: ChangeEvent<HTMLInputElement>,
  onSanitizedChange: (cleanValue: string) => void,
  maxLength?: number,
): void {
  const cleanValue = sanitizeDigitsOnly(event.target.value, maxLength);
  if (event.target.value !== cleanValue) {
    event.target.value = cleanValue;
  }
  onSanitizedChange(cleanValue);
}
