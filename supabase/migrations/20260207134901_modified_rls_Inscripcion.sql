drop policy "Only authenticated users can INSERT" on "public"."Inscripciones";


  create policy "Enable insert for authenticated users only"
  on "public"."Inscripciones"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



