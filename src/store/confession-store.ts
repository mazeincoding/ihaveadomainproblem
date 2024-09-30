import { create } from "zustand";
import { supabase } from "@/lib/supabase-client";

type ConfessionStore = {
  confession_count: number;
  has_confessed: boolean;
  latest_confession: string | null;
  increment_count: () => Promise<void>;
  initialize_real_time: () => void;
  check_local_confession: () => void;
  set_confession_count: (count: number) => void;
  set_latest_confession: (timestamp: string | null) => void;
};

export const use_confession_store = create<ConfessionStore>((set) => ({
  confession_count: 0,
  has_confessed: true,
  latest_confession: null,
  increment_count: async () => {
    const { data, error } = await supabase
      .from("domain_confessions")
      .insert({})
      .select();
    if (!error && data) {
      localStorage.setItem("has_confessed", "true");
      set((state) => ({
        has_confessed: true,
        confession_count: state.confession_count + 1,
        latest_confession: data[0].created_at,
      }));
    }
  },
  initialize_real_time: () => {
    supabase
      .channel("domain_confessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "domain_confessions" },
        (payload) => {
          supabase
            .from("domain_confessions")
            .select("*", { count: "exact", head: true })
            .order("created_at", { ascending: false })
            .limit(1)
            .then(({ count, data }) => {
              if (count !== null) set({ confession_count: count });
              if (data && data.length > 0) {
                set({ latest_confession: data[0].created_at });
              }
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
  set_latest_confession: (timestamp: string | null) => {
    set({ latest_confession: timestamp });
  },
}));
