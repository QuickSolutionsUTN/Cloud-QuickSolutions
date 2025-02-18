import { z } from 'zod';

const emailSchema = z.string().email('El correo electrónico no es válido');

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres');
//   .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
//   .regex(/[a-z]/, "La contraseña debe tener al menos una letra minúscula")
//   .regex(/[0-9]/, "La contraseña debe tener al menos un número")
//   .regex(/[\W_]/, "La contraseña debe tener al menos un carácter especial");

const dniSchema = z
  .number()
  .int()
  .positive()
  .gte(10000000, 'El DNI debe tener al menos 8 dígitos')
  .lte(99999999, 'El DNI no puede tener más de 8 dígitos');

const birthDateSchema = z
  .string()
  .refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - parsedDate.getFullYear();
    return age >= 18;
  }, 'Debes tener al menos 18 años para registrarte');

const nameSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(50, 'El nombre no puede exceder los 50 caracteres')
  .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s'-]+$/, 'El nombre solo puede contener letras y espacios');

// Validación para teléfono (ejemplo: formato internacional o nacional)
const phoneSchema = z
  .string()
  .min(13, 'El número de teléfono debe tener al menos 13 dígitos');

export const clientSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  dni: dniSchema,
  fechaNacimiento: birthDateSchema,
  nombre: nameSchema,
  apellido: nameSchema,
  telefono: phoneSchema
});

export const updateClientSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema
});

export const clientValidation = (cliente: any) => {
  return clientSchema.safeParse(cliente);
};

export const updateClientValidation = (cliente: any) => {
  return updateClientSchema.safeParse(cliente);
};


