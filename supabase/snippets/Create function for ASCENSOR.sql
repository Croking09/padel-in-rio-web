CREATE OR REPLACE FUNCTION public.get_month_classification(
  p_mes_id integer,
  p_categoria_id integer
)
RETURNS TABLE (
  player_id integer,
  full_name text,
  nickname text,
  points integer,
  diff integer,
  games_for integer,
  matches_played integer
)
LANGUAGE sql
STABLE
AS $$
WITH sets_base AS (
  SELECT
    s.*,
    j.mes_id,
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

  JOIN public."Jornadas" j
    ON j.id = m.jornada_id

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
),

expanded_sets AS (
  SELECT
    partido_id,
    mes_id,
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
    mes_id,
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
    mes_id,
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
    mes_id,
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

    SUM(CASE WHEN win THEN puntos_set ELSE 0 END)
      + COUNT(DISTINCT partido_id) * 5 AS points,

    SUM(gf - ga) AS diff,
    SUM(gf) AS games_for,

    COUNT(DISTINCT partido_id) AS matches_played

  FROM expanded_sets
  WHERE mes_id = p_mes_id
    AND categoria_id = p_categoria_id
    AND player_id IS NOT NULL
  GROUP BY player_id
),

players_in_category AS (
  SELECT
    jcm.jugador_id AS player_id,
    s.nickname,
    s.full_name
  FROM public."Jugador_Categoria_Mes" jcm
  JOIN public."Socios" s
    ON s.id = jcm.jugador_id
  WHERE jcm.mes_id = p_mes_id
    AND jcm.categoria_id = p_categoria_id
)

SELECT
  p.player_id,
  p.full_name,
  p.nickname,
  COALESCE(c.points, 0) AS points,
  COALESCE(c.diff, 0) AS diff,
  COALESCE(c.games_for, 0) AS games_for,
  COALESCE(c.matches_played, 0) AS matches_played
FROM players_in_category p
LEFT JOIN classification c
  ON c.player_id = p.player_id
ORDER BY
  points DESC,
  diff DESC,
  games_for DESC;
$$;