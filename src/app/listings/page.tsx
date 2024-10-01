"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Asterisk, GlobeIcon, UserIcon } from "lucide-react";
import { FaDiscord, FaInstagram, FaTelegram, FaTwitter } from "react-icons/fa";
import { Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase-client";
import { Skeleton } from "@/components/ui/skeleton";
import { add_listing } from "@/actions/add-listing";
import {
  ContactMethod,
  ContactMethodType,
  Listing,
  listing_schema,
  ListingSchema,
} from "@/types/listing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconType } from "react-icons/lib";

const contact_method_options: {
  value: ContactMethodType;
  label: string;
  icon: IconType;
}[] = [
  { value: "email", label: "Email", icon: Mail as unknown as IconType },
  { value: "discord", label: "Discord", icon: FaDiscord },
  { value: "instagram", label: "Instagram", icon: FaInstagram },
  { value: "twitter", label: "Twitter", icon: FaTwitter },
  { value: "telegram", label: "Telegram", icon: FaTelegram },
];

export default function ListingsPage() {
  const [domains_listings, set_domains_listings] = useState<Listing[]>([]);
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    fetch_listings();
  }, []);

  const fetch_listings = async () => {
    set_is_loading(true);
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
    } else {
      set_domains_listings(data || []);
    }
    set_is_loading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground mx-6">
      <Header />
      <div className="flex max-w-xl w-full mx-auto mt-4">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl font-bold">Listings</h1>
          <AddListingDialog fetch_listings={fetch_listings} />
        </div>
      </div>
      <div className="flex flex-col max-w-xl w-full mx-auto py-4 space-y-4">
        {is_loading ? (
          // Show skeletons while loading
          Array.from({ length: 3 }).map((_, index) => (
            <ListingSkeleton key={index} />
          ))
        ) : domains_listings.length > 0 ? (
          domains_listings.map((listing, index) => (
            <DomainListingCard key={index} listing={listing} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <GlobeIcon className="w-16 h-16 mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No listings yet</h2>
            <p className="text-muted-foreground mb-4">
              Be the first to add a domain listing!
            </p>
            <AddListingDialog fetch_listings={fetch_listings} />
          </div>
        )}
      </div>
    </div>
  );
}

interface DomainListingCardProps {
  listing: Listing;
}

function DomainListingCard({ listing }: DomainListingCardProps) {
  const [is_open, set_is_open] = useState(false);

  const get_icon = (type: ContactMethodType) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "discord":
        return <FaDiscord className="w-4 h-4" />;
      case "instagram":
        return <FaInstagram className="w-4 h-4" />;
      case "twitter":
        return <FaTwitter className="w-4 h-4" />;
      case "telegram":
        return <FaTelegram className="w-4 h-4" />;
    }
  };

  const get_contact_link = (type: ContactMethodType, value: string) => {
    switch (type) {
      case "email":
        return `mailto:${value}`;
      case "discord":
        return `https://discord.com/users/${value}`;
      case "instagram":
        return `https://instagram.com/${value}`;
      case "twitter":
        return `https://twitter.com/${value}`;
      case "telegram":
        return `https://t.me/${value}`;
      default:
        return "#";
    }
  };

  const contact_methods = Array.isArray(listing.contact_methods)
    ? listing.contact_methods
    : JSON.parse(listing.contact_methods as string);

  return (
    <Card className="overflow-hidden p-4">
      <Accordion
        type="single"
        collapsible
        value={is_open ? "item-1" : ""}
        onValueChange={(value) => set_is_open(value === "item-1")}
      >
        <AccordionItem value="item-1" className="border-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GlobeIcon className="w-4 h-4" />
              <h3 className="text-base">{listing.domain}</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-auto px-2.5 py-1.5"
              onClick={() => set_is_open(!is_open)}
            >
              Contact
            </Button>
          </div>
          <AccordionContent className="p-0 mt-2">
            <CardContent>
              <div className="flex gap-2 flex-col">
                <p className="text-sm text-muted-foreground flex flex-col gap-1">
                  <span className="text-foreground font-semibold text-base">
                    {listing.name}
                  </span>
                </p>
                {contact_methods.map((method: ContactMethod, index: number) => (
                  <Link
                    key={index}
                    href={get_contact_link(method.type, method.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline text-sm w-fit"
                  >
                    {get_icon(method.type)}
                    <span>{method.value}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

function AddListingDialog({
  fetch_listings,
}: {
  fetch_listings: () => Promise<void>;
}) {
  const [open, set_open] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ListingSchema>({
    resolver: zodResolver(listing_schema),
    mode: "onSubmit", // Change this to onSubmit
  });

  const on_submit = async (data: ListingSchema) => {
    const form_data = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) form_data.append(key, value);
    });

    const result = await add_listing(form_data);

    if (result.error) {
      console.error("Error adding listing:", result.error);
    } else {
      set_open(false);
      reset();
      fetch_listings();
    }
  };

  return (
    <Dialog open={open} onOpenChange={set_open}>
      <DialogTrigger asChild>
        <Button className="px-3 py-2 h-auto text-xs">Add listing</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(on_submit)} className="space-y-4">
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                First Name
                <Asterisk className="w-3 h-3 text-red-500" />
              </Label>
              <Input id="name" {...register("name")} placeholder="John" />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain" className="flex items-center gap-1">
                Domain
                <Asterisk className="w-3 h-3 text-red-500" />
              </Label>
              <Input
                id="domain"
                {...register("domain")}
                placeholder="example.com"
              />
              {errors.domain && (
                <p className="text-red-500 text-sm">{errors.domain.message}</p>
              )}
            </div>
            {contact_method_options.map((method) => (
              <div key={method.value} className="space-y-2">
                <Label htmlFor={`contact_${method.value}`}>
                  {method.label}{" "}
                  {method.value === "email" ? "address" : "username"}
                </Label>
                <Input
                  id={`contact_${method.value}`}
                  {...register(
                    `contact_${method.value}` as keyof ListingSchema
                  )}
                  placeholder={
                    method.value === "email" ? "john@example.com" : "username"
                  }
                />
                {errors[`contact_${method.value}` as keyof ListingSchema] && (
                  <p className="text-red-500 text-sm">
                    {
                      errors[`contact_${method.value}` as keyof ListingSchema]
                        ?.message
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Add Listing
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ListingSkeleton() {
  return (
    <Card className="overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </Card>
  );
}
