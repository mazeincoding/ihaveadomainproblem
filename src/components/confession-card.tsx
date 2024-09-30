"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { use_confession_store } from "@/store/confession-store";
import MotionNumber from "motion-number";
import { format_relative_time } from "@/utils/date-utils";

export function ConfessionCard({
  initial_count,
  initial_latest,
}: {
  initial_count: number;
  initial_latest: string | null;
}) {
  const [count, set_count] = useState(initial_count);
  const [latest, set_latest] = useState<string | null>(initial_latest);
  const [, set_update_trigger] = useState(0);
  const {
    increment_count,
    initialize_real_time,
    check_local_confession,
    has_confessed,
    set_confession_count,
    set_latest_confession,
    latest_confession,
  } = use_confession_store();

  useEffect(() => {
    set_confession_count(initial_count);
    set_latest_confession(initial_latest);
    initialize_real_time();
    check_local_confession();

    const timer = setInterval(() => {
      set_update_trigger(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [
    initialize_real_time,
    check_local_confession,
    set_confession_count,
    set_latest_confession,
    initial_count,
    initial_latest,
  ]);

  useEffect(() => {
    const unsubscribe = use_confession_store.subscribe((state) => {
      set_count(state.confession_count);
      set_latest(state.latest_confession);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    set_latest(latest_confession);
  }, [latest_confession]);

  const handle_confession = async () => {
    if (!has_confessed) {
      await increment_count();
      set_latest(latest_confession);
    }
  };

  const format_timestamp = (timestamp: string | null) => {
    if (!timestamp) return "No confessions yet";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Globe className="w-12 h-12 mx-auto text-primary mb-4" />
        <CardTitle className="text-2xl font-bold">
          Domain Addiction Support Group
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          If you&apos;re reading this far, you probably have a domain problem
          too.
        </p>
        <Button
          onClick={handle_confession}
          variant="outline"
          className="w-full"
          disabled={has_confessed}
        >
          {has_confessed ? "You've confessed" : "I have a domain problem"}
        </Button>
        <Separator />
        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <MotionNumber value={count} />
          {count === 1 ? " person has" : " people have"} confessed their domain
          addiction.
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Latest confession: {format_relative_time(latest)}
        </p>
      </CardContent>
    </Card>
  );
}
