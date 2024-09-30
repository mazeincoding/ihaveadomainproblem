"use client";

import MotionNumber from "motion-number";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoolCounter() {
  const count = 20;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Cool Counter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-6xl font-bold text-center text-primary">
            <MotionNumber value={count} />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            This is a static counter set to 20
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
