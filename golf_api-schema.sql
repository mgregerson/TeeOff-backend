CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    distance TEXT NOT NULL,
    par TEXT NOT NULL,
    price_in_dollars TEXT NOT NULL,
    num_of_holes TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    owner TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '<https://i.imgur.com/AXKJvIF.jpg>'
);

CREATE TABLE holes (
    id SERIAL PRIMARY KEY,
    hole_number INTEGER NOT NULL,
    par INTEGER NOT NULL,
    distance INTEGER NOT NULL,
    handicap INTEGER,
    image TEXT NOT NULL DEFAULT '<https://i.imgur.com/nhc1HN2.jpg>',
    course_name TEXT NOT NULL,
    FOREIGN KEY (course_name) REFERENCES courses (name) ON DELETE CASCADE
);