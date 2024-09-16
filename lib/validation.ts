import { z } from "zod";

export const userFormValidation = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .min(50, {
      message: "Name must be at most 50 characters.",
    }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z
    .string()
    .refine(
      (phone) =>
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i.test(phone),
      {
        message: "Invalid phone number.",
      }
    ),
});
