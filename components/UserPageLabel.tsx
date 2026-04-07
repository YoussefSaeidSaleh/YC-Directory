"use client";

import { Skeleton } from "./ui/skeleton";

function UserPageLabelFallback() {
  return <Skeleton className="h-10 w-40" />;
}

function UserPageLabel({
  session,
  id,
}: {
  session: { user?: { id?: string } } | null;
  id: string;
}) {
  return (
    <p className="text-30-bold">
      {session?.user?.id === id ? "Your" : "All"} Startups
    </p>
  );
}

export { UserPageLabel, UserPageLabelFallback };
