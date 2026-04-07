import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import StartupFrom from "@/components/StartupFrom";
import { Skeleton } from "@/components/ui/skeleton";

function StartupFormFallback() {
  return <Skeleton className="h-96 w-full" />;
}

async function AuthCheck() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <StartupFrom />;
}

const page = async () => {
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Submit Your Startup Pitch</h1>
      </section>

      <Suspense fallback={<StartupFormFallback />}>
        <AuthCheck />
      </Suspense>
    </>
  );
};

export default page;
