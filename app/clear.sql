DROP TABLE IF EXISTS "plans-current";
DROP TABLE IF EXISTS providers;
DROP TABLE IF EXISTS plans;

DROP TYPE IF EXISTS connection_types; 
DROP TYPE IF EXISTS price_model;

DROP SEQUENCE IF EXISTS "plans-current_id_seq";
DROP SEQUENCE IF EXISTS providers_id_seq;
DROP SEQUENCE IF EXISTS plans_id_seq;