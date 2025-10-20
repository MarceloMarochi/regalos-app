import { z } from "zod";

export const CreatePersonSchema = z.object({
  name: z.string().min(2),
  alias: z.string().min(2).optional(), // CBU/alias/alias CVU
});

export const CreateGiftSchema = z.object({
  title: z.string().min(2),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  totalAmount: z.number().int().nonnegative(),
  payToId: z.string().min(1),
  notes: z.string().optional(),
  contributions: z.array(
    z.object({
      personId: z.string().min(1),
      shouldPay: z.number().int().nonnegative(),
    })
  ).nonempty(),
});

export const UpdateContributionSchema = z.object({
  paid: z.number().int().nonnegative(),
});
