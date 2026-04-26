drop function if exists "public"."get_global_classification"(p_temporada_id integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_global_classification(p_temporada_id integer)
 RETURNS TABLE(player_id integer, full_name text, nickname text, points integer, diff integer, games_for integer, matches_played integer)
 LANGUAGE sql
 STABLE
AS $function$
WITH sets_base AS (
  SELECT
    s.*,
    m.categoria_id,
    c.puntos_set,

    CASE
      WHEN p1.sustituto_id IS NOT NULL THEN NULL
      ELSE s.pareja1_jugador1_id
    END AS real_p1_j1,

    CASE
      WHEN p2.sustituto_id IS NOT NULL THEN NULL
      ELSE s.pareja1_jugador2_id
    END AS real_p1_j2,

    CASE
      WHEN p3.sustituto_id IS NOT NULL THEN NULL
      ELSE s.pareja2_jugador1_id
    END AS real_p2_j1,

    CASE
      WHEN p4.sustituto_id IS NOT NULL THEN NULL
      ELSE s.pareja2_jugador2_id
    END AS real_p2_j2

  FROM public."Sets" s
  JOIN public."Partidos" m
    ON m.id = s.partido_id

  JOIN public."Jornadas" jor
    ON jor.id = m.jornada_id

  JOIN public."Meses" mes
    ON mes.id = jor.mes_id

  JOIN public."Categorias" c
    ON c.id = m.categoria_id

  LEFT JOIN public."Participacion" p1
    ON p1.partido_id = s.partido_id
    AND p1.jugador_id = s.pareja1_jugador1_id

  LEFT JOIN public."Participacion" p2
    ON p2.partido_id = s.partido_id
    AND p2.jugador_id = s.pareja1_jugador2_id

  LEFT JOIN public."Participacion" p3
    ON p3.partido_id = s.partido_id
    AND p3.jugador_id = s.pareja2_jugador1_id

  LEFT JOIN public."Participacion" p4
    ON p4.partido_id = s.partido_id
    AND p4.jugador_id = s.pareja2_jugador2_id

  WHERE mes.temporada_id = p_temporada_id
),

expanded_sets AS (
  SELECT
    partido_id,
    categoria_id,
    puntos_set,
    real_p1_j1 AS player_id,
    pareja1_juegos AS gf,
    pareja2_juegos AS ga,
    (pareja1_juegos > pareja2_juegos) AS win
  FROM sets_base

  UNION ALL

  SELECT
    partido_id,
    categoria_id,
    puntos_set,
    real_p1_j2,
    pareja1_juegos,
    pareja2_juegos,
    (pareja1_juegos > pareja2_juegos)
  FROM sets_base

  UNION ALL

  SELECT
    partido_id,
    categoria_id,
    puntos_set,
    real_p2_j1,
    pareja2_juegos,
    pareja1_juegos,
    (pareja2_juegos > pareja1_juegos)
  FROM sets_base

  UNION ALL

  SELECT
    partido_id,
    categoria_id,
    puntos_set,
    real_p2_j2,
    pareja2_juegos,
    pareja1_juegos,
    (pareja2_juegos > pareja1_juegos)
  FROM sets_base
),

classification AS (
  SELECT
    player_id,

    SUM(
      CASE WHEN win THEN puntos_set ELSE 0 END
    ) + COUNT(DISTINCT partido_id) * 5 AS points,

    SUM(gf - ga) AS diff,
    SUM(gf) AS games_for,

    COUNT(DISTINCT partido_id) AS matches_played

  FROM expanded_sets
  WHERE player_id IS NOT NULL
  GROUP BY player_id
)

SELECT
  c.player_id,
  s.full_name,
  s.nickname,
  c.points,
  c.diff,
  c.games_for,
  c.matches_played
FROM classification c
JOIN public."Socios" s
  ON s.id = c.player_id
ORDER BY
  c.points DESC,
  c.diff DESC,
  c.games_for DESC;
$function$
;

CREATE OR REPLACE FUNCTION public.register_match_results(p_partido_id integer, p_sets jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM public."Sets"
  WHERE partido_id = p_partido_id;

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
END;
$function$
;

CREATE OR REPLACE FUNCTION public.register_match_results(p_partido_id integer, p_sets jsonb, p_participacion jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Borramos sets anteriores
  DELETE FROM public."Sets"
  WHERE partido_id = p_partido_id;

  -- Borramos participaciones anteriores
  DELETE FROM public."Participacion"
  WHERE partido_id = p_partido_id;

  -- Insertamos sets
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

  -- Insertamos participación
  INSERT INTO public."Participacion" (
    partido_id,
    jugador_id,
    sustituto_id
  )
  SELECT
    p_partido_id,
    (p->>'jugador_id')::int,
    (p->>'sustituto_id')::int
  FROM jsonb_array_elements(p_participacion) AS p;

END;
$function$
;

grant delete on table "public"."Participacion" to "postgres";

grant insert on table "public"."Participacion" to "postgres";

grant references on table "public"."Participacion" to "postgres";

grant select on table "public"."Participacion" to "postgres";

grant trigger on table "public"."Participacion" to "postgres";

grant truncate on table "public"."Participacion" to "postgres";

grant update on table "public"."Participacion" to "postgres";

grant delete on table "public"."Sets" to "postgres";

grant insert on table "public"."Sets" to "postgres";

grant references on table "public"."Sets" to "postgres";

grant select on table "public"."Sets" to "postgres";

grant trigger on table "public"."Sets" to "postgres";

grant truncate on table "public"."Sets" to "postgres";

grant update on table "public"."Sets" to "postgres";


