create or replace function generar_partidos_mes(
  p_mes_id bigint,
  p_partidos jsonb
)
returns void
language plpgsql
as $$
declare
  m jsonb;

  jornada1_id bigint;
  jornada2_id bigint;

  partido_id bigint;
begin

  /*
    Creamos / recuperamos las 2 jornadas del mes
    usando UPSERT + RETURNING (sin race conditions)
  */

  with jornadas_upsert as (
    insert into "Jornadas" (mes_id, number)
    values (p_mes_id, 1), (p_mes_id, 2)
    on conflict (mes_id, number)
    do update set mes_id = excluded.mes_id
    returning id, number
  )
  select
    max(id) filter (where number = 1),
    max(id) filter (where number = 2)
  into jornada1_id, jornada2_id
  from jornadas_upsert;

  if jornada1_id is null or jornada2_id is null then
    raise exception 'No se pudieron crear las jornadas';
  end if;

  /*
    Insertamos partidos
  */

  for m in select * from jsonb_array_elements(p_partidos)
  loop

    insert into "Partidos"(jornada_id, categoria_id)
    values (
      case (m->>'matchday')::int
        when 1 then jornada1_id
        else jornada2_id
      end,
      (m->>'categoryId')::bigint
    )
    returning id into partido_id;

    /*
      Insertamos jugadores del partido
    */

    insert into "Jugador_Partido"(partido_id, jugador_id)
    select
      partido_id,
      jsonb_array_elements_text(m->'players')::bigint;

  end loop;

  update "Meses"
  set status = 'confirmed'
  where id = p_mes_id;

end;
$$;
