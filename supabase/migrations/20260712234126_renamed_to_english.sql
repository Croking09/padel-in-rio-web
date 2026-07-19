create type "public"."month_status" as enum ('draft', 'locked', 'confirmed');

drop policy "Admin can do anything" on "public"."Bonus";

drop policy "Enable read access for all users" on "public"."Bonus";

drop policy "Enable read access for all users" on "public"."Categorias";

drop policy "Enable insert for authenticated users only" on "public"."Inscripciones";

drop policy "Only if not manually closed" on "public"."Inscripciones";

drop policy "Only within date" on "public"."Inscripciones";

drop policy "Enable read access for all users" on "public"."Jornadas";

drop policy "Enable read access for all users" on "public"."Jugador_Categoria_Mes";

drop policy "Admin can do anything" on "public"."Meses";

drop policy "Enable read access for all users" on "public"."Meses";

drop policy "Enable read access for all users" on "public"."Participacion";

drop policy "Enable read access for all users" on "public"."Partidos";

drop policy "Enable read access for all users" on "public"."Sets";

drop policy "Everyone can SELECT" on "public"."Socios";

drop policy "Anyone can read" on "public"."Temporadas";

drop policy "Only admin can write" on "public"."Temporadas";

drop policy "Admin can do ANYTHING" on "public"."Torneos";

drop policy "Everyone can read" on "public"."Torneos";

revoke delete on table "public"."Bonus" from "anon";

revoke insert on table "public"."Bonus" from "anon";

revoke references on table "public"."Bonus" from "anon";

revoke select on table "public"."Bonus" from "anon";

revoke trigger on table "public"."Bonus" from "anon";

revoke truncate on table "public"."Bonus" from "anon";

revoke update on table "public"."Bonus" from "anon";

revoke delete on table "public"."Bonus" from "authenticated";

revoke insert on table "public"."Bonus" from "authenticated";

revoke references on table "public"."Bonus" from "authenticated";

revoke select on table "public"."Bonus" from "authenticated";

revoke trigger on table "public"."Bonus" from "authenticated";

revoke truncate on table "public"."Bonus" from "authenticated";

revoke update on table "public"."Bonus" from "authenticated";

revoke delete on table "public"."Bonus" from "service_role";

revoke insert on table "public"."Bonus" from "service_role";

revoke references on table "public"."Bonus" from "service_role";

revoke select on table "public"."Bonus" from "service_role";

revoke trigger on table "public"."Bonus" from "service_role";

revoke truncate on table "public"."Bonus" from "service_role";

revoke update on table "public"."Bonus" from "service_role";

revoke delete on table "public"."Categorias" from "anon";

revoke insert on table "public"."Categorias" from "anon";

revoke references on table "public"."Categorias" from "anon";

revoke select on table "public"."Categorias" from "anon";

revoke trigger on table "public"."Categorias" from "anon";

revoke truncate on table "public"."Categorias" from "anon";

revoke update on table "public"."Categorias" from "anon";

revoke delete on table "public"."Categorias" from "authenticated";

revoke insert on table "public"."Categorias" from "authenticated";

revoke references on table "public"."Categorias" from "authenticated";

revoke select on table "public"."Categorias" from "authenticated";

revoke trigger on table "public"."Categorias" from "authenticated";

revoke truncate on table "public"."Categorias" from "authenticated";

revoke update on table "public"."Categorias" from "authenticated";

revoke delete on table "public"."Categorias" from "service_role";

revoke insert on table "public"."Categorias" from "service_role";

revoke references on table "public"."Categorias" from "service_role";

revoke select on table "public"."Categorias" from "service_role";

revoke trigger on table "public"."Categorias" from "service_role";

revoke truncate on table "public"."Categorias" from "service_role";

revoke update on table "public"."Categorias" from "service_role";

revoke delete on table "public"."Inscripciones" from "anon";

revoke insert on table "public"."Inscripciones" from "anon";

revoke references on table "public"."Inscripciones" from "anon";

revoke select on table "public"."Inscripciones" from "anon";

revoke trigger on table "public"."Inscripciones" from "anon";

revoke truncate on table "public"."Inscripciones" from "anon";

revoke update on table "public"."Inscripciones" from "anon";

revoke delete on table "public"."Inscripciones" from "authenticated";

revoke insert on table "public"."Inscripciones" from "authenticated";

revoke references on table "public"."Inscripciones" from "authenticated";

revoke select on table "public"."Inscripciones" from "authenticated";

revoke trigger on table "public"."Inscripciones" from "authenticated";

revoke truncate on table "public"."Inscripciones" from "authenticated";

revoke update on table "public"."Inscripciones" from "authenticated";

revoke delete on table "public"."Inscripciones" from "service_role";

revoke insert on table "public"."Inscripciones" from "service_role";

revoke references on table "public"."Inscripciones" from "service_role";

revoke select on table "public"."Inscripciones" from "service_role";

revoke trigger on table "public"."Inscripciones" from "service_role";

revoke truncate on table "public"."Inscripciones" from "service_role";

revoke update on table "public"."Inscripciones" from "service_role";

revoke delete on table "public"."Jornadas" from "anon";

revoke insert on table "public"."Jornadas" from "anon";

revoke references on table "public"."Jornadas" from "anon";

revoke select on table "public"."Jornadas" from "anon";

revoke trigger on table "public"."Jornadas" from "anon";

revoke truncate on table "public"."Jornadas" from "anon";

revoke update on table "public"."Jornadas" from "anon";

revoke delete on table "public"."Jornadas" from "authenticated";

revoke insert on table "public"."Jornadas" from "authenticated";

revoke references on table "public"."Jornadas" from "authenticated";

revoke select on table "public"."Jornadas" from "authenticated";

revoke trigger on table "public"."Jornadas" from "authenticated";

revoke truncate on table "public"."Jornadas" from "authenticated";

revoke update on table "public"."Jornadas" from "authenticated";

revoke delete on table "public"."Jornadas" from "service_role";

revoke insert on table "public"."Jornadas" from "service_role";

revoke references on table "public"."Jornadas" from "service_role";

revoke select on table "public"."Jornadas" from "service_role";

revoke trigger on table "public"."Jornadas" from "service_role";

revoke truncate on table "public"."Jornadas" from "service_role";

revoke update on table "public"."Jornadas" from "service_role";

revoke delete on table "public"."Jugador_Categoria_Mes" from "anon";

revoke insert on table "public"."Jugador_Categoria_Mes" from "anon";

revoke references on table "public"."Jugador_Categoria_Mes" from "anon";

revoke select on table "public"."Jugador_Categoria_Mes" from "anon";

revoke trigger on table "public"."Jugador_Categoria_Mes" from "anon";

revoke truncate on table "public"."Jugador_Categoria_Mes" from "anon";

revoke update on table "public"."Jugador_Categoria_Mes" from "anon";

revoke delete on table "public"."Jugador_Categoria_Mes" from "authenticated";

revoke insert on table "public"."Jugador_Categoria_Mes" from "authenticated";

revoke references on table "public"."Jugador_Categoria_Mes" from "authenticated";

revoke select on table "public"."Jugador_Categoria_Mes" from "authenticated";

revoke trigger on table "public"."Jugador_Categoria_Mes" from "authenticated";

revoke truncate on table "public"."Jugador_Categoria_Mes" from "authenticated";

revoke update on table "public"."Jugador_Categoria_Mes" from "authenticated";

revoke delete on table "public"."Jugador_Categoria_Mes" from "service_role";

revoke insert on table "public"."Jugador_Categoria_Mes" from "service_role";

revoke references on table "public"."Jugador_Categoria_Mes" from "service_role";

revoke select on table "public"."Jugador_Categoria_Mes" from "service_role";

revoke trigger on table "public"."Jugador_Categoria_Mes" from "service_role";

revoke truncate on table "public"."Jugador_Categoria_Mes" from "service_role";

revoke update on table "public"."Jugador_Categoria_Mes" from "service_role";

revoke delete on table "public"."Meses" from "anon";

revoke insert on table "public"."Meses" from "anon";

revoke references on table "public"."Meses" from "anon";

revoke select on table "public"."Meses" from "anon";

revoke trigger on table "public"."Meses" from "anon";

revoke truncate on table "public"."Meses" from "anon";

revoke update on table "public"."Meses" from "anon";

revoke delete on table "public"."Meses" from "authenticated";

revoke insert on table "public"."Meses" from "authenticated";

revoke references on table "public"."Meses" from "authenticated";

revoke select on table "public"."Meses" from "authenticated";

revoke trigger on table "public"."Meses" from "authenticated";

revoke truncate on table "public"."Meses" from "authenticated";

revoke update on table "public"."Meses" from "authenticated";

revoke delete on table "public"."Meses" from "service_role";

revoke insert on table "public"."Meses" from "service_role";

revoke references on table "public"."Meses" from "service_role";

revoke select on table "public"."Meses" from "service_role";

revoke trigger on table "public"."Meses" from "service_role";

revoke truncate on table "public"."Meses" from "service_role";

revoke update on table "public"."Meses" from "service_role";

revoke delete on table "public"."Participacion" from "anon";

revoke insert on table "public"."Participacion" from "anon";

revoke references on table "public"."Participacion" from "anon";

revoke select on table "public"."Participacion" from "anon";

revoke trigger on table "public"."Participacion" from "anon";

revoke truncate on table "public"."Participacion" from "anon";

revoke update on table "public"."Participacion" from "anon";

revoke delete on table "public"."Participacion" from "authenticated";

revoke insert on table "public"."Participacion" from "authenticated";

revoke references on table "public"."Participacion" from "authenticated";

revoke select on table "public"."Participacion" from "authenticated";

revoke trigger on table "public"."Participacion" from "authenticated";

revoke truncate on table "public"."Participacion" from "authenticated";

revoke update on table "public"."Participacion" from "authenticated";

revoke delete on table "public"."Participacion" from "service_role";

revoke insert on table "public"."Participacion" from "service_role";

revoke references on table "public"."Participacion" from "service_role";

revoke select on table "public"."Participacion" from "service_role";

revoke trigger on table "public"."Participacion" from "service_role";

revoke truncate on table "public"."Participacion" from "service_role";

revoke update on table "public"."Participacion" from "service_role";

revoke delete on table "public"."Partidos" from "anon";

revoke insert on table "public"."Partidos" from "anon";

revoke references on table "public"."Partidos" from "anon";

revoke select on table "public"."Partidos" from "anon";

revoke trigger on table "public"."Partidos" from "anon";

revoke truncate on table "public"."Partidos" from "anon";

revoke update on table "public"."Partidos" from "anon";

revoke delete on table "public"."Partidos" from "authenticated";

revoke insert on table "public"."Partidos" from "authenticated";

revoke references on table "public"."Partidos" from "authenticated";

revoke select on table "public"."Partidos" from "authenticated";

revoke trigger on table "public"."Partidos" from "authenticated";

revoke truncate on table "public"."Partidos" from "authenticated";

revoke update on table "public"."Partidos" from "authenticated";

revoke delete on table "public"."Partidos" from "service_role";

revoke insert on table "public"."Partidos" from "service_role";

revoke references on table "public"."Partidos" from "service_role";

revoke select on table "public"."Partidos" from "service_role";

revoke trigger on table "public"."Partidos" from "service_role";

revoke truncate on table "public"."Partidos" from "service_role";

revoke update on table "public"."Partidos" from "service_role";

revoke delete on table "public"."Sets" from "anon";

revoke insert on table "public"."Sets" from "anon";

revoke references on table "public"."Sets" from "anon";

revoke select on table "public"."Sets" from "anon";

revoke trigger on table "public"."Sets" from "anon";

revoke truncate on table "public"."Sets" from "anon";

revoke update on table "public"."Sets" from "anon";

revoke delete on table "public"."Sets" from "authenticated";

revoke insert on table "public"."Sets" from "authenticated";

revoke references on table "public"."Sets" from "authenticated";

revoke select on table "public"."Sets" from "authenticated";

revoke trigger on table "public"."Sets" from "authenticated";

revoke truncate on table "public"."Sets" from "authenticated";

revoke update on table "public"."Sets" from "authenticated";

revoke delete on table "public"."Sets" from "service_role";

revoke insert on table "public"."Sets" from "service_role";

revoke references on table "public"."Sets" from "service_role";

revoke select on table "public"."Sets" from "service_role";

revoke trigger on table "public"."Sets" from "service_role";

revoke truncate on table "public"."Sets" from "service_role";

revoke update on table "public"."Sets" from "service_role";

revoke delete on table "public"."Socios" from "anon";

revoke insert on table "public"."Socios" from "anon";

revoke references on table "public"."Socios" from "anon";

revoke select on table "public"."Socios" from "anon";

revoke trigger on table "public"."Socios" from "anon";

revoke truncate on table "public"."Socios" from "anon";

revoke update on table "public"."Socios" from "anon";

revoke delete on table "public"."Socios" from "authenticated";

revoke insert on table "public"."Socios" from "authenticated";

revoke references on table "public"."Socios" from "authenticated";

revoke select on table "public"."Socios" from "authenticated";

revoke trigger on table "public"."Socios" from "authenticated";

revoke truncate on table "public"."Socios" from "authenticated";

revoke update on table "public"."Socios" from "authenticated";

revoke delete on table "public"."Socios" from "service_role";

revoke insert on table "public"."Socios" from "service_role";

revoke references on table "public"."Socios" from "service_role";

revoke select on table "public"."Socios" from "service_role";

revoke trigger on table "public"."Socios" from "service_role";

revoke truncate on table "public"."Socios" from "service_role";

revoke update on table "public"."Socios" from "service_role";

revoke delete on table "public"."Temporadas" from "anon";

revoke insert on table "public"."Temporadas" from "anon";

revoke references on table "public"."Temporadas" from "anon";

revoke select on table "public"."Temporadas" from "anon";

revoke trigger on table "public"."Temporadas" from "anon";

revoke truncate on table "public"."Temporadas" from "anon";

revoke update on table "public"."Temporadas" from "anon";

revoke delete on table "public"."Temporadas" from "authenticated";

revoke insert on table "public"."Temporadas" from "authenticated";

revoke references on table "public"."Temporadas" from "authenticated";

revoke select on table "public"."Temporadas" from "authenticated";

revoke trigger on table "public"."Temporadas" from "authenticated";

revoke truncate on table "public"."Temporadas" from "authenticated";

revoke update on table "public"."Temporadas" from "authenticated";

revoke delete on table "public"."Temporadas" from "service_role";

revoke insert on table "public"."Temporadas" from "service_role";

revoke references on table "public"."Temporadas" from "service_role";

revoke select on table "public"."Temporadas" from "service_role";

revoke trigger on table "public"."Temporadas" from "service_role";

revoke truncate on table "public"."Temporadas" from "service_role";

revoke update on table "public"."Temporadas" from "service_role";

revoke delete on table "public"."Torneos" from "anon";

revoke insert on table "public"."Torneos" from "anon";

revoke references on table "public"."Torneos" from "anon";

revoke select on table "public"."Torneos" from "anon";

revoke trigger on table "public"."Torneos" from "anon";

revoke truncate on table "public"."Torneos" from "anon";

revoke update on table "public"."Torneos" from "anon";

revoke delete on table "public"."Torneos" from "authenticated";

revoke insert on table "public"."Torneos" from "authenticated";

revoke references on table "public"."Torneos" from "authenticated";

revoke select on table "public"."Torneos" from "authenticated";

revoke trigger on table "public"."Torneos" from "authenticated";

revoke truncate on table "public"."Torneos" from "authenticated";

revoke update on table "public"."Torneos" from "authenticated";

revoke delete on table "public"."Torneos" from "service_role";

revoke insert on table "public"."Torneos" from "service_role";

revoke references on table "public"."Torneos" from "service_role";

revoke select on table "public"."Torneos" from "service_role";

revoke trigger on table "public"."Torneos" from "service_role";

revoke truncate on table "public"."Torneos" from "service_role";

revoke update on table "public"."Torneos" from "service_role";

alter table "public"."Bonus" drop constraint "Bonus_mes_id_fkey";

alter table "public"."Bonus" drop constraint "Bonus_player_id_fkey";

alter table "public"."Inscripciones" drop constraint "inscripciones_torneo_id_fkey";

alter table "public"."Inscripciones" drop constraint "inscripciones_torneo_user_unique";

alter table "public"."Inscripciones" drop constraint "inscripciones_user_id_fkey";

alter table "public"."Jornadas" drop constraint "Jornadas_mes_id_fkey";

alter table "public"."Jornadas" drop constraint "jornadas_mes_number_unique";

alter table "public"."Jugador_Categoria_Mes" drop constraint "Jugador_Categoria_Mes_categoria_id_fkey";

alter table "public"."Jugador_Categoria_Mes" drop constraint "Jugador_Categoria_Mes_jugador_id_fkey";

alter table "public"."Jugador_Categoria_Mes" drop constraint "Jugador_Categoria_Mes_mes_id_fkey";

alter table "public"."Jugador_Categoria_Mes" drop constraint "jugador_categoria_mes_unique";

alter table "public"."Jugador_Categoria_Mes" drop constraint "unique_category_per_month";

alter table "public"."Meses" drop constraint "Meses_status_check";

alter table "public"."Meses" drop constraint "Meses_temporada_id_fkey";

alter table "public"."Meses" drop constraint "meses_month_year_temporada_unique";

alter table "public"."Meses" drop constraint "unique_month";

alter table "public"."Participacion" drop constraint "participacion_jugador_id_fkey";

alter table "public"."Participacion" drop constraint "participacion_partido_id_fkey";

alter table "public"."Participacion" drop constraint "participacion_sustituto_id_fkey";

alter table "public"."Partidos" drop constraint "Partidos_categoria_id_fkey";

alter table "public"."Partidos" drop constraint "Partidos_jornada_id_fkey";

alter table "public"."Sets" drop constraint "Sets_pareja1_jugador1_id_fkey";

alter table "public"."Sets" drop constraint "Sets_pareja1_jugador2_id_fkey";

alter table "public"."Sets" drop constraint "Sets_pareja2_jugador1_id_fkey";

alter table "public"."Sets" drop constraint "Sets_pareja2_jugador2_id_fkey";

alter table "public"."Sets" drop constraint "Sets_partido_id_fkey";

alter table "public"."Bonus" drop constraint "Bonus_pkey";

alter table "public"."Categorias" drop constraint "Categorias_pkey";

alter table "public"."Inscripciones" drop constraint "inscripciones_pkey";

alter table "public"."Jornadas" drop constraint "Jornadas_pkey";

alter table "public"."Jugador_Categoria_Mes" drop constraint "Jugador_Categoria_Mes_pkey";

alter table "public"."Meses" drop constraint "Meses_pkey";

alter table "public"."Participacion" drop constraint "participacion_pkey";

alter table "public"."Partidos" drop constraint "Partidos_pkey";

alter table "public"."Sets" drop constraint "Sets_pkey";

alter table "public"."Socios" drop constraint "Socios_pkey";

alter table "public"."Temporadas" drop constraint "Temporadas_pkey";

alter table "public"."Torneos" drop constraint "Torneos_pkey";

drop index if exists "public"."Bonus_pkey";

drop index if exists "public"."Categorias_pkey";

drop index if exists "public"."Jornadas_pkey";

drop index if exists "public"."Jugador_Categoria_Mes_pkey";

drop index if exists "public"."Meses_pkey";

drop index if exists "public"."Partidos_pkey";

drop index if exists "public"."Sets_pkey";

drop index if exists "public"."Socios_pkey";

drop index if exists "public"."Temporadas_pkey";

drop index if exists "public"."Torneos_pkey";

drop index if exists "public"."inscripciones_pkey";

drop index if exists "public"."inscripciones_torneo_user_unique";

drop index if exists "public"."jornadas_mes_number_unique";

drop index if exists "public"."jugador_categoria_mes_unique";

drop index if exists "public"."meses_month_year_temporada_unique";

drop index if exists "public"."participacion_pkey";

drop index if exists "public"."unique_category_per_month";

drop index if exists "public"."unique_month";

drop table "public"."Bonus";

drop table "public"."Categorias";

drop table "public"."Inscripciones";

drop table "public"."Jornadas";

drop table "public"."Jugador_Categoria_Mes";

drop table "public"."Meses";

drop table "public"."Participacion";

drop table "public"."Partidos";

drop table "public"."Sets";

drop table "public"."Socios";

drop table "public"."Temporadas";

drop table "public"."Torneos";


  create table "public"."bonuses" (
    "id" bigint generated by default as identity not null,
    "player_id" bigint not null,
    "quantity" numeric not null default '0'::numeric,
    "month_id" bigint
      );


alter table "public"."bonuses" enable row level security;


  create table "public"."categories" (
    "id" bigint generated by default as identity not null,
    "name" text not null,
    "order" numeric not null,
    "points_per_set" numeric not null default '3'::numeric
      );


alter table "public"."categories" enable row level security;


  create table "public"."inscriptions" (
    "id" bigint generated by default as identity not null,
    "tournament_id" bigint not null,
    "user_id" uuid not null,
    "phone_number" text not null,
    "category" text,
    "player1_full_name" text not null,
    "player2_full_name" text not null
      );


alter table "public"."inscriptions" enable row level security;


  create table "public"."match_participants" (
    "id" bigint generated by default as identity not null,
    "match_id" bigint not null,
    "player_id" bigint not null,
    "substitute_id" bigint
      );


alter table "public"."match_participants" enable row level security;


  create table "public"."matchdays" (
    "id" bigint generated by default as identity not null,
    "month_id" bigint not null,
    "order" numeric not null
      );


alter table "public"."matchdays" enable row level security;


  create table "public"."matches" (
    "id" bigint generated by default as identity not null,
    "matchday_id" bigint not null,
    "category_id" bigint not null
      );


alter table "public"."matches" enable row level security;


  create table "public"."members" (
    "id" bigint generated by default as identity not null,
    "full_name" text not null,
    "nickname" text,
    "is_active" boolean not null default true
      );


alter table "public"."members" enable row level security;


  create table "public"."months" (
    "id" bigint generated by default as identity not null,
    "season_id" bigint not null,
    "month" numeric not null,
    "status" public.month_status not null default 'draft'::public.month_status,
    "year" numeric not null,
    "has_fifth_category" boolean not null default true
      );


alter table "public"."months" enable row level security;


  create table "public"."player_category_assignments" (
    "id" bigint generated by default as identity not null,
    "player_id" bigint not null,
    "month_id" bigint not null,
    "category_id" bigint not null
      );


alter table "public"."player_category_assignments" enable row level security;


  create table "public"."seasons" (
    "id" bigint generated by default as identity not null,
    "name" character varying not null,
    "start_date" date
      );


alter table "public"."seasons" enable row level security;


  create table "public"."sets" (
    "id" bigint generated by default as identity not null,
    "match_id" bigint not null,
    "order" numeric not null,
    "pair1_player1_id" bigint not null,
    "pair1_player2_id" bigint not null,
    "pair2_player1_id" bigint not null,
    "pair2_player2_id" bigint not null,
    "pair1_score" numeric not null,
    "pair2_score" numeric not null
      );


alter table "public"."sets" enable row level security;


  create table "public"."tournaments" (
    "id" bigint generated by default as identity not null,
    "name" text not null,
    "description" text,
    "start_date" date not null,
    "img_path" text,
    "categories" text[],
    "end_date" date not null,
    "inscription_end_date" timestamp with time zone not null,
    "manually_closed" boolean not null
      );


alter table "public"."tournaments" enable row level security;

CREATE UNIQUE INDEX "Bonus_pkey" ON public.bonuses USING btree (id);

CREATE UNIQUE INDEX "Categorias_pkey" ON public.categories USING btree (id);

CREATE UNIQUE INDEX "Jornadas_pkey" ON public.matchdays USING btree (id);

CREATE UNIQUE INDEX "Jugador_Categoria_Mes_pkey" ON public.player_category_assignments USING btree (id);

CREATE UNIQUE INDEX "Meses_pkey" ON public.months USING btree (id);

CREATE UNIQUE INDEX "Partidos_pkey" ON public.matches USING btree (id);

CREATE UNIQUE INDEX "Sets_pkey" ON public.sets USING btree (id);

CREATE UNIQUE INDEX "Socios_pkey" ON public.members USING btree (id);

CREATE UNIQUE INDEX "Temporadas_pkey" ON public.seasons USING btree (id);

CREATE UNIQUE INDEX "Torneos_pkey" ON public.tournaments USING btree (id);

CREATE UNIQUE INDEX inscripciones_pkey ON public.inscriptions USING btree (id);

CREATE UNIQUE INDEX inscripciones_torneo_user_unique ON public.inscriptions USING btree (tournament_id, user_id);

CREATE UNIQUE INDEX jornadas_mes_number_unique ON public.matchdays USING btree (month_id, "order");

CREATE UNIQUE INDEX jugador_categoria_mes_unique ON public.player_category_assignments USING btree (month_id, player_id);

CREATE UNIQUE INDEX meses_month_year_temporada_unique ON public.months USING btree (month, year, season_id);

CREATE UNIQUE INDEX participacion_pkey ON public.match_participants USING btree (id);

CREATE UNIQUE INDEX unique_category_per_month ON public.player_category_assignments USING btree (month_id, player_id);

CREATE UNIQUE INDEX unique_month ON public.months USING btree (season_id, month);

alter table "public"."bonuses" add constraint "Bonus_pkey" PRIMARY KEY using index "Bonus_pkey";

alter table "public"."categories" add constraint "Categorias_pkey" PRIMARY KEY using index "Categorias_pkey";

alter table "public"."inscriptions" add constraint "inscripciones_pkey" PRIMARY KEY using index "inscripciones_pkey";

alter table "public"."match_participants" add constraint "participacion_pkey" PRIMARY KEY using index "participacion_pkey";

alter table "public"."matchdays" add constraint "Jornadas_pkey" PRIMARY KEY using index "Jornadas_pkey";

alter table "public"."matches" add constraint "Partidos_pkey" PRIMARY KEY using index "Partidos_pkey";

alter table "public"."members" add constraint "Socios_pkey" PRIMARY KEY using index "Socios_pkey";

alter table "public"."months" add constraint "Meses_pkey" PRIMARY KEY using index "Meses_pkey";

alter table "public"."player_category_assignments" add constraint "Jugador_Categoria_Mes_pkey" PRIMARY KEY using index "Jugador_Categoria_Mes_pkey";

alter table "public"."seasons" add constraint "Temporadas_pkey" PRIMARY KEY using index "Temporadas_pkey";

alter table "public"."sets" add constraint "Sets_pkey" PRIMARY KEY using index "Sets_pkey";

alter table "public"."tournaments" add constraint "Torneos_pkey" PRIMARY KEY using index "Torneos_pkey";

alter table "public"."bonuses" add constraint "bonuses_month_id_fkey" FOREIGN KEY (month_id) REFERENCES public.months(id) not valid;

alter table "public"."bonuses" validate constraint "bonuses_month_id_fkey";

alter table "public"."bonuses" add constraint "bonuses_player_id_fkey" FOREIGN KEY (player_id) REFERENCES public.members(id) not valid;

alter table "public"."bonuses" validate constraint "bonuses_player_id_fkey";

alter table "public"."inscriptions" add constraint "inscripciones_torneo_user_unique" UNIQUE using index "inscripciones_torneo_user_unique";

alter table "public"."inscriptions" add constraint "inscriptions_tournament_id_fkey" FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) not valid;

alter table "public"."inscriptions" validate constraint "inscriptions_tournament_id_fkey";

alter table "public"."inscriptions" add constraint "inscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."inscriptions" validate constraint "inscriptions_user_id_fkey";

alter table "public"."match_participants" add constraint "match_participants_match_id_fkey" FOREIGN KEY (match_id) REFERENCES public.matches(id) not valid;

alter table "public"."match_participants" validate constraint "match_participants_match_id_fkey";

alter table "public"."match_participants" add constraint "match_participants_player_id_fkey" FOREIGN KEY (player_id) REFERENCES public.members(id) not valid;

alter table "public"."match_participants" validate constraint "match_participants_player_id_fkey";

alter table "public"."match_participants" add constraint "match_participants_substitute_id_fkey" FOREIGN KEY (substitute_id) REFERENCES public.members(id) not valid;

alter table "public"."match_participants" validate constraint "match_participants_substitute_id_fkey";

alter table "public"."matchdays" add constraint "jornadas_mes_number_unique" UNIQUE using index "jornadas_mes_number_unique";

alter table "public"."matches" add constraint "matches_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) not valid;

alter table "public"."matches" validate constraint "matches_category_id_fkey";

alter table "public"."matches" add constraint "matches_matchday_id_fkey" FOREIGN KEY (matchday_id) REFERENCES public.matchdays(id) not valid;

alter table "public"."matches" validate constraint "matches_matchday_id_fkey";

alter table "public"."months" add constraint "meses_month_year_temporada_unique" UNIQUE using index "meses_month_year_temporada_unique";

alter table "public"."months" add constraint "months_season_id_fkey" FOREIGN KEY (season_id) REFERENCES public.seasons(id) not valid;

alter table "public"."months" validate constraint "months_season_id_fkey";

alter table "public"."months" add constraint "unique_month" UNIQUE using index "unique_month";

alter table "public"."player_category_assignments" add constraint "jugador_categoria_mes_unique" UNIQUE using index "jugador_categoria_mes_unique";

alter table "public"."player_category_assignments" add constraint "player_category_assignments_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) not valid;

alter table "public"."player_category_assignments" validate constraint "player_category_assignments_category_id_fkey";

alter table "public"."player_category_assignments" add constraint "player_category_assignments_month_id_fkey" FOREIGN KEY (month_id) REFERENCES public.months(id) not valid;

alter table "public"."player_category_assignments" validate constraint "player_category_assignments_month_id_fkey";

alter table "public"."player_category_assignments" add constraint "player_category_assignments_player_id_fkey" FOREIGN KEY (player_id) REFERENCES public.members(id) not valid;

alter table "public"."player_category_assignments" validate constraint "player_category_assignments_player_id_fkey";

alter table "public"."player_category_assignments" add constraint "unique_category_per_month" UNIQUE using index "unique_category_per_month";

alter table "public"."sets" add constraint "sets_match_id_fkey" FOREIGN KEY (match_id) REFERENCES public.matches(id) not valid;

alter table "public"."sets" validate constraint "sets_match_id_fkey";

alter table "public"."sets" add constraint "sets_pair1_player1_id_fkey" FOREIGN KEY (pair1_player1_id) REFERENCES public.members(id) not valid;

alter table "public"."sets" validate constraint "sets_pair1_player1_id_fkey";

alter table "public"."sets" add constraint "sets_pair1_player2_id_fkey" FOREIGN KEY (pair1_player2_id) REFERENCES public.members(id) not valid;

alter table "public"."sets" validate constraint "sets_pair1_player2_id_fkey";

alter table "public"."sets" add constraint "sets_pair2_player1_id_fkey" FOREIGN KEY (pair2_player1_id) REFERENCES public.members(id) not valid;

alter table "public"."sets" validate constraint "sets_pair2_player1_id_fkey";

alter table "public"."sets" add constraint "sets_pair2_player2_id_fkey" FOREIGN KEY (pair2_player2_id) REFERENCES public.members(id) not valid;

alter table "public"."sets" validate constraint "sets_pair2_player2_id_fkey";

grant delete on table "public"."bonuses" to "anon";

grant insert on table "public"."bonuses" to "anon";

grant references on table "public"."bonuses" to "anon";

grant select on table "public"."bonuses" to "anon";

grant trigger on table "public"."bonuses" to "anon";

grant truncate on table "public"."bonuses" to "anon";

grant update on table "public"."bonuses" to "anon";

grant delete on table "public"."bonuses" to "authenticated";

grant insert on table "public"."bonuses" to "authenticated";

grant references on table "public"."bonuses" to "authenticated";

grant select on table "public"."bonuses" to "authenticated";

grant trigger on table "public"."bonuses" to "authenticated";

grant truncate on table "public"."bonuses" to "authenticated";

grant update on table "public"."bonuses" to "authenticated";

grant delete on table "public"."bonuses" to "service_role";

grant insert on table "public"."bonuses" to "service_role";

grant references on table "public"."bonuses" to "service_role";

grant select on table "public"."bonuses" to "service_role";

grant trigger on table "public"."bonuses" to "service_role";

grant truncate on table "public"."bonuses" to "service_role";

grant update on table "public"."bonuses" to "service_role";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."inscriptions" to "anon";

grant insert on table "public"."inscriptions" to "anon";

grant references on table "public"."inscriptions" to "anon";

grant select on table "public"."inscriptions" to "anon";

grant trigger on table "public"."inscriptions" to "anon";

grant truncate on table "public"."inscriptions" to "anon";

grant update on table "public"."inscriptions" to "anon";

grant delete on table "public"."inscriptions" to "authenticated";

grant insert on table "public"."inscriptions" to "authenticated";

grant references on table "public"."inscriptions" to "authenticated";

grant select on table "public"."inscriptions" to "authenticated";

grant trigger on table "public"."inscriptions" to "authenticated";

grant truncate on table "public"."inscriptions" to "authenticated";

grant update on table "public"."inscriptions" to "authenticated";

grant delete on table "public"."inscriptions" to "service_role";

grant insert on table "public"."inscriptions" to "service_role";

grant references on table "public"."inscriptions" to "service_role";

grant select on table "public"."inscriptions" to "service_role";

grant trigger on table "public"."inscriptions" to "service_role";

grant truncate on table "public"."inscriptions" to "service_role";

grant update on table "public"."inscriptions" to "service_role";

grant delete on table "public"."match_participants" to "anon";

grant insert on table "public"."match_participants" to "anon";

grant references on table "public"."match_participants" to "anon";

grant select on table "public"."match_participants" to "anon";

grant trigger on table "public"."match_participants" to "anon";

grant truncate on table "public"."match_participants" to "anon";

grant update on table "public"."match_participants" to "anon";

grant delete on table "public"."match_participants" to "authenticated";

grant insert on table "public"."match_participants" to "authenticated";

grant references on table "public"."match_participants" to "authenticated";

grant select on table "public"."match_participants" to "authenticated";

grant trigger on table "public"."match_participants" to "authenticated";

grant truncate on table "public"."match_participants" to "authenticated";

grant update on table "public"."match_participants" to "authenticated";

grant delete on table "public"."match_participants" to "service_role";

grant insert on table "public"."match_participants" to "service_role";

grant references on table "public"."match_participants" to "service_role";

grant select on table "public"."match_participants" to "service_role";

grant trigger on table "public"."match_participants" to "service_role";

grant truncate on table "public"."match_participants" to "service_role";

grant update on table "public"."match_participants" to "service_role";

grant delete on table "public"."matchdays" to "anon";

grant insert on table "public"."matchdays" to "anon";

grant references on table "public"."matchdays" to "anon";

grant select on table "public"."matchdays" to "anon";

grant trigger on table "public"."matchdays" to "anon";

grant truncate on table "public"."matchdays" to "anon";

grant update on table "public"."matchdays" to "anon";

grant delete on table "public"."matchdays" to "authenticated";

grant insert on table "public"."matchdays" to "authenticated";

grant references on table "public"."matchdays" to "authenticated";

grant select on table "public"."matchdays" to "authenticated";

grant trigger on table "public"."matchdays" to "authenticated";

grant truncate on table "public"."matchdays" to "authenticated";

grant update on table "public"."matchdays" to "authenticated";

grant delete on table "public"."matchdays" to "service_role";

grant insert on table "public"."matchdays" to "service_role";

grant references on table "public"."matchdays" to "service_role";

grant select on table "public"."matchdays" to "service_role";

grant trigger on table "public"."matchdays" to "service_role";

grant truncate on table "public"."matchdays" to "service_role";

grant update on table "public"."matchdays" to "service_role";

grant delete on table "public"."matches" to "anon";

grant insert on table "public"."matches" to "anon";

grant references on table "public"."matches" to "anon";

grant select on table "public"."matches" to "anon";

grant trigger on table "public"."matches" to "anon";

grant truncate on table "public"."matches" to "anon";

grant update on table "public"."matches" to "anon";

grant delete on table "public"."matches" to "authenticated";

grant insert on table "public"."matches" to "authenticated";

grant references on table "public"."matches" to "authenticated";

grant select on table "public"."matches" to "authenticated";

grant trigger on table "public"."matches" to "authenticated";

grant truncate on table "public"."matches" to "authenticated";

grant update on table "public"."matches" to "authenticated";

grant delete on table "public"."matches" to "service_role";

grant insert on table "public"."matches" to "service_role";

grant references on table "public"."matches" to "service_role";

grant select on table "public"."matches" to "service_role";

grant trigger on table "public"."matches" to "service_role";

grant truncate on table "public"."matches" to "service_role";

grant update on table "public"."matches" to "service_role";

grant delete on table "public"."members" to "anon";

grant insert on table "public"."members" to "anon";

grant references on table "public"."members" to "anon";

grant select on table "public"."members" to "anon";

grant trigger on table "public"."members" to "anon";

grant truncate on table "public"."members" to "anon";

grant update on table "public"."members" to "anon";

grant delete on table "public"."members" to "authenticated";

grant insert on table "public"."members" to "authenticated";

grant references on table "public"."members" to "authenticated";

grant select on table "public"."members" to "authenticated";

grant trigger on table "public"."members" to "authenticated";

grant truncate on table "public"."members" to "authenticated";

grant update on table "public"."members" to "authenticated";

grant delete on table "public"."members" to "service_role";

grant insert on table "public"."members" to "service_role";

grant references on table "public"."members" to "service_role";

grant select on table "public"."members" to "service_role";

grant trigger on table "public"."members" to "service_role";

grant truncate on table "public"."members" to "service_role";

grant update on table "public"."members" to "service_role";

grant delete on table "public"."months" to "anon";

grant insert on table "public"."months" to "anon";

grant references on table "public"."months" to "anon";

grant select on table "public"."months" to "anon";

grant trigger on table "public"."months" to "anon";

grant truncate on table "public"."months" to "anon";

grant update on table "public"."months" to "anon";

grant delete on table "public"."months" to "authenticated";

grant insert on table "public"."months" to "authenticated";

grant references on table "public"."months" to "authenticated";

grant select on table "public"."months" to "authenticated";

grant trigger on table "public"."months" to "authenticated";

grant truncate on table "public"."months" to "authenticated";

grant update on table "public"."months" to "authenticated";

grant delete on table "public"."months" to "service_role";

grant insert on table "public"."months" to "service_role";

grant references on table "public"."months" to "service_role";

grant select on table "public"."months" to "service_role";

grant trigger on table "public"."months" to "service_role";

grant truncate on table "public"."months" to "service_role";

grant update on table "public"."months" to "service_role";

grant delete on table "public"."player_category_assignments" to "anon";

grant insert on table "public"."player_category_assignments" to "anon";

grant references on table "public"."player_category_assignments" to "anon";

grant select on table "public"."player_category_assignments" to "anon";

grant trigger on table "public"."player_category_assignments" to "anon";

grant truncate on table "public"."player_category_assignments" to "anon";

grant update on table "public"."player_category_assignments" to "anon";

grant delete on table "public"."player_category_assignments" to "authenticated";

grant insert on table "public"."player_category_assignments" to "authenticated";

grant references on table "public"."player_category_assignments" to "authenticated";

grant select on table "public"."player_category_assignments" to "authenticated";

grant trigger on table "public"."player_category_assignments" to "authenticated";

grant truncate on table "public"."player_category_assignments" to "authenticated";

grant update on table "public"."player_category_assignments" to "authenticated";

grant delete on table "public"."player_category_assignments" to "service_role";

grant insert on table "public"."player_category_assignments" to "service_role";

grant references on table "public"."player_category_assignments" to "service_role";

grant select on table "public"."player_category_assignments" to "service_role";

grant trigger on table "public"."player_category_assignments" to "service_role";

grant truncate on table "public"."player_category_assignments" to "service_role";

grant update on table "public"."player_category_assignments" to "service_role";

grant delete on table "public"."seasons" to "anon";

grant insert on table "public"."seasons" to "anon";

grant references on table "public"."seasons" to "anon";

grant select on table "public"."seasons" to "anon";

grant trigger on table "public"."seasons" to "anon";

grant truncate on table "public"."seasons" to "anon";

grant update on table "public"."seasons" to "anon";

grant delete on table "public"."seasons" to "authenticated";

grant insert on table "public"."seasons" to "authenticated";

grant references on table "public"."seasons" to "authenticated";

grant select on table "public"."seasons" to "authenticated";

grant trigger on table "public"."seasons" to "authenticated";

grant truncate on table "public"."seasons" to "authenticated";

grant update on table "public"."seasons" to "authenticated";

grant delete on table "public"."seasons" to "service_role";

grant insert on table "public"."seasons" to "service_role";

grant references on table "public"."seasons" to "service_role";

grant select on table "public"."seasons" to "service_role";

grant trigger on table "public"."seasons" to "service_role";

grant truncate on table "public"."seasons" to "service_role";

grant update on table "public"."seasons" to "service_role";

grant delete on table "public"."sets" to "anon";

grant insert on table "public"."sets" to "anon";

grant references on table "public"."sets" to "anon";

grant select on table "public"."sets" to "anon";

grant trigger on table "public"."sets" to "anon";

grant truncate on table "public"."sets" to "anon";

grant update on table "public"."sets" to "anon";

grant delete on table "public"."sets" to "authenticated";

grant insert on table "public"."sets" to "authenticated";

grant references on table "public"."sets" to "authenticated";

grant select on table "public"."sets" to "authenticated";

grant trigger on table "public"."sets" to "authenticated";

grant truncate on table "public"."sets" to "authenticated";

grant update on table "public"."sets" to "authenticated";

grant delete on table "public"."sets" to "service_role";

grant insert on table "public"."sets" to "service_role";

grant references on table "public"."sets" to "service_role";

grant select on table "public"."sets" to "service_role";

grant trigger on table "public"."sets" to "service_role";

grant truncate on table "public"."sets" to "service_role";

grant update on table "public"."sets" to "service_role";

grant delete on table "public"."tournaments" to "anon";

grant insert on table "public"."tournaments" to "anon";

grant references on table "public"."tournaments" to "anon";

grant select on table "public"."tournaments" to "anon";

grant trigger on table "public"."tournaments" to "anon";

grant truncate on table "public"."tournaments" to "anon";

grant update on table "public"."tournaments" to "anon";

grant delete on table "public"."tournaments" to "authenticated";

grant insert on table "public"."tournaments" to "authenticated";

grant references on table "public"."tournaments" to "authenticated";

grant select on table "public"."tournaments" to "authenticated";

grant trigger on table "public"."tournaments" to "authenticated";

grant truncate on table "public"."tournaments" to "authenticated";

grant update on table "public"."tournaments" to "authenticated";

grant delete on table "public"."tournaments" to "service_role";

grant insert on table "public"."tournaments" to "service_role";

grant references on table "public"."tournaments" to "service_role";

grant select on table "public"."tournaments" to "service_role";

grant trigger on table "public"."tournaments" to "service_role";

grant truncate on table "public"."tournaments" to "service_role";

grant update on table "public"."tournaments" to "service_role";


  create policy "Admin can do anything"
  on "public"."bonuses"
  as permissive
  for all
  to public
using (((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true));



  create policy "Enable read access for all users"
  on "public"."bonuses"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
  on "public"."categories"
  as permissive
  for select
  to public
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."inscriptions"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Only if not manually closed"
  on "public"."inscriptions"
  as restrictive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.tournaments t
  WHERE ((t.id = inscriptions.tournament_id) AND (t.manually_closed = false)))));



  create policy "Only within date"
  on "public"."inscriptions"
  as restrictive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.tournaments t
  WHERE ((t.id = inscriptions.tournament_id) AND (now() < t.inscription_end_date)))));



  create policy "Enable read access for all users"
  on "public"."match_participants"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
  on "public"."matchdays"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
  on "public"."matches"
  as permissive
  for select
  to public
using (true);



  create policy "Everyone can SELECT"
  on "public"."members"
  as permissive
  for select
  to public
using (true);



  create policy "Admin can do anything"
  on "public"."months"
  as permissive
  for all
  to public
using (((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true));



  create policy "Enable read access for all users"
  on "public"."months"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
  on "public"."player_category_assignments"
  as permissive
  for select
  to public
using (true);



  create policy "Anyone can read"
  on "public"."seasons"
  as permissive
  for select
  to public
using (true);



  create policy "Only admin can write"
  on "public"."seasons"
  as permissive
  for all
  to public
using ((auth.role() = 'admin'::text));



  create policy "Enable read access for all users"
  on "public"."sets"
  as permissive
  for select
  to public
using (true);



  create policy "Admin can do ANYTHING"
  on "public"."tournaments"
  as permissive
  for all
  to public
using (((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true));



  create policy "Everyone can read"
  on "public"."tournaments"
  as permissive
  for select
  to public
using (true);



