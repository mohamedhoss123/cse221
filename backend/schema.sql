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

-- 3. Create COMPLAINTS Table (renamed from COMPLAINS)
CREATE TABLE COMPLAINTS (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255),
    type VARCHAR(45),
    VISITOR_visitor_id INT,
    Status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    FOREIGN KEY (VISITOR_visitor_id) REFERENCES VISITOR(visitor_id)
);


-- 4. Create ROOM Table
CREATE TABLE ROOM (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2),
    type VARCHAR(45),
    capacity INT DEFAULT 2,
    status ENUM('available', 'unavailable', 'maintenance') DEFAULT 'available'
);

-- 4.1 Create ROOM_IMAGES Table
CREATE TABLE ROOM_IMAGES (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255) NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES ROOM(room_id) ON DELETE CASCADE
);

-- 5. Create RESERVATION Table
CREATE TABLE RESERVATION (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    start_date DATE,
    end_date DATE,
    guests INT DEFAULT 2,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    special_requests TEXT NULL,
    ROOM_room_id INT,
    VISITOR_visitor_id INT,
    FOREIGN KEY (ROOM_room_id) REFERENCES ROOM(room_id),
    FOREIGN KEY (VISITOR_visitor_id) REFERENCES VISITOR(visitor_id)
);

-- 6. Create INVOICE Table
CREATE TABLE INVOICE (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2),
    date DATE,
    status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
    due_date DATE NULL,
    notes TEXT NULL,
    VISITOR_visitor_id INT,
    ROOM_room_id INT,
    RESERVATION_reservation_id INT UNIQUE,
    FOREIGN KEY (VISITOR_visitor_id) REFERENCES VISITOR(visitor_id),
    FOREIGN KEY (ROOM_room_id) REFERENCES ROOM(room_id),
    FOREIGN KEY (RESERVATION_reservation_id) REFERENCES RESERVATION(reservation_id) ON DELETE CASCADE
);

-- 7. Create PAYMENT Table
CREATE TABLE PAYMENT (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(45),
    amount DECIMAL(10, 2),
    date DATE,
    INVOICE_invoice_id INT,
    FOREIGN KEY (INVOICE_invoice_id) REFERENCES INVOICE(invoice_id) ON DELETE CASCADE
);

-- 8. Create Indexes for Performance
CREATE INDEX idx_reservation_visitor ON RESERVATION(VISITOR_visitor_id);
CREATE INDEX idx_reservation_room ON RESERVATION(ROOM_room_id);
CREATE INDEX idx_invoice_reservation ON INVOICE(RESERVATION_reservation_id);
CREATE INDEX idx_payment_invoice ON PAYMENT(INVOICE_invoice_id);
CREATE INDEX idx_room_status ON ROOM(status);
CREATE INDEX idx_reservation_status ON RESERVATION(status);