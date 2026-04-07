import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import markdownit from "markdown-it";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

const md = markdownit();

async function StartupContent({ id }: { id: string }) {
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post.image || "/startup-placeholder.png"}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className=" flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className=" flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author?.image || "/user-placeholder.png"}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full w-[64px] h-[64px] drop-shadow-lg"
              />

              <div>
                <p className=" text-20-medium">{post.author?.name || "Unknown"}</p>
                <p className=" text-16-medium">@{post.author?.username || "unknown"}</p>
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
      </section>

      <View id={id} />
    </>
  );
}

function StartupContentFallback() {
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-3/4 mt-2" />
        <Skeleton className="h-6 w-1/2 mt-2" />
      </section>

      <section className="section_container">
        <Skeleton className="h-64 w-full" />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full" />
        </div>
      </section>
    </>
  );
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  return (
    <Suspense fallback={<StartupContentFallback />}>
      <StartupContent id={id} />
    </Suspense>
  );
};

export default page;
