import { createAdmin } from "@/lib/supabase/admin";
import { unstable_cache } from "next/cache";

export async function getDocument(path: string) {
  return unstable_cache(
    async () => {
      const supabase = createAdmin();

      const { data, error } = await supabase.storage
        .from("documents")
        .download(path);

      if (error) {
        console.error(error);
      }

      return data?.text() ?? "";
    },
    [`document:${path}`],
    {
      tags: [`document:${path}`],
    },
  )();
}
