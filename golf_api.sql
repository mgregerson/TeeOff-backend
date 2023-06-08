\echo 'Delete and recreate golf_api db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE golf_api;
CREATE DATABASE golf_api;
\connect golf_api

\i golf_api-schema.sql
\i golf_api-seed.sql

\echo 'Delete and recreate golf_api_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE golf_api_test;
CREATE DATABASE golf_api_test;
\connect golf_api_test

\i golf_api-schema.sql
