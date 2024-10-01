"use server";

import {
  ContactMethodEnum,
  listing_schema,
  ListingSchema,
} from "@/types/listing";
import { supabase_server } from "@/utils/supabase/server";
import { z } from "zod";

export async function add_listing(form_data: FormData) {
  try {
    const parsed_data = listing_schema.parse(Object.fromEntries(form_data));

    const { name, domain, ...contact_methods } = parsed_data;

    const listing_data: ListingSchema & { contact_methods: string } = {
      name,
      domain,
      contact_methods: JSON.stringify(
        Object.entries(contact_methods)
          .filter(([_, value]) => value)
          .map(([key, value]) => ({
            type: key.replace("contact_", "") as z.infer<typeof ContactMethodEnum>,
            value,
          }))
      ),
    };

    const { error } = await supabase_server
      .from("listings")
      .insert(listing_data);

    if (error) {
      return { error: "Failed to add listing" };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors };
    }
    return { error: "An unexpected error occurred" };
  }
}
