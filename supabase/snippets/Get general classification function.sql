CREATE OR REPLACE FUNCTION public.get_general_classification(
    p_season_id integer
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
    m.category_id,
    c.points_per_set,
    mo.season_id,

    CASE
      WHEN p1.substitute_id IS NOT NULL THEN NULL
      ELSE s.pair1_player1_id
    END AS real_p1_j1,

    CASE
      WHEN p2.substitute_id IS NOT NULL THEN NULL
      ELSE s.pair1_player2_id
    END AS real_p1_j2,

    CASE
      WHEN p3.substitute_id IS NOT NULL THEN NULL
      ELSE s.pair2_player1_id
    END AS real_p2_j1,

    CASE
      WHEN p4.substitute_id IS NOT NULL THEN NULL
      ELSE s.pair2_player2_id
    END AS real_p2_j2

  FROM public.sets s
  JOIN public.matches m
    ON m.id = s.match_id
  JOIN public.matchdays j
    ON j.id = m.matchday_id
  JOIN public.months mo
    ON mo.id = j.month_id
  JOIN public.categories c
    ON c.id = m.category_id

  LEFT JOIN public.match_participants p1
    ON p1.match_id = s.match_id
    AND p1.player_id = s.pair1_player1_id

  LEFT JOIN public.match_participants p2
    ON p2.match_id = s.match_id
    AND p2.player_id = s.pair1_player2_id

  LEFT JOIN public.match_participants p3
    ON p3.match_id = s.match_id
    AND p3.player_id = s.pair2_player1_id

  LEFT JOIN public.match_participants p4
    ON p4.match_id = s.match_id
    AND p4.player_id = s.pair2_player2_id

  WHERE mo.season_id = p_season_id
),

expanded_sets AS (
  SELECT
    match_id,
    category_id,
    points_per_set,
    real_p1_j1 AS player_id,
    pair1_score AS gf,
    pair2_score AS ga,
    (pair1_score > pair2_score) AS win
  FROM sets_base

  UNION ALL

  SELECT
    match_id,
    category_id,
    points_per_set,
    real_p1_j2,
    pair1_score,
    pair2_score,
    (pair1_score > pair2_score)
  FROM sets_base

  UNION ALL

  SELECT
    match_id,
    category_id,
    points_per_set,
    real_p2_j1,
    pair2_score,
    pair1_score,
    (pair2_score > pair1_score)
  FROM sets_base

  UNION ALL

  SELECT
    match_id,
    category_id,
    points_per_set,
    real_p2_j2,
    pair2_score,
    pair1_score,
    (pair2_score > pair1_score)
  FROM sets_base
),

classification AS (
  SELECT
    player_id,
    SUM(CASE WHEN win THEN points_per_set ELSE 0 END)
      + COUNT(DISTINCT match_id) * 5 AS base_points,
    SUM(gf - ga) AS diff,
    SUM(gf) AS games_for,
    COUNT(DISTINCT match_id) AS matches_played
  FROM expanded_sets
  WHERE player_id IS NOT NULL
  GROUP BY player_id
),

bonus AS (
  SELECT
    b.player_id,
    SUM(b.quantity) AS bonus_points
  FROM public.bonuses b
  WHERE b.month_id IN (
    SELECT mo.id
    FROM public.months mo
    WHERE mo.season_id = p_season_id
  )
  GROUP BY b.player_id
)

SELECT
  c.player_id,
  s.full_name,
  s.nickname,
  (c.base_points + COALESCE(b.bonus_points, 0)) AS points,
  c.diff,
  c.games_for,
  c.matches_played

FROM classification c
JOIN public.members s
  ON s.id = c.player_id

LEFT JOIN bonus b
  ON b.player_id = c.player_id

ORDER BY
  (c.base_points + COALESCE(b.bonus_points, 0)) DESC,
  c.diff DESC,
  c.games_for DESC;

$$;