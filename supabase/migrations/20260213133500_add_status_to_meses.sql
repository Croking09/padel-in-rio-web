alter table "public"."Meses"
add column "status" text not null default 'draft';

alter table "public"."Meses"
add constraint "Meses_status_check" check (status in ('draft', 'locked', 'confirmed'));
