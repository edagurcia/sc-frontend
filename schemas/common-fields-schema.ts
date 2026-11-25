import { z } from "zod";
import { DNI_LENGTH, PHONE_LENGTH } from "@/utils/dni-phone-input";

const DNI_REGEX = new RegExp(`^\\d{${DNI_LENGTH}}$`);
const PHONE_REGEX = new RegExp(`^\\d{${PHONE_LENGTH}}$`);

/** DNI obligatorio (exactamente 13 números) */
export const requiredDniSchema = z
  .string()
  .trim()
  .regex(DNI_REGEX, `El DNI debe tener exactamente ${DNI_LENGTH} números`);

/** DNI opcional (vacío o exactamente 13 números) */
export const optionalDniSchema = z
  .string()
  .trim()
  .refine(
    (val) => val === "" || DNI_REGEX.test(val),
    `La identidad debe tener exactamente ${DNI_LENGTH} números`,
  )
  .optional()
  .or(z.literal(""));

/** Teléfono obligatorio (exactamente 8 números) */
export const requiredPhoneSchema = z
  .string()
  .trim()
  .regex(
    PHONE_REGEX,
    `El teléfono debe tener exactamente ${PHONE_LENGTH} números`,
  );

/** Teléfono opcional (vacío o exactamente 8 números) */
export const optionalPhoneSchema = z
  .string()
  .trim()
  .refine(
    (val) => val === "" || PHONE_REGEX.test(val),
    `El teléfono debe tener exactamente ${PHONE_LENGTH} números`,
  )
  .optional()
  .or(z.literal(""));
