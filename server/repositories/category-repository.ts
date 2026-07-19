import "server-only";

import { createAdmin } from "@/lib/supabase/admin";

export const categoryRepository = {
  async getAll() {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("order");

    if (error) throw error;
    return data;
  },
};
