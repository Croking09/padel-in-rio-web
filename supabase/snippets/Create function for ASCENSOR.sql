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
  games_for integer
)
LANGUAGE sql
STABLE
AS $$
WITH sets_base AS (
  SELECT
    s.*,
    j.mes_id,
    m.categoria_id,
    c.puntos_set
  FROM public."Sets" s
  JOIN public."Partidos" m ON m.id = s.partido_id
  JOIN public."Jornadas" j ON j.id = m.jornada_id
  JOIN public."Categorias" c ON c.id = m.categoria_id
),

expanded_sets AS (
  SELECT mes_id, categoria_id, puntos_set,
         pareja1_jugador1_id AS player_id,
         pareja1_juegos AS gf,
         pareja2_juegos AS ga,
         (pareja1_juegos > pareja2_juegos) AS win
  FROM sets_base

  UNION ALL

  SELECT mes_id, categoria_id, puntos_set,
         pareja1_jugador2_id,
         pareja1_juegos,
         pareja2_juegos,
         (pareja1_juegos > pareja2_juegos)
  FROM sets_base

  UNION ALL

  SELECT mes_id, categoria_id, puntos_set,
         pareja2_jugador1_id,
         pareja2_juegos,
         pareja1_juegos,
         (pareja2_juegos > pareja1_juegos)
  FROM sets_base

  UNION ALL

  SELECT mes_id, categoria_id, puntos_set,
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
  WHERE mes_id = p_mes_id
    AND categoria_id = p_categoria_id
  GROUP BY player_id
),

players_in_category AS (
  SELECT jcm.jugador_id AS player_id, s.nickname, s.full_name
  FROM public."Jugador_Categoria_Mes" jcm
  JOIN public."Socios" s ON s.id = jcm.jugador_id
  WHERE jcm.mes_id = p_mes_id
    AND jcm.categoria_id = p_categoria_id
)

SELECT
  p.player_id,
  p.full_name,
  p.nickname,
  COALESCE(c.points, 0) AS points,
  COALESCE(c.diff, 0) AS diff,
  COALESCE(c.games_for, 0) AS games_for
FROM players_in_category p
LEFT JOIN classification c ON c.player_id = p.player_id
ORDER BY
  points DESC,
  diff DESC,
  games_for DESC;
$$;