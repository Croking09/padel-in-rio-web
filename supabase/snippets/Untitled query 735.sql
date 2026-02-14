-- Ver la definición actual de la constraint
select 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
from pg_constraint
where conrelid = 'public."Meses"'::regclass
  and conname = 'Meses_status_check';