CREATE OR REPLACE FUNCTION public.get_ascensor(
  p_month_id integer
)
RETURNS TABLE (
  category_id integer,
  category_name text,
  category_order integer,
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
    j.month_id,
    m.category_id,
    c.points_per_set,

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
),

expanded_sets AS (
  SELECT
    match_id,
    month_id,
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
    month_id,
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
    month_id,
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
    month_id,
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
    category_id,
    player_id,

    SUM(CASE WHEN win THEN points_per_set ELSE 0 END)
      + COUNT(DISTINCT match_id) * 5 AS points,

    SUM(gf - ga) AS diff,
    SUM(gf) AS games_for,

    COUNT(DISTINCT match_id) AS matches_played

  FROM expanded_sets
  WHERE month_id = p_month_id
    AND player_id IS NOT NULL
  GROUP BY category_id, player_id
),

players_in_categories AS (
  SELECT
    jcm.category_id AS category_id,
    jcm.player_id AS player_id,
    s.nickname,
    s.full_name
  FROM public.player_category_assignments jcm
  JOIN public.members s
    ON s.id = jcm.player_id
  WHERE jcm.month_id = p_month_id
)

SELECT
  cat.id AS category_id,
  cat.name AS category_name,
  cat.order AS category_order,
  p.player_id,
  p.full_name,
  p.nickname,
  COALESCE(c.points, 0) AS points,
  COALESCE(c.diff, 0) AS diff,
  COALESCE(c.games_for, 0) AS games_for,
  COALESCE(c.matches_played, 0) AS matches_played
FROM players_in_categories p
JOIN public.categories cat
  ON cat.id = p.category_id
LEFT JOIN classification c
  ON c.category_id = p.category_id
  AND c.player_id = p.player_id
ORDER BY
  cat.order,
  points DESC,
  diff DESC,
  games_for DESC;
$$;