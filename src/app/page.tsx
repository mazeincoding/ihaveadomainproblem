import { supabase } from "@/lib/supabase-client";
import { ConfessionCard } from "@/components/confession-card";

export const revalidate = 0; // Disable caching for this route

export default async function Home() {
  const { count, error } = await supabase
    .from("domain_confessions")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching confession count:", error);
    // You might want to add error handling here
  }

  const initial_count = count ?? 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <ConfessionCard initial_count={initial_count} />
    </div>
  );
}
