CREATE TYPE connection_types AS ENUM (
  'ADSL',
  'Fiber',
  '4G LTE+'
);
ALTER TYPE connection_types OWNER TO whichisp;

CREATE TYPE price_model AS ENUM ('per month', 'per year');
ALTER TYPE price_model OWNER TO whichisp;

CREATE TABLE "plans" (
  id serial PRIMARY KEY,
  uuid uuid NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  provider_uuid uuid NOT NULL,
  download_speed INT NOT NULL,
  upload_speed INT,
  connection connection_types NOT NULL,
  price NUMERIC(6,2) NOT NULL,
  price_model price_model NOT NULL,
  link TEXT NOT NULL,
  notes TEXT,
  updated_time TIMESTAMP WITHOUT TIME ZONE,
  is_deleted BOOLEAN DEFAULT 'false'
);

ALTER TABLE "plans" OWNER TO whichisp;

CREATE TABLE "plans-current" (
  id serial PRIMARY KEY,
  uuid uuid NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  provider_uuid uuid NOT NULL,
  download_speed INT NOT NULL,
  upload_speed INT,
  connection connection_types NOT NULL,
  price NUMERIC(6,2) NOT NULL,
  price_model price_model NOT NULL,
  link TEXT NOT NULL,
  notes TEXT,
  updated_time TIMESTAMP WITHOUT TIME ZONE,
  is_deleted BOOLEAN DEFAULT 'false'
);

ALTER TABLE "plans-current" OWNER TO whichisp;

CREATE TABLE "providers" (
  id serial PRIMARY KEY,
  uuid uuid NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  logo TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT 'false'
);

ALTER TABLE "providers" OWNER TO whichisp;
