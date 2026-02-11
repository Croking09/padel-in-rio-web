alter table "public"."Torneos" add column "end_date" timestamp without time zone not null;

alter table "public"."Torneos" add column "inscription_end_date" timestamp without time zone not null;

alter table "public"."Torneos" alter column "name" set not null;

alter table "public"."Torneos" alter column "start_date" set not null;


