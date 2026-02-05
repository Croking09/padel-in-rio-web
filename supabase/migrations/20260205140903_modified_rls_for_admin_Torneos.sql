drop policy "Only admin can write" on "public"."Torneos";


  create policy "Admin can do ANYTHING"
  on "public"."Torneos"
  as permissive
  for all
  to public
using (((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true));



  create policy "Admins can do ANYTHING 1g80m2a_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'torneos'::text) AND ((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true)));



  create policy "Admins can do ANYTHING 1g80m2a_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'torneos'::text) AND ((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true)));



  create policy "Admins can do ANYTHING 1g80m2a_2"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'torneos'::text) AND ((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true)));



  create policy "Admins can do ANYTHING 1g80m2a_3"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'torneos'::text) AND ((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true)));



