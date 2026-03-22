CREATE OR REPLACE FUNCTION public.register_match_results(
  p_partido_id integer,
  p_sets jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Abrimos la transacción implícita
  DELETE FROM public."Sets"
  WHERE partido_id = p_partido_id;

  -- Insertamos todos los sets recibidos como JSON
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
END;
$$;