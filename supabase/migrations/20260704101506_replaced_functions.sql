revoke delete on table "public"."Jugador_Partido" from "anon";

revoke insert on table "public"."Jugador_Partido" from "anon";

revoke references on table "public"."Jugador_Partido" from "anon";

revoke select on table "public"."Jugador_Partido" from "anon";

revoke trigger on table "public"."Jugador_Partido" from "anon";

revoke truncate on table "public"."Jugador_Partido" from "anon";

revoke update on table "public"."Jugador_Partido" from "anon";

revoke delete on table "public"."Jugador_Partido" from "authenticated";

revoke insert on table "public"."Jugador_Partido" from "authenticated";

revoke references on table "public"."Jugador_Partido" from "authenticated";

revoke select on table "public"."Jugador_Partido" from "authenticated";

revoke trigger on table "public"."Jugador_Partido" from "authenticated";

revoke truncate on table "public"."Jugador_Partido" from "authenticated";

revoke update on table "public"."Jugador_Partido" from "authenticated";

revoke delete on table "public"."Jugador_Partido" from "service_role";

revoke insert on table "public"."Jugador_Partido" from "service_role";

revoke references on table "public"."Jugador_Partido" from "service_role";

revoke select on table "public"."Jugador_Partido" from "service_role";

revoke trigger on table "public"."Jugador_Partido" from "service_role";

revoke truncate on table "public"."Jugador_Partido" from "service_role";

revoke update on table "public"."Jugador_Partido" from "service_role";

alter table "public"."Jugador_Partido" drop constraint "Jugador_Partido_jugador_id_fkey";

alter table "public"."Jugador_Partido" drop constraint "Jugador_Partido_partido_id_fkey";

alter table "public"."Jugador_Partido" drop constraint "unique_player_each_match";

alter table "public"."Jugador_Partido" drop constraint "Jugador_Partido_pkey";

drop index if exists "public"."Jugador_Partido_pkey";

drop index if exists "public"."unique_player_each_match";

drop table "public"."Jugador_Partido";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generar_partidos_mes(p_mes_id bigint, p_partidos jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  m jsonb;

  jornada1_id bigint;
  jornada2_id bigint;

  partido_id bigint;
BEGIN

  /*
    Creamos / recuperamos las 2 jornadas del mes
    usando UPSERT + RETURNING (sin race conditions)
  */

  WITH jornadas_upsert AS (
    INSERT INTO "Jornadas" (mes_id, number)
    VALUES (p_mes_id, 1), (p_mes_id, 2)
    ON CONFLICT (mes_id, number)
    DO UPDATE SET mes_id = EXCLUDED.mes_id
    RETURNING id, number
  )
  SELECT
    MAX(id) FILTER (WHERE number = 1),
    MAX(id) FILTER (WHERE number = 2)
  INTO jornada1_id, jornada2_id
  FROM jornadas_upsert;

  IF jornada1_id IS NULL OR jornada2_id IS NULL THEN
    RAISE EXCEPTION 'No se pudieron crear las jornadas';
  END IF;

  /*
    Insertamos partidos
  */

  FOR m IN
    SELECT *
    FROM jsonb_array_elements(p_partidos)
  LOOP

    INSERT INTO "Partidos" (jornada_id, categoria_id)
    VALUES (
      CASE (m->>'matchday')::int
        WHEN 1 THEN jornada1_id
        ELSE jornada2_id
      END,
      (m->>'categoryId')::bigint
    )
    RETURNING id INTO partido_id;

    /*
      Insertamos participación de los jugadores
    */

    INSERT INTO "Participacion" (
      partido_id,
      jugador_id,
      sustituto_id
    )
    SELECT
      partido_id,
      jsonb_array_elements_text(m->'players')::bigint,
      NULL;

  END LOOP;

  UPDATE "Meses"
  SET status = 'confirmed'
  WHERE id = p_mes_id;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.register_match_results(p_partido_id integer, p_sets jsonb, p_participacion jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Borramos los sets anteriores
  DELETE FROM public."Sets"
  WHERE partido_id = p_partido_id;

  -- Insertamos los nuevos sets
  INSERT INTO public."Sets" (
    partido_id,
    orden,
    pareja1_jugador1_id,
    pareja1_jugador2_id,
    pareja2_jugador1_id,
    pareja2_jugador2_id,
    pareja1_juegos,
    pareja2_juegos
  )
  SELECT
    p_partido_id,
    (s->>'orden')::int,
    (s->>'pareja1_jugador1_id')::int,
    (s->>'pareja1_jugador2_id')::int,
    (s->>'pareja2_jugador1_id')::int,
    (s->>'pareja2_jugador2_id')::int,
    (s->>'pareja1_juegos')::int,
    (s->>'pareja2_juegos')::int
  FROM jsonb_array_elements(p_sets) AS s;

  -- Reiniciamos los sustitutos de todos los participantes del partido
  UPDATE public."Participacion"
  SET sustituto_id = NULL
  WHERE partido_id = p_partido_id;

  -- Actualizamos los sustitutos indicados
  UPDATE public."Participacion" AS part
  SET sustituto_id = data.sustituto_id
  FROM (
    SELECT
      (p->>'jugador_id')::int AS jugador_id,
      (p->>'sustituto_id')::int AS sustituto_id
    FROM jsonb_array_elements(p_participacion) AS p
  ) AS data
  WHERE part.partido_id = p_partido_id
    AND part.jugador_id = data.jugador_id;

END;
$function$
;


