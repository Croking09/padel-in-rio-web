alter table public."Meses"
add constraint meses_month_year_temporada_unique
unique (month, year, temporada_id);

alter table public."Jugador_Categoria_Mes"
add constraint jugador_categoria_mes_unique
unique (mes_id, jugador_id);

alter table public."Jornadas"
add constraint jornadas_mes_number_unique
unique (mes_id, number);
