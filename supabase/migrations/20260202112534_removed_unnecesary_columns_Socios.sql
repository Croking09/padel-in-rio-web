drop policy "Only self can query their data" on "public"."Socios";

alter table "public"."Socios" drop constraint "Socios_email_key";

alter table "public"."Socios" drop constraint "Socios_user_id_fkey";

alter table "public"."Socios" drop constraint "Socios_user_id_key";

drop index if exists "public"."Socios_email_key";

drop index if exists "public"."Socios_user_id_key";

alter table "public"."Socios" drop column "email";

alter table "public"."Socios" drop column "name";

alter table "public"."Socios" drop column "user_id";

alter table "public"."Socios" add column "full_name" text not null;


  create policy "Everyone can SELECT"
  on "public"."Socios"
  as permissive
  for select
  to public
using (true);



