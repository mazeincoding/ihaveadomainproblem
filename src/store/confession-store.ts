import { create } from "zustand";
import { supabase } from "@/lib/supabase-client";

type ConfessionStore = {
  confession_count: number;
  has_confessed: boolean;
  increment_count: () => Promise<void>;
  initialize_real_time: () => void;
  check_local_confession: () => void;
  set_confession_count: (count: number) => void;
};

export const use_confession_store = create<ConfessionStore>((set) => ({
  confession_count: 0,
  has_confessed: true,
  increment_count: async () => {
    const { error } = await supabase.from("domain_confessions").insert({});
    if (!error) {
      localStorage.setItem("has_confessed", "true");
      set((state) => ({
        has_confessed: true,
        confession_count: state.confession_count + 1,
      }));
    }
  },
  initialize_real_time: () => {
    supabase
      .channel("domain_confessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "domain_confessions" },
        () => {
          supabase
            .from("domain_confessions")
            .select("*", { count: "exact", head: true })
            .then(({ count }) => {
              if (count !== null) set({ confession_count: count });
            });
        }
      )
      .subscribe();
  },
  check_local_confession: () => {
    const has_confessed = localStorage.getItem("has_confessed") === "true";
    set({ has_confessed });
  },
  set_confession_count: (count: number) => {
    set({ confession_count: count });
  },
}));
