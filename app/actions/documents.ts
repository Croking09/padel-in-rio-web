import { createAdmin } from "@/lib/supabase/admin";
import { cacheLife, cacheTag } from "next/cache";

export async function getDocument(path: string) {
  "use cache";
  cacheLife("max");
  cacheTag(`document:${path}`);

  const supabase = createAdmin();

  const { data, error } = await supabase.storage
    .from("documents")
    .download(path);

  if (error) {
    console.error(error);
  }

  return data?.text() ?? "";
}
