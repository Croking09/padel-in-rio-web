"use server";
import { createAdmin } from "@/lib/supabase/admin";
import { revalidatePath, unstable_cache } from "next/cache";
import { Temporada, TemporadaWithMonths } from "@/lib/types/temporada";
import { createClient } from "@/lib/supabase/server";
import { Month } from "@/lib/types/month";
import { mapMonthStatus } from "@/lib/utils";
import { CategoryClassification } from "@/lib/types/classification";
import { Bonus } from "@/lib/types/bonus";

export const getLigasCount = unstable_cache(
  async () => {
    const supabase = createAdmin();
    const { count } = await supabase
      .from("Temporadas")
      .select("*", { count: "exact", head: true });
    return count;
  },
  ["ligas-count"],
  {
    revalidate: 86400, // 24 horas
    tags: ["ligas-count"],
  },
);

export async function getTemporadas(): Promise<Temporada[]> {
  const supabase = await createClient({ useCookies: false });
  const { data: temporadas, error } = await supabase
    .from("Temporadas")
    .select("*")
    .order("start_date", { ascending: false }); // Most recent first

  if (error) console.error(error);

  return (temporadas ?? []).map((t) => ({
    ...t,
    start_date: new Date(t.start_date),
  }));
}

export async function getMonths(): Promise<Month[]> {
  const supabase = await createClient({ useCookies: false });

  const { data: months, error } = await supabase
    .from("Meses")
    .select("*")
    .order("year")
    .order("month", { ascending: true });

  if (error) throw error;

  return (months ?? []).map((m) => ({
    ...m,
    status: mapMonthStatus(m.status),
  }));
}

export async function updateUseFithCategory(
  monthId: number,
  useFifth: boolean,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("Meses")
    .update({ "5_category": useFifth })
    .eq("id", monthId);

  if (error) console.error(error);
}

export async function giveMonthlyBonus(
  classification: CategoryClassification[],
  month_id: number,
) {
  const supabase = await createClient();

  const { data: existing, error: checkError } = await supabase
    .from("Bonus")
    .select("id")
    .eq("mes_id", month_id)
    .limit(1);

  if (checkError) {
    console.error("Error comprobando bonus:", checkError);
    throw checkError;
  }

  if (existing && existing.length > 0) {
    return { success: false };
  }

  const bonuses: Bonus[] = classification
    .filter((categoryBlock) => categoryBlock.category.id !== 1)
    .flatMap((categoryBlock) => {
      return categoryBlock.classification.slice(0, 3).map((player) => ({
        player_id: player.player_id,
        quantity: 2,
        mes_id: month_id,
      }));
    });

  const { error } = await supabase.from("Bonus").insert(bonuses);

  if (error) {
    console.error("Error insertando bonus:", error);
    throw error;
  }

  revalidatePath("/liga/clasificacion");

  return { success: true };
}

export async function hasBonusGiven(monthId: number) {
  const supabase = await createClient({ useCookies: false });

  const { data, error } = await supabase
    .from("Bonus")
    .select("id")
    .eq("mes_id", monthId)
    .limit(1);

  if (error) {
    console.error(error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

export async function getTemporadasWithMonths(): Promise<
  TemporadaWithMonths[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Temporadas")
    .select(
      `
    *,
    months:Meses (*)
  `,
    )
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}

type CreateTemporadaInput = {
  name: string;
  start_date: string; // "YYYY-MM-DD"
  months: { month: number; year: number }[];
};

export async function createTemporada(
  input: CreateTemporadaInput,
): Promise<{ error: string } | null> {
  const supabase = createAdmin();

  const { error } = await supabase.rpc("create_temporada_with_months", {
    p_name: input.name,
    p_start_date: input.start_date,
    p_months: input.months,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/liga/temporadas");
  return null;
}
