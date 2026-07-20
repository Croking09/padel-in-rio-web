alter table "public"."inscriptions" drop constraint "inscriptions_tournament_id_fkey";

alter table "public"."inscriptions" add constraint "inscriptions_tournament_id_fkey" FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE not valid;

alter table "public"."inscriptions" validate constraint "inscriptions_tournament_id_fkey";


  create policy "Admins can do ANYTHING"
  on "public"."members"
  as permissive
  for all
  to public
using (((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true));



