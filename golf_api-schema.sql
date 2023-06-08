CREATE TABLE courses (
  handle VARCHAR(25) PRIMARY KEY CHECK (handle = lower(handle)),
  id INTEGER 
  name TEXT UNIQUE NOT NULL,
  num_employees INTEGER CHECK (num_employees >= 0),
  description TEXT NOT NULL,
  logo_url TEXT
);

CREATE TABLE holes (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);
