alter table "public"."Torneos" alter column "end_date" set data type timestamp with time zone using "end_date"::timestamp with time zone;

alter table "public"."Torneos" alter column "inscription_end_date" set data type timestamp with time zone using "inscription_end_date"::timestamp with time zone;

alter table "public"."Torneos" alter column "start_date" set data type timestamp with time zone using "start_date"::timestamp with time zone;


  create policy "Only within date"
  on "public"."Inscripciones"
  as restrictive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public."Torneos" t
  WHERE ((t.id = "Inscripciones".torneo_id) AND (now() < t.inscription_end_date)))));



