"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { use_confession_store } from "@/store/confession-store";
import MotionNumber from "motion-number";

export function ConfessionCard({ initial_count }: { initial_count: number }) {
  const [count, set_count] = useState(initial_count);
  const {
    increment_count,
    initialize_real_time,
    check_local_confession,
    has_confessed,
    set_confession_count,
  } = use_confession_store();

  useEffect(() => {
    set_confession_count(initial_count);
    initialize_real_time();
    check_local_confession();
  }, [
    initialize_real_time,
    check_local_confession,
    set_confession_count,
    initial_count,
  ]);

  useEffect(() => {
    const unsubscribe = use_confession_store.subscribe((state) => {
      set_count(state.confession_count);
    });
    return () => unsubscribe();
  }, []);

  const handle_confession = () => {
    if (!has_confessed) {
      increment_count();
    }
  };

  return (
    <Card className="w-full max-w-lg mx-4">
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
      </CardContent>
    </Card>
  );
}
