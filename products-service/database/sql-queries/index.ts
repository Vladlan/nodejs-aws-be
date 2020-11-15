export const SELECT_ALL_PRODUCTS = `
SELECT id, title, description, price, count FROM
(
  SELECT * FROM products
  INNER JOIN stocks
  ON products.id = stocks.product_id
) count;
`;

export const SELECT_PRODUCT = `
SELECT id, title, description, price, count FROM
(
  SELECT * FROM products
  INNER JOIN stocks
  ON stocks.product_id = products.id
  WHERE id = $1::uuid
) count;
`;

export const INSERT_STOCK = `
INSERT INTO stocks (product_id, count) VALUES
($1::uuid, $2::integer)
`;

export const INSERT_PRODUCT = `
INSERT INTO products (id, title, description, price) VALUES
($1::uuid, $2::text, $3::text, $4::integer)
`;

// TODO: implement migrations from lines below
export const CREATE_UUID_EXTENSION = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

export const CREATE_PRODUCTS_TABLE = `
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text not null,
  description text,
  price integer
);
`;

export const CREATE_STOCKS_TABLE = `
CREATE TABLE IF NOT EXISTS stocks (
  stock_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid,
  count integer,
  foreign key ("product_id") references "products" ("id")
);
`;

export const INSERT_PRODUCTS = `
  INSERT INTO products (id, title, description, price) VALUES 
  ('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 'Product 1', 'Short Product Description1', 2.4), 
  ('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 'Product 2', 'Short Product Description2', 10), 
  ('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 'Product 3', 'Short Product Description3', 23), 
  ('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 'Product 4', 'Short Product Description4', 15), 
  ('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 'Product 5', 'Short Product Description5', 23), 
  ('7567ec4b-b10c-48c5-9345-fc73348a80a1', 'Product 6', 'Short Product Description6', 15), 
  ('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 'Product 7', 'Short Product Descriptio7', 23), 
  ('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 'Product 8', 'Short Product Description8', 15);
`;

export const INSERT_STOCKS = `
INSERT INTO stocks (product_id, count) VALUES 
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4), 
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 6), 
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 7), 
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 12), 
('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 7), 
('7567ec4b-b10c-48c5-9345-fc73348a80a1', 8), 
('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 2), 
('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 3);
`;

