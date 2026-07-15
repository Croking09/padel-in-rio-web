"use server";
import { createAdmin } from "@/lib/supabase/admin";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { Temporada, TemporadaWithMonths } from "@/lib/types/temporada";
import { createClient } from "@/lib/supabase/server";
import { Month } from "@/lib/types/month";
import { mapMonthStatus } from "@/lib/utils";
import { CategoryClassification } from "@/lib/types/classification";
import { Bonus } from "@/lib/types/bonus";

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
