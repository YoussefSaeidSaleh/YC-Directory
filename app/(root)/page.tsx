import StartupCard, {
  StartupCardSkeleton,
  StartupTypeCard,
} from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { SanityLive } from "@/sanity/lib/live";
import { freshClient } from "@/sanity/lib/client";
import { Suspense } from "react";

async function PostsSection({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const posts = await freshClient.fetch(STARTUPS_QUERY, params);

  return (
    <>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}

async function SearchFormWrapper({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  return <SearchForm query={query} />;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions
        </p>

        <Suspense fallback={null}>
          <SearchFormWrapper searchParams={searchParams} />
        </Suspense>
      </section>

      <Suspense
        fallback={
          <section className="section_container">
            <p className="text-30-semibold">All Startups</p>
            <ul className="mt-7 card_grid">
              <StartupCardSkeleton />
            </ul>
          </section>
        }
      >
        <PostsSection searchParams={searchParams} />
      </Suspense>
    </>
  );
}
