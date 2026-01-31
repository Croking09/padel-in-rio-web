INSERT INTO public."Torneos"
  (name, description, start_date, img_path, categories, end_date, inscription_end_date)
VALUES 
  ('Primavera 2023', 'El fin de semana del 12 al 14 de mayo, categorías masculinas y femeninas únicas. 15€ por inscripción.', '2023-05-12', NULL, ARRAY['MASC', 'FEM'], '2023-05-14', '2023-05-12'),
  ('Primavera 2024', 'El fin de semana del 10 al 12 de mayo, categorías masculinas y femeninas únicas. 15€ por inscripción.', '2024-05-10', '10-05-2024.jpeg', ARRAY['MASC', 'FEM'], '2024-05-12', '2024-05-08'),
  ('Mixto de Invierno 2024', 'El fin de semana del 20 al 22 de diciembre, 15€ por inscripción.', '2024-12-20', '20-12-2024.jpeg', NULL, '2024-12-22', '2024-12-16'),
  ('Primavera 2025', 'El fin de semana del 9 al 11 de mayo, categorías masculinas y femeninas únicas. 20€ por inscripción y 15€ si eres socio.', '2025-05-09', '09-05-2025.jpeg', ARRAY['MASC', 'FEM'], '2025-05-11', '2025-05-04'),
  ('Mixto de Otoño 2025', 'El fin de semana del 17 al 19 de octubre, 20€ por inscripción y 15€ si eres socio.', '2025-10-17', '17-10-2025.jpeg', NULL, '2025-10-19', '2025-10-13');