"use server";
import { createAdmin } from "@/lib/supabase/admin";
import { unstable_cache } from "next/cache";
import { Temporada } from "@/lib/types/temporada";
import { createClient } from "@/lib/supabase/server";
import { Month } from "@/lib/types/month";
import { mapMonthStatus } from "@/lib/utils";

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
