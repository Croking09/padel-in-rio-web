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
    c.puntos_set
  FROM public."Sets" s
  JOIN public."Partidos" m ON m.id = s.partido_id
  JOIN public."Categorias" c ON c.id = m.categoria_id
),

expanded_sets AS (
  SELECT categoria_id, puntos_set,
         pareja1_jugador1_id AS player_id,
         pareja1_juegos AS gf,
         pareja2_juegos AS ga,
         (pareja1_juegos > pareja2_juegos) AS win
  FROM sets_base

  UNION ALL

  SELECT categoria_id, puntos_set,
         pareja1_jugador2_id,
         pareja1_juegos,
         pareja2_juegos,
         (pareja1_juegos > pareja2_juegos)
  FROM sets_base

  UNION ALL

  SELECT categoria_id, puntos_set,
         pareja2_jugador1_id,
         pareja2_juegos,
         pareja1_juegos,
         (pareja2_juegos > pareja1_juegos)
  FROM sets_base

  UNION ALL

  SELECT categoria_id, puntos_set,
         pareja2_jugador2_id,
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
  GROUP BY player_id
)

SELECT
  c.player_id,
  j.nickname,
  c.points,
  c.diff,
  c.games_for
FROM classification c
JOIN public."Socios" j ON j.id = c.player_id
ORDER BY
  c.points DESC,
  c.diff DESC,
  c.games_for DESC;
$$;