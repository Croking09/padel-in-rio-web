CREATE OR REPLACE FUNCTION generate_month_matches(
  p_month_id bigint,
  p_matches jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  m jsonb;

  matchday1_id bigint;
  matchday2_id bigint;

  match_id bigint;
BEGIN
  WITH matchdays_upsert AS (
    INSERT INTO matchdays (month_id, "order")
    VALUES (p_month_id, 1), (p_month_id, 2)
    ON CONFLICT (month_id, "order")
    DO UPDATE SET month_id = EXCLUDED.month_id
    RETURNING id, "order"
  )
  SELECT
    MAX(id) FILTER (WHERE "order" = 1),
    MAX(id) FILTER (WHERE "order" = 2)
  INTO matchday1_id, matchday2_id
  FROM matchdays_upsert;

  IF matchday1_id IS NULL OR matchday2_id IS NULL THEN
    RAISE EXCEPTION 'No se pudieron crear las jornadas';
  END IF;

  FOR m IN
    SELECT *
    FROM jsonb_array_elements(p_matches)
  LOOP

    INSERT INTO matches (matchday_id, category_id)
    VALUES (
      CASE (m->>'matchday')::int
        WHEN 1 THEN matchday1_id
        ELSE matchday2_id
      END,
      (m->>'category_id')::bigint
    )
    RETURNING id INTO match_id;

    INSERT INTO match_participants (
      match_id,
      player_id,
      substitute_id
    )
    SELECT
      match_id,
      jsonb_array_elements_text(m->'players')::bigint,
      NULL;

  END LOOP;

  UPDATE months
  SET status = 'confirmed'
  WHERE id = p_month_id;

END;
$$;