CREATE OR REPLACE FUNCTION create_season_with_months(
  p_name TEXT,
  p_start_date DATE,
  p_months JSONB
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_id INT;
BEGIN
  INSERT INTO seasons (name, start_date)
  VALUES (p_name, p_start_date)
  RETURNING id INTO v_id;

  INSERT INTO months (season_id, month, year)
  SELECT v_id, (m->>'month')::int, (m->>'year')::int
  FROM jsonb_array_elements(p_months) AS m;
END;
$$;