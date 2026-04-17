import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

const md = markdownit();

export const ppr = true;

function StartupPageSkeleton() {
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2" />
      </section>
      <section className="section_container">
        <Skeleton className="w-full aspect-video rounded-xl" />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <div className="flex gap-2 items-center mb-3">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
        <hr className="divider" />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-7" />
          <div className="card_grid-sm">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

async function StartupPageContent({ id }: { id: string }) {
  const [post, playlistData] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }, { cache: "force-cache" }),
    client.fetch(
      PLAYLIST_BY_SLUG_QUERY,
      { slug: "editor-picks-new" },
      { cache: "force-cache" }
    ),
  ]);

  if (!post) return notFound();

  const editorPosts = (playlistData?.select ?? []) as unknown as StartupTypeCard[];
  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={post.image ?? ""}
            alt="thumbnail"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              {post.author?.image && (
                <Image
                  src={post.author.image}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-lg"
                />
              )}

              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author?.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {editorPosts.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<StartupPageSkeleton />}>
      <StartupPageContent id={id} />
    </Suspense>
  );
}