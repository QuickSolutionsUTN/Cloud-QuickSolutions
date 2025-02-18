import { z } from 'zod';


// Validación para el número de registro (campo del conductor)
// const registerNumberSchema = z
//   .string()
//   .min(5, 'El número de registro debe tener al menos 5 caracteres');

// Validación para la categoría de licencia
// const licenseCategorySchema = z.enum(['A', 'B', 'C', 'D', 'E'], {
//   errorMap: () => ({
//     message: 'La categoría de licencia debe ser A, B, C, D o E'
//   })
// });

// const licenseExpirationSchema = z
//   .string()
//   .refine((date) => {
//     const parsedDate = new Date(date);
//     return parsedDate > new Date();
//   }, 'La licencia no puede estar vencida');
const idUser = z.string({
  errorMap: () => ({
    message: 'El id del conductor debe ser una cadena de caracteres.'
  })
});


export const driverSchema = z.object({
  idUser
});


export const postConductorValidation = (conductor: any) => {
  return driverSchema.safeParse(conductor);
};