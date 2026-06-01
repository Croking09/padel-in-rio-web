INSERT INTO public."Categorias"
  (name, "order", puntos_set)
VALUES
  ('1ª', 1, 7),
  ('2ª', 2, 6),
  ('3ª', 3, 5),
  ('4ª', 4, 4),
  ('5ª', 5, 3);

INSERT INTO public."Temporadas"
  (name, start_date)
VALUES
  ('2025', '2025-01-01'),
  ('2026', '2026-01-01');

INSERT INTO public."Meses"
  (temporada_id, month, year) -- status: draft by default, 5_category: true by default
VALUES
  (2, 1, 2026),
  (2, 2, 2026),
  (2, 3, 2026),
  (2, 4, 2026),
  (2, 5, 2026),
  (2, 6, 2026),
  (2, 9, 2026),
  (2, 10, 2026),
  (2, 11, 2026),
  (2, 12, 2026);

INSERT INTO public."Torneos"
  (name, description, start_date, img_path, categories, end_date, inscription_end_date, manually_closed)
VALUES 
  ('Primavera 2023', 'El fin de semana del 12 al 14 de mayo, categorías masculinas y femeninas únicas. 15€ por inscripción.', '2023-05-12', NULL, ARRAY['MASC', 'FEM'], '2023-05-14', '2023-05-12', false),
  ('Primavera 2024', 'El fin de semana del 10 al 12 de mayo, categorías masculinas y femeninas únicas. 15€ por inscripción.', '2024-05-10', '10-05-2024.jpeg', ARRAY['MASC', 'FEM'], '2024-05-12', '2024-05-08', false),
  ('Mixto de Invierno 2024', 'El fin de semana del 20 al 22 de diciembre, 15€ por inscripción.', '2024-12-20', '20-12-2024.jpeg', NULL, '2024-12-22', '2024-12-16', false),
  ('Primavera 2025', 'El fin de semana del 9 al 11 de mayo, categorías masculinas y femeninas únicas. 20€ por inscripción y 15€ si eres socio.', '2025-05-09', '09-05-2025.jpeg', ARRAY['MASC', 'FEM'], '2025-05-11', '2025-05-04', false),
  ('Mixto de Otoño 2025', 'El fin de semana del 17 al 19 de octubre, 20€ por inscripción y 15€ si eres socio.', '2025-10-17', '17-10-2025.jpeg', NULL, '2025-10-19', '2025-10-13', false);

INSERT INTO public."Socios"
  (full_name, nickname) -- active: true by default
VALUES
  ('Mónica Rodríguez Gavín', 'Mónica'),
  ('Bonia Martínez Irimia', 'Bonia'),
  ('Javier Hernández Martínez', 'Javi'),
  ('Ana Hernández Martínez', 'Ana'),
  ('Francisco Hernández Solís', 'Paco'),
  ('Paz López Teijo', 'Paz'),
  ('Santiago Rodríguez Gavín', 'Santi'),
  ('Teresa Castro Vega', 'Tere'),
  ('Marisa González Irimia', 'Marisa'),
  ('Jose M. Muñoz Muñoz', 'José Manuel'),
  ('José Luis Iglesias Gallo', 'Jose Gas'),
  ('Juan José López Díaz', 'Juan'),
  ('Laura Alonso Carracedo', 'Laura'),
  ('Carla Flórez Quintana', 'Carla'),
  ('Luis Lorido Carballeira', NULL),
  ('Emilio Folgueiras Coto', 'Emilio'),
  ('Iván Trabadelo Iglesias', 'Iván'),
  ('Ramón González Barcia', 'Moncho'),
  ('Félix Villada Moirón', 'Félix'),
  ('José Luis Álvarez Bouso', 'Jose Bretoña'),
  ('Xosé Castro Vega', 'Pepe'),
  ('Antonio Martínez Irimia', 'Toño'),
  ('Hector Bello Godoy', NULL),
  ('Javier Trashorras', NULL),
  ('Andrés Seoane', NULL),
  ('José Jorge Fiallega González', 'Jorge'),
  ('Ángel Villada Moirón', NULL),
  ('Isacc Canterla Rubio', 'Isaac'),
  ('José L. Comendeiro López', 'Comendeiro'),
  ('Jesús Coto Folgueiras', 'Susón'),
  ('Germán Linares Castro', 'Germán'),
  ('Pablo Pumar Alonso', 'Pumar'),
  ('Mª José Pardo Rodríguez', 'Koké'),
  ('Paula Pérez Iglesias', NULL),
  ('Moisés Fernández Marcos', 'Moises'),
  ('Manuel Liz López', 'Liz'),
  ('Mónica García Mon', 'Mónica Mon'),
  ('Mateo Melón Codillero', 'Mateo'),
  ('Alfonso José Morcillo Panadero', 'Alfonso'),
  ('José Ramón Rodríguez García', 'Josiño'),
  ('Susana Darriba Andión', 'Susana'),
  ('Adrián Cadenas González', 'Adrián'),
  ('Miguel Rivas Castro', 'Miguel'),
  ('Pablo López Rodríguez', 'Pablo L.'),
  ('Beltrán García Darriba', 'Beltrán'),
  ('Andrea García Darriba', 'Andrea'),
  ('Tania Canto Morado', 'Tania');
