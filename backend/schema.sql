-- 1. Create USER Table
CREATE TABLE USER (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45),
    email VARCHAR(45) UNIQUE,
    phone VARCHAR(45),
    password VARCHAR(255),
    role VARCHAR(45) DEFAULT 'visitor'
);

-- 2. Create VISITOR Table
CREATE TABLE VISITOR (
    visitor_id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(45),
    gender VARCHAR(45),
    birthdate DATE,
    USER_user_id INT UNIQUE,
    FOREIGN KEY (USER_user_id) REFERENCES USER(user_id)
);

-- 3. Create COMPLAINS Table
CREATE TABLE COMPLAINS (
    complain_id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255),
    type VARCHAR(45),
    VISITOR_visitor_id INT,
    FOREIGN KEY (VISITOR_visitor_id) REFERENCES VISITOR(visitor_id)
);

-- 4. Create ROOM Table
CREATE TABLE ROOM (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    price DECIMAL(10, 2), -- Note: Adjusted from (2) to (10,2) for standard pricing
    type VARCHAR(45)
);

-- 5. Create RESERVATION Table
CREATE TABLE RESERVATION (
    reservvaion_id INT AUTO_INCREMENT PRIMARY KEY, -- Kept spelling from diagram
    start_date DATE,
    end_date DATE,
    ROOM_room_id INT,
    VISITOR_visitor_id INT,
    FOREIGN KEY (ROOM_room_id) REFERENCES ROOM(room_id),
    FOREIGN KEY (VISITOR_visitor_id) REFERENCES VISITOR(visitor_id)
);

-- 6. Create INVOICE Table
CREATE TABLE INVOICE (
    invoce_id INT AUTO_INCREMENT PRIMARY KEY, -- Kept spelling from diagram
    amount DECIMAL(10, 2),
    date DATE,
    VISITOR_visitor_id INT,
    ROOM_room_id INT,
    RESERVATION_reservvaion_id INT,
    FOREIGN KEY (VISITOR_visitor_id) REFERENCES VISITOR(visitor_id),
    FOREIGN KEY (ROOM_room_id) REFERENCES ROOM(room_id),
    FOREIGN KEY (RESERVATION_reservvaion_id) REFERENCES RESERVATION(reservvaion_id)
);

-- 7. Create PAYMENT Table
CREATE TABLE PAYMENT (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(45),
    amount DECIMAL(10, 2),
    date DATE,
    INVOICE_invoce_id INT,
    FOREIGN KEY (INVOICE_invoce_id) REFERENCES INVOICE(invoce_id)
);