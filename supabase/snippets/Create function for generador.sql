CREATE OR REPLACE FUNCTION generar_partidos_mes(
  p_mes_id bigint,
  p_partidos jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  m jsonb;

  jornada1_id bigint;
  jornada2_id bigint;

  partido_id bigint;
BEGIN

  /*
    Creamos / recuperamos las 2 jornadas del mes
    usando UPSERT + RETURNING (sin race conditions)
  */

  WITH jornadas_upsert AS (
    INSERT INTO "Jornadas" (mes_id, number)
    VALUES (p_mes_id, 1), (p_mes_id, 2)
    ON CONFLICT (mes_id, number)
    DO UPDATE SET mes_id = EXCLUDED.mes_id
    RETURNING id, number
  )
  SELECT
    MAX(id) FILTER (WHERE number = 1),
    MAX(id) FILTER (WHERE number = 2)
  INTO jornada1_id, jornada2_id
  FROM jornadas_upsert;

  IF jornada1_id IS NULL OR jornada2_id IS NULL THEN
    RAISE EXCEPTION 'No se pudieron crear las jornadas';
  END IF;

  /*
    Insertamos partidos
  */

  FOR m IN
    SELECT *
    FROM jsonb_array_elements(p_partidos)
  LOOP

    INSERT INTO "Partidos" (jornada_id, categoria_id)
    VALUES (
      CASE (m->>'matchday')::int
        WHEN 1 THEN jornada1_id
        ELSE jornada2_id
      END,
      (m->>'categoryId')::bigint
    )
    RETURNING id INTO partido_id;

    /*
      Insertamos participación de los jugadores
    */

    INSERT INTO "Participacion" (
      partido_id,
      jugador_id,
      sustituto_id
    )
    SELECT
      partido_id,
      jsonb_array_elements_text(m->'players')::bigint,
      NULL;

  END LOOP;

  UPDATE "Meses"
  SET status = 'confirmed'
  WHERE id = p_mes_id;

END;
$$;