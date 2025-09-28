import * as z from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(5, { message: "Password must be longer than 5 chars" }), // use `message`, not `error`
});
