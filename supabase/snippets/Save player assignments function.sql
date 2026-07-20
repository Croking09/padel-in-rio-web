CREATE OR REPLACE FUNCTION save_month_assignments(
  p_month_id bigint,
  p_assignments jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_status text;
BEGIN

  SELECT status INTO v_status
  FROM months
  WHERE id = p_month_id;

  IF v_status IS NULL THEN
    RAISE EXCEPTION 'Mes no encontrado';
  END IF;

  IF v_status = 'locked' THEN
    RAISE EXCEPTION 'El mes está cerrado y no se puede editar.';
  END IF;

  DELETE FROM player_category_assignments
  WHERE month_id = p_month_id;

  INSERT INTO player_category_assignments (month_id, player_id, category_id)
  SELECT
    p_month_id,
    (a->>'player_id')::bigint,
    (a->>'category_id')::bigint
  FROM jsonb_array_elements(p_assignments) AS a;

END;
$$;