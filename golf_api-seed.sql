INSERT INTO courses (name, location, distance, par, price_in_dollars, num_of_holes, phone_number, owner, image)
VALUES
    ('Course 1', 'Location 1', '10 miles', '72', '$50', '18', '123-456-7890', 'Owner 1', 'image1.jpg'),
    ('Course 2', 'Location 2', '15 miles', '71', '$60', '18', '987-654-3210', 'Owner 2', 'image2.jpg'),
    ('Course 3', 'Location 3', '20 miles', '70', '$40', '9', '456-789-0123', 'Owner 3', 'image3.jpg'),
    ('Course 4', 'Location 4', '12 miles', '73', '$55', '18', '789-012-3456', 'Owner 4', 'image4.jpg'),
    ('Course 5', 'Location 5', '8 miles', '69', '$65', '18', '210-543-8765', 'Owner 5', 'image5.jpg');


INSERT INTO holes (par, distance, hole_number, handicap, course_name)
VALUES
    (4, 400, 5, 1, 'Course 1'),
    (3, 350, 3, 2, 'Course 1'),
    (4, 420, 4, 1, 'Course 2'),
    (5, 500, 2, 2, 'Course 2'),
    (4, 410, 5, 1, 'Course 3');