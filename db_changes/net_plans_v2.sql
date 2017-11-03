CREATE TABLE plans (
    plan_id BIGSERIAL PRIMARY KEY,
    provider VARCHAR(30) NOT NULL,
    provider_logo VARCHAR(50),
    plan_name VARCHAR(100) NOT NULL,
    connection_type VARCHAR(20) NOT NULL,
    speed INT NOT NULL,
    data_cap INT,
    price FLOAT(2) NOT NULL DEFAULT 0.00,
    is_permonth BOOLEAN DEFAULT true,
    install_price FLOAT(2),
    deposit_price FLOAT(2),
    device_price FLOAT(2),
    link VARCHAR(150) NOT NULL,
    date_added TIMESTAMP DEFAULT NOW(),
    date_modified TIMESTAMP DEFAULT NOW(),
    active BOOLEAN DEFAULT true,
    notes text
)