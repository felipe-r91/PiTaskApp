import { z } from 'zod';

export const userSchema = z.object({
  name: z.string(),
  surname: z.string(),
  password: z.string(),
  confirmPWD: z.string(),
  email: z.string(),
  role: z.string(),
  photo: z.string(),
})

export type CreateUserSchema = z.infer<typeof userSchema>