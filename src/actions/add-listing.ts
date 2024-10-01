"use server";

import {
  ContactMethodEnum,
  listing_schema,
  ListingSchema,
} from "@/types/listing";
import { supabase_server } from "@/utils/supabase/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { domain_exists } from "@/utils/domain-validator";
import { headers } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function add_listing(form_data: FormData) {
  try {
    // Get the user's IP address using Vercel's recommended method
    const forwarded_for = headers().get("x-forwarded-for");
    const ip_address = forwarded_for ? forwarded_for.split(',')[0] : "unknown";

    // Check rate limit
    const { data: rate_limit_data, error: rate_limit_error } = await supabase
      .from("rate_limits")
      .select("count, last_attempt")
      .eq("ip_address", ip_address)
      .single();

    if (rate_limit_error && rate_limit_error.code !== "PGRST116") {
      return { error: "Failed to check rate limit" };
    }

    const now = new Date();
    const one_hour_ago = new Date(now.getTime() - 60 * 60 * 1000);

    if (
      rate_limit_data &&
      rate_limit_data.count >= 5 &&
      new Date(rate_limit_data.last_attempt) > one_hour_ago
    ) {
      return { error: "Rate limit exceeded. Please try again later." };
    }

    // Update rate limit
    if (rate_limit_data) {
      await supabase
        .from("rate_limits")
        .update({
          count: rate_limit_data.count + 1,
          last_attempt: now.toISOString(),
        })
        .eq("ip_address", ip_address);
    } else {
      await supabase
        .from("rate_limits")
        .insert({ ip_address, count: 1, last_attempt: now.toISOString() });
    }

    const parsed_data = listing_schema.parse(Object.fromEntries(form_data));

    // Check if domain exists
    const domain_is_valid = await domain_exists(parsed_data.domain);
    if (!domain_is_valid) {
      return { error: "The provided domain does not exist" };
    }

    const { name, domain, honeypot, ...contact_methods } = parsed_data;

    // Check if honeypot field is filled (bot detection)
    if (honeypot) {
      return { error: "Invalid submission" };
    }

    const listing_data: Omit<ListingSchema, "honeypot"> & {
      contact_methods: string;
    } = {
      name,
      domain,
      contact_methods: JSON.stringify(
        Object.entries(contact_methods)
          .filter(([_, value]) => value)
          .map(([key, value]) => ({
            type: key.replace("contact_", "") as z.infer<
              typeof ContactMethodEnum
            >,
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
