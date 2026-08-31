-- Run this once against your MySQL server:
--   mysql -u root -p < backend/src/db/schema.sql

CREATE DATABASE IF NOT EXISTS loan_eligibility
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE loan_eligibility;

CREATE TABLE IF NOT EXISTS applications (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  full_name              VARCHAR(120)  NOT NULL,
  monthly_income         DECIMAL(12,2) NOT NULL,
  credit_score           SMALLINT      NOT NULL,
  tax_filed              BOOLEAN       NOT NULL,
  annual_tax_paid        DECIMAL(12,2) NOT NULL DEFAULT 0,
  requested_loan_amount  DECIMAL(14,2) NOT NULL,
  existing_monthly_debt  DECIMAL(12,2) NOT NULL DEFAULT 0,
  employment_type        ENUM('salaried', 'self_employed', 'unemployed') NOT NULL,
  employment_years       DECIMAL(4,1)  NOT NULL,
  total_score             SMALLINT      NOT NULL,
  decision                ENUM('APPROVED', 'CONDITIONAL', 'REJECTED') NOT NULL,
  breakdown_json           JSON          NOT NULL,
  created_at              TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
