insert into storage.buckets (id, name, public)
values ('torneos', 'torneos', true)
on conflict (id) do nothing;
