import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserStartups from "@/components/UserStartups";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";

export const ppr = true;

// ✅ 1. فصل الـ Header في مكون خاص لأنه يعتمد على auth()
async function StartupsHeader({ id }: { id: string }) {
  const session = await auth(); // تم النقل هنا داخل الـ Suspense

  return (
    <p className="text-30-bold">
      {session?.id === id ? "Your" : "All"} Startups
    </p>
  );
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  // ❌ تمت إزالة auth() من هنا لمنع حجز الصفحة

  // ✅ 2. جلب بيانات المستخدم كبيانات ثابتة (Static)
  const user = await client.fetch(
    AUTHOR_BY_ID_QUERY,
    { id },
    { cache: "force-cache" },
  );

  if (!user) return notFound();

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image || ""}
            alt={user.name || ""}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <Suspense fallback={<p className="text-30-bold">Startups</p>}>
            <StartupsHeader id={id} />
          </Suspense>

          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;
