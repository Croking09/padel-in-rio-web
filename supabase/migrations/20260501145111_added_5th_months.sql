drop function if exists "public"."register_match_results"(p_partido_id integer, p_sets jsonb);

alter table "public"."Meses" add column "5_category" boolean not null default true;


