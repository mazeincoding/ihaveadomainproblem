import { supabase } from "@/lib/supabase-client";
import { ConfessionCard } from "@/components/confession-card";

export const revalidate = 0; // Disable caching for this route

export default async function Home() {
  const { data, count, error } = await supabase
    .from("domain_confessions")
    .select("created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching confession data:", error);
    // You might want to add error handling here
  }

  const initial_count = count ?? 0;
  const initial_latest = data && data.length > 0 ? data[0].created_at : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <ConfessionCard initial_count={initial_count} initial_latest={initial_latest} />
    </div>
  );
}
