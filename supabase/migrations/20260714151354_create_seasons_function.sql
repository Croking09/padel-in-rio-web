drop policy "Only admin can write" on "public"."seasons";

drop function if exists "public"."create_temporada_with_months"(p_name text, p_start_date date, p_months jsonb);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_season_with_months(p_name text, p_start_date date, p_months jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
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
$function$
;


  create policy "Admin can do ANYTHING"
  on "public"."seasons"
  as permissive
  for all
  to public
using (((((auth.jwt() -> 'app_metadata'::text) ->> 'admin'::text))::boolean = true));



