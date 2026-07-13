import "server-only";

import { createAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { MemberRow, MemberInsert, MemberUpdate } from "@/lib/types/member";

export const memberRepository = {
  async count(onlyActive?: boolean) {
    const supabase = createAdmin();

    let query = supabase
      .from("members")
      .select("*", { count: "exact", head: true });

    if (onlyActive !== undefined) {
      query = query.eq("is_active", onlyActive);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count;
  },

  async findAll(onlyActive?: boolean): Promise<MemberRow[]> {
    const supabase = createAdmin();
    let query = supabase
      .from("members")
      .select("*")
      .order("full_name", { ascending: true });

    if (onlyActive !== undefined) {
      query = query.eq("is_active", onlyActive);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateActive(id: number, active: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("members")
      .update({ is_active: active })
      .eq("id", id);

    if (error) throw error;
  },

  async update(id: number, input: MemberUpdate) {
    const supabase = await createClient();
    const { error } = await supabase.from("members").update(input).eq("id", id);
    if (error) throw error;
  },

  async insert(input: MemberInsert) {
    const supabase = await createClient();
    const { error } = await supabase.from("members").insert(input);
    if (error) throw error;
  },
};
