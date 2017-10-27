CREATE TABLE net_plans (
	plan_id bigserial PRIMARY KEY,
	provider varchar(30) NOT NULL,
	provider_logo varchar(50) NOT NULL,
	plan varchar(150) NOT NULL,
	download varchar(8) NOT NULL,
	upload varchar(8) NOT NULL,
	connection_type varchar(20),
	price float(2),
	price_model varchar(10),
	link varchar(150) NOT NULL,
	date_added timestamp,
	date_modified timestamp,
	active boolean
)

ALTER TABLE net_plans
ADD COLUMN price_model varchar(20);
UPDATE net_plans SET price_model='per month';
UPDATE net_plans SET price_model='per year' WHERE plan = 'Fiber Plus' OR plan = 'Fiber Pro' OR plan = 'Fiber One';

ALTER TABLE net_plans
ALTER COLUMN download TYPE INT USING REPLACE(download, 'mbps', '')::NUMERIC,
ALTER COLUMN upload TYPE INT USING REPLACE(upload, 'mbps', '')::NUMERIC;

INSERT INTO net_plans (provider, provider_logo,plan,download,upload,connection_type,price,link,date_added,date_modified,active) VALUES
('Ezecom', 'uploads/ezecom.png', 'EZECOM Corporate 1mbps', '1mbps', '1mbps', 'ADSL', 40.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Corporate 2mbps', '2mbps', '2mbps', 'ADSL', 80.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Corporate 3mbps', '3mbps', '3mbps', 'ADSL', 120.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Corporate 4mbps', '4mbps', '4mbps', 'ADSL', 152.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Corporate 5mbps', '5mbps', '5mbps', 'ADSL', 190.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Premium 1mbps', '1mbps', '1mbps', 'ADSL', 33.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Premium 2mbps', '2mbps', '2mbps', 'ADSL', 60.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Premium 3mbps', '3mbps', '3mbps', 'ADSL', 90.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Premium 4mbps', '4mbps', '4mbps', 'ADSL', 108.00, 'monthly', 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Premium 5mbps', '5mbps', '5mbps', 'ADSL', 135.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Exlusive Basic', '3mbps', '3mbps', 'ADSL', 27.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Exlusive Plus', '5mbps', '5mbps', 'ADSL', 45.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Ezecom', 'uploads/ezecom.png', 'EZECOM Exlusive Complete', '7mbps', '7mbps', 'ADSL', 69.00, 'monthly', 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('Sinet', 'uploads/sinet.jpg', 'Fiber Edge', '10mbps', '10mbps', 'Fiber', 40.00, 'monthly', 'https://www.sinet.com.kh/internet-solution/fiber-edge/', now()::timestamptz(0), now()::timestamptz(0), true),
('Sinet', 'uploads/sinet.jpg', 'Fiber Edge+', '10mbps', '10mbps', 'Fiber', 50.00, 'monthly', 'https://www.sinet.com.kh/internet-solution/fiber-edge/', now()::timestamptz(0), now()::timestamptz(0), true),
('Sinet', 'uploads/sinet.jpg', 'Fiber Plus', '20mbps', '20mbps', 'Fiber', 660.00, 'yearly', 'https://www.sinet.com.kh/internet-solution/fiber-plus/', now()::timestamptz(0), now()::timestamptz(0), true),
('Sinet', 'uploads/sinet.jpg', 'Fiber Pro', '50mbps', '50mbps', 'Fiber', 1320.00, 'yearly', 'https://www.sinet.com.kh/internet-solution/fiber-pro/', now()::timestamptz(0), now()::timestamptz(0), true),
('Sinet', 'uploads/sinet.jpg', 'Fiber One', '150mbps', '150mbps', 'Fiber', 1100.00, 'yearly', 'https://www.sinet.com.kh/internet-solution/fiber-one/', now()::timestamptz(0), now()::timestamptz(0), true);



