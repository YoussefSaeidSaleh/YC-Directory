import React, { Suspense } from "react";
import Ping from "./Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { Skeleton } from "./ui/skeleton";

async function ViewContent({ id }: { id: string }) {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  if (typeof window === "undefined") {
    const { after } = await import("next/server");
    after(async () => {
      await writeClient.patch(id).set({ views: totalViews + 1 }).commit();
    });
  }

  return (
    <div className="view-container mr-40">
      <div className="absolute -top2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
}

function ViewFallback() {
  return (
    <div className="view-container">
      <Skeleton className="h-6 w-20" />
    </div>
  );
}

const View = ({ id }: { id: string }) => {
  return (
    <Suspense fallback={<ViewFallback />}>
      <ViewContent id={id} />
    </Suspense>
  );
};

export default View;