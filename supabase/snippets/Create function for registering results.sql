CREATE OR REPLACE FUNCTION public.register_match_results(
  p_partido_id integer,
  p_sets jsonb,
  p_participacion jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Borramos sets anteriores
  DELETE FROM public."Sets"
  WHERE partido_id = p_partido_id;

  -- Borramos participaciones anteriores
  DELETE FROM public."Participacion"
  WHERE partido_id = p_partido_id;

  -- Insertamos sets
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

  -- Insertamos participación
  INSERT INTO public."Participacion" (
    partido_id,
    jugador_id,
    sustituto_id
  )
  SELECT
    p_partido_id,
    (p->>'jugador_id')::int,
    (p->>'sustituto_id')::int
  FROM jsonb_array_elements(p_participacion) AS p;

END;
$$;