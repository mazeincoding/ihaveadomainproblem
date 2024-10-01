import { supabase } from "@/lib/supabase-client";
import { ConfessionCard } from "@/components/confession-card";
import { Header } from "@/components/header";

export const revalidate = 0;

export default async function Home() {
  const { count, error } = await supabase
    .from("domain_confessions")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching confession count:", error);
  }

  const initial_count = count ?? 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex-grow flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
        <ConfessionCard initial_count={initial_count} />
      </div>
    </div>
  );
}
