import { freshClient } from "@/sanity/lib/client"; // يفضل استخدام freshClient لضمان البيانات الحية
import ViewClient from "./ViewClient";

// --- Server Component (Wrapper للـ PPR) ---
const View = async ({ id }: { id: string }) => {
  // نستخدم freshClient أو client مع no-store لجلب البيانات الديناميكية
  const result = await freshClient.fetch(
    `*[_id == $id][0]{ views }`,
    { id },
    { cache: "no-store" }, // ضمان عدم التخزين المؤقت
  );

  const initialViews = result?.views ?? 0;

  return <ViewClient id={id} initialViews={initialViews} />;
};

export default View;
