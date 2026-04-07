"use client";

function SessionLabel({
  session,
}: {
  session: { user?: { id?: string } } | null;
}) {
  return (
    <span className="text-16-semibold text-black">
      {session?.user ? "My Startups" : "All Startups"}
    </span>
  );
}

export default SessionLabel;
