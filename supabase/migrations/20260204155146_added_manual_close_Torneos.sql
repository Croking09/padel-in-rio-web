alter table "public"."Torneos" add column "manually_closed" boolean not null;


  create policy "Only if not manually closed"
  on "public"."Inscripciones"
  as restrictive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public."Torneos" t
  WHERE ((t.id = "Inscripciones".torneo_id) AND (t.manually_closed = false)))));



