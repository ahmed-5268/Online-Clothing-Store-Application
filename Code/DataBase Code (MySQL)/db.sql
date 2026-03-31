CREATE DATABASE electronics_store;
USE electronics_store;
-- Product Table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  image VARCHAR(255)
);

-- Orders Table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
INSERT INTO products (name, description, price, stock, image)
VALUES
('Old Money Men Style', 'Full Dress for Men', 1200.00, 10, '/images/1.jpg'),
('Old Money Feminine Style', 'Full Dress for Women', 800.00, 15, '/images/2.jfif'),
('Shirts', 'High Quality Shirts', 200.00, 25, '/images/3.jpg'),
('Jeans', 'High Quality Jeans', 200.00, 25, '/images/4.jfif');

SELECT * FROM products;
DELETE FROM order_items WHERE product_id < 7;

DELETE FROM products WHERE id < 7;


