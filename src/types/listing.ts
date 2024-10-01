import { z } from "zod";

export const ContactMethodEnum = z.enum([
  "email",
  "discord",
  "instagram",
  "twitter",
  "telegram",
]);
export type ContactMethodType = z.infer<typeof ContactMethodEnum>;

export const listing_schema = z.object({
  domain: z
    .string()
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
      "Invalid domain format"
    ),
  name: z.string().min(1, "Name is required"),
  contact_email: z.string().email("Invalid email format").optional(),
  contact_discord: z.string().optional(),
  contact_instagram: z.string().optional(),
  contact_twitter: z.string().optional(),
  contact_telegram: z.string().optional(),
});

export type ListingSchema = z.infer<typeof listing_schema>;

export interface ContactMethod {
  type: ContactMethodType;
  value: string;
}

export interface Listing {
  domain: string;
  name: string;
  contact_methods: ContactMethod[] | string; // Can be either an array or a string
}
