CREATE OR REPLACE FUNCTION public.get_global_classification()
RETURNS TABLE (
    player_id integer,
    nickname text,
    points integer,
    diff integer,
    games_for integer
)
LANGUAGE sql
STABLE
AS $$
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
  JOIN public."Partidos" m ON m.id = s.partido_id
  JOIN public."Categorias" c ON c.id = m.categoria_id

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
    categoria_id,
    puntos_set,
    real_p1_j1 AS player_id,
    pareja1_juegos AS gf,
    pareja2_juegos AS ga,
    (pareja1_juegos > pareja2_juegos) AS win
  FROM sets_base

  UNION ALL

  SELECT
    categoria_id,
    puntos_set,
    real_p1_j2,
    pareja1_juegos,
    pareja2_juegos,
    (pareja1_juegos > pareja2_juegos)
  FROM sets_base

  UNION ALL

  SELECT
    categoria_id,
    puntos_set,
    real_p2_j1,
    pareja2_juegos,
    pareja1_juegos,
    (pareja2_juegos > pareja1_juegos)
  FROM sets_base

  UNION ALL

  SELECT
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
    SUM(CASE WHEN win THEN puntos_set ELSE 0 END) + 5 AS points,
    SUM(gf - ga) AS diff,
    SUM(gf) AS games_for
  FROM expanded_sets
  WHERE player_id IS NOT NULL
  GROUP BY player_id
)

SELECT
  c.player_id,
  j.nickname,
  c.points,
  c.diff,
  c.games_for
FROM classification c
JOIN public."Socios" j
  ON j.id = c.player_id
ORDER BY
  c.points DESC,
  c.diff DESC,
  c.games_for DESC;
$$;