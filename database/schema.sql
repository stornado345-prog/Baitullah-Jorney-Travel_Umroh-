-- SAFAH Travel Relational Database Schema (MySQL 8.0+)
-- Demonstration Portfolio Project — Sample Schema

CREATE TABLE IF NOT EXISTS packages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(14, 2) NOT NULL,
  duration_days SMALLINT UNSIGNED NOT NULL,
  duration_nights SMALLINT UNSIGNED NOT NULL,
  thumbnail VARCHAR(500) NOT NULL,
  gallery JSON NULL,
  airline VARCHAR(120) NOT NULL,
  makkah_hotel VARCHAR(180) NOT NULL,
  madinah_hotel VARCHAR(180) NOT NULL,
  included_facilities JSON NOT NULL,
  excluded_facilities JSON NOT NULL,
  itinerary JSON NOT NULL,
  status ENUM('active', 'draft', 'archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_packages_slug (slug),
  KEY idx_packages_status (status),
  KEY idx_packages_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS departures (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  package_id INT UNSIGNED NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  quota SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('open', 'limited', 'full', 'closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_departures_package_id (package_id),
  KEY idx_departures_date (departure_date),
  KEY idx_departures_status (status),
  CONSTRAINT fk_departures_package
    FOREIGN KEY (package_id) REFERENCES packages (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS registrations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  package_id INT UNSIGNED NOT NULL,
  departure_id INT UNSIGNED NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(160) NULL,
  participant_count TINYINT UNSIGNED NOT NULL DEFAULT 1,
  message TEXT NULL,
  status ENUM('pending', 'contacted', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_registrations_package_id (package_id),
  KEY idx_registrations_departure_id (departure_id),
  KEY idx_registrations_phone_departure (phone, departure_id),
  KEY idx_registrations_status (status),
  CONSTRAINT fk_registrations_package
    FOREIGN KEY (package_id) REFERENCES packages (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_registrations_departure
    FOREIGN KEY (departure_id) REFERENCES departures (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
