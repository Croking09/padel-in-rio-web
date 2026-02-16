create or replace function copy_player_categories(
  p_prev_month_id bigint,
  p_new_month_id bigint
)
returns void
language sql
as $$
insert into "Jugador_Categoria_Mes" (mes_id, jugador_id, categoria_id)
select
  p_new_month_id,
  jugador_id,
  categoria_id
from "Jugador_Categoria_Mes"
where mes_id = p_prev_month_id;
$$;
