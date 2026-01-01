import { z } from "zod";

export const CreateAppSchema = z.object({
  name: z.string().min(3),
  themeJson: z.any(),
});

export const UpdateAppSchema = z.object({
  name: z.string().min(3).optional(),
  themeJson: z.any().optional(),
  status: z.enum(["DRAFT", "LIVE"]).optional(),
});

export type CreateAppDTO = z.infer<typeof CreateAppSchema>;
export type UpdateAppDTO = z.infer<typeof UpdateAppSchema>;
