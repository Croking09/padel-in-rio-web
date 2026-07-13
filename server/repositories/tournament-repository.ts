import { createAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type TournamentRow = Database["public"]["Tables"]["tournaments"]["Row"];
type TournamentInsert = Database["public"]["Tables"]["tournaments"]["Insert"];
type TournamentUpdate = Database["public"]["Tables"]["tournaments"]["Update"];

export const tournamentRepository = {
  async count() {
    const supabase = createAdmin();
    const { count, error } = await supabase
      .from("tournaments")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count;
  },

  async findAll(): Promise<TournamentRow[]> {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  async findById(id: number): Promise<TournamentRow> {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  getPublicImageUrl(path: string) {
    const supabase = createAdmin();
    return supabase.storage.from("torneos").getPublicUrl(path).data.publicUrl;
  },

  async insert(input: TournamentInsert) {
    const supabase = await createClient();
    const { error } = await supabase.from("tournaments").insert(input);
    if (error) throw error;
  },

  async deleteById(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from("tournaments").delete().eq("id", id);
    if (error) throw error;
  },

  async removeImage(path: string) {
    const supabase = await createClient();
    await supabase.storage.from("torneos").remove([path]);
  },

  async findMetaById(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tournaments")
      .select("name, inscription_end_date, manually_closed")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateManuallyClosed(id: number, manuallyClosed: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tournaments")
      .update({ manually_closed: manuallyClosed } satisfies TournamentUpdate)
      .eq("id", id);

    if (error) throw error;
  },

  async uploadImage(file: File): Promise<string> {
    const supabase = await createClient();

    const fileExt = file.name.split(".").pop();
    const uploadFileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("torneos")
      .upload(uploadFileName, file, { upsert: true });

    if (error) throw error;
    return uploadFileName;
  },
};
