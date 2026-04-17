import { Suspense } from "react";
import StartupForm from "@/components/StartupFrom";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function ProtectedCreateStartup() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Submit Your Startup</h1>
      </section>

      <StartupForm />
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ProtectedCreateStartup />
    </Suspense>
  );
}
