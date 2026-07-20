alter table "public"."months" drop constraint "months_season_id_fkey";

alter table "public"."months" add constraint "months_season_id_fkey" FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE not valid;

alter table "public"."months" validate constraint "months_season_id_fkey";


