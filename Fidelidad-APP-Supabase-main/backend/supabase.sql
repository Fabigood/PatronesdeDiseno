-- Base de datos para Supabase PostgreSQL

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (username, password)
VALUES ('admin', '1234')
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS recompensas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  nivel VARCHAR(20) NOT NULL CHECK (nivel IN ('Bronce', 'Plata', 'Oro')),
  tipo VARCHAR(60) NOT NULL DEFAULT 'Producto',
  detalle TEXT NOT NULL DEFAULT '',
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO recompensas (nombre, nivel, tipo, detalle)
VALUES
  ('Café gratis', 'Bronce', 'Producto', 'Un café de cortesía'),
  ('Descuento 5%', 'Bronce', 'Descuento', '5% en tu próxima compra'),
  ('Postre gratis', 'Plata', 'Producto', 'Postre de temporada'),
  ('Descuento 15%', 'Plata', 'Descuento', '15% en cualquier producto'),
  ('Cena para dos', 'Oro', 'Experiencia', 'Cena especial para dos personas'),
  ('Descuento 30%', 'Oro', 'Descuento', '30% en tu próxima visita')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS compras (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  monto NUMERIC(10,2) NOT NULL CHECK (monto > 0),
  puntos_generados INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reclamos_recompensa (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  recompensa_id INTEGER NOT NULL REFERENCES recompensas(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_compras_cliente ON compras(cliente_id);
CREATE INDEX IF NOT EXISTS idx_reclamos_cliente ON reclamos_recompensa(cliente_id);
