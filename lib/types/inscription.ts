import type { Database } from "@/lib/database.types";

export type InscriptionRow =
  Database["public"]["Tables"]["inscriptions"]["Row"];

export type InscriptionInsert =
  Database["public"]["Tables"]["inscriptions"]["Insert"];

export type CreateInscriptionInput = Omit<InscriptionInsert, "id" | "user_id">;
