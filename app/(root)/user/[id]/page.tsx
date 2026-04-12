import { auth } from "@/auth";
import { StartupCardSkeleton } from "@/components/StartupCard";
import UserStartups from "@/components/UserStartups";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getUserById(id: string) {
  "use cache";
  cacheLife("max");
  return client.fetch(AUTHOR_BY_ID_QUERY, { id });
}

async function UserStartupsSection({ id }: { id: string }) {
  const session = await auth();

  return (
    <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
      <p className="text-30-bold">
        {session?.id === id ? "Your" : "All"} Startups
      </p>
      <ul className="card_grid-sm">
        <UserStartups id={id} />
      </ul>
    </div>
  );
}

async function UserProfileContent({ id }: { id: string }) {
  const user = await getUserById(id);

  if (!user) return notFound();

  return (
    <section className="profile_container">
      <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-black uppercase text-center line-clamp-1">
            {user.name}
          </h3>
        </div>

        <Image
          src={user.image}
          alt={user.name}
          width={220}
          height={220}
          className="profile_image"
        />

        <p className="text-30-extrabold mt-7 text-center">@{user?.username}</p>
        <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
      </div>

      <Suspense
        fallback={
          <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
            <p className="text-30-bold">Startups</p>
            <ul className="card_grid-sm">
              <StartupCardSkeleton />
            </ul>
          </div>
        }
      >
        <UserStartupsSection id={id} />
      </Suspense>
    </section>
  );
}

const UserPageContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <UserProfileContent id={id} />;
};

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<div className="profile_container animate-pulse" />}>
      <UserPageContent params={params} />
    </Suspense>
  );
};

export default page;
