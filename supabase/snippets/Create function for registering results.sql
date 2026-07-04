CREATE OR REPLACE FUNCTION public.register_match_results(
  p_partido_id integer,
  p_sets jsonb,
  p_participacion jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Borramos los sets anteriores
  DELETE FROM public."Sets"
  WHERE partido_id = p_partido_id;

  -- Insertamos los nuevos sets
  INSERT INTO public."Sets" (
    partido_id,
    orden,
    pareja1_jugador1_id,
    pareja1_jugador2_id,
    pareja2_jugador1_id,
    pareja2_jugador2_id,
    pareja1_juegos,
    pareja2_juegos
  )
  SELECT
    p_partido_id,
    (s->>'orden')::int,
    (s->>'pareja1_jugador1_id')::int,
    (s->>'pareja1_jugador2_id')::int,
    (s->>'pareja2_jugador1_id')::int,
    (s->>'pareja2_jugador2_id')::int,
    (s->>'pareja1_juegos')::int,
    (s->>'pareja2_juegos')::int
  FROM jsonb_array_elements(p_sets) AS s;

  -- Reiniciamos los sustitutos de todos los participantes del partido
  UPDATE public."Participacion"
  SET sustituto_id = NULL
  WHERE partido_id = p_partido_id;

  -- Actualizamos los sustitutos indicados
  UPDATE public."Participacion" AS part
  SET sustituto_id = data.sustituto_id
  FROM (
    SELECT
      (p->>'jugador_id')::int AS jugador_id,
      (p->>'sustituto_id')::int AS sustituto_id
    FROM jsonb_array_elements(p_participacion) AS p
  ) AS data
  WHERE part.partido_id = p_partido_id
    AND part.jugador_id = data.jugador_id;

END;
$$;