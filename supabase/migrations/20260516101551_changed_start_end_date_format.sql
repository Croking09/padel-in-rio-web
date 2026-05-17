alter table "public"."Torneos" alter column "end_date" set data type date using "end_date"::date;

alter table "public"."Torneos" alter column "start_date" set data type date using "start_date"::date;
