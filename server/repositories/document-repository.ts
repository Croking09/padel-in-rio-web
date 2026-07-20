import "server-only";

import { createAdmin } from "@/lib/supabase/admin";

export const documentRepository = {
  async getDocument(path: string) {
    const supabase = createAdmin();
    const { data, error } = await supabase.storage
      .from("documents")
      .download(path);
    if (error) throw error;
    return data.text();
  },
};
