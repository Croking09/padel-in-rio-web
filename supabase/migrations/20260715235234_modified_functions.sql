drop function if exists "public"."register_match_results"(p_partido_id integer, p_sets jsonb, p_participacion jsonb);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.register_match_results(p_match_id integer, p_sets jsonb, p_participation jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM public.sets
  WHERE match_id = p_match_id;

  INSERT INTO public.sets (
    match_id,
    "order",
    pair1_player1_id,
    pair1_player2_id,
    pair2_player1_id,
    pair2_player2_id,
    pair1_score,
    pair2_score
  )
  SELECT
    p_match_id,
    (s->>'order')::int,
    (s->>'pair1_player1_id')::int,
    (s->>'pair1_player2_id')::int,
    (s->>'pair2_player1_id')::int,
    (s->>'pair2_player2_id')::int,
    (s->>'pair1_score')::int,
    (s->>'pair2_score')::int
  FROM jsonb_array_elements(p_sets) AS s;

  UPDATE public.match_participants
  SET substitute_id = NULL
  WHERE match_id = p_match_id;

  UPDATE public.match_participants AS mp
  SET substitute_id = data.substitute_id
  FROM (
    SELECT
      (p->>'player_id')::int AS player_id,
      (p->>'substitute_id')::int AS substitute_id
    FROM jsonb_array_elements(p_participation) AS p
  ) AS data
  WHERE mp.match_id = p_match_id
    AND mp.player_id = data.player_id;

END;
$function$
;


  create policy "Admins can do ANYTHING"
  on "public"."match_participants"
  as permissive
  for all
  to public
using (((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true));



  create policy "Admins can do ANYTHING"
  on "public"."sets"
  as permissive
  for all
  to public
using (((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true));



