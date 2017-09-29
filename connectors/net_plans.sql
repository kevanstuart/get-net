CREATE TABLE net_plans (
	plan_UUID varchar(36) PRIMARY KEY,
	provider varchar(50) NOT NULL,
	plan varchar(150) NOT NULL,
	download varchar(10) NOT NULL,
	upload varchar(10) NOT NULL,
	connection_type varchar(100),
	price float(2),
	link varchar(150) NOT NULL,
	date_added timestamp,
	date_modified timestamp,
	active boolean
)

INSERT INTO net_plans (plan_UUID,provider,plan,download,upload,connection_type,price,link,date_added,date_modified,active) VALUES
('c108bc12-556d-45fe-aec3-f8524b0250dd', 'Ezecom', 'EZECOM Corporate 1mbps', '1mbps', '1mbps', 'ADSL', 40.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('1d3f6166-5e49-4915-bda0-44f1c47dc05b', 'Ezecom', 'EZECOM Corporate 2mbps', '2mbps', '2mbps', 'ADSL', 80.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('96198b58-39a6-4283-98c1-bdeb7cbbffe6', 'Ezecom', 'EZECOM Corporate 3mbps', '3mbps', '3mbps', 'ADSL', 120.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('d5d69d76-1bd5-4ba1-a566-15f739aaafba', 'Ezecom', 'EZECOM Corporate 4mbps', '4mbps', '4mbps', 'ADSL', 152.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('8b0b1657-bc30-4d66-9757-1ee94fdbb7fd', 'Ezecom', 'EZECOM Corporate 5mbps', '5mbps', '5mbps', 'ADSL', 190.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('cea9869d-a03e-48c3-82f3-afb1ca567170', 'Ezecom', 'EZECOM Premium 1mbps', '1mbps', '1mbps', 'ADSL', 33.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('8194b0b1-44cf-487e-8e56-8a88e8796ad3', 'Ezecom', 'EZECOM Premium 2mbps', '2mbps', '2mbps', 'ADSL', 60.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('0bb43dff-c846-4dac-b4be-4a5281404aef', 'Ezecom', 'EZECOM Premium 3mbps', '3mbps', '3mbps', 'ADSL', 90.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('4de6b279-0757-4541-a076-b2ae648c4ca8', 'Ezecom', 'EZECOM Premium 4mbps', '4mbps', '4mbps', 'ADSL', 108.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('70338ca5-4db6-4906-a0e1-edf9f512c448', 'Ezecom', 'EZECOM Premium 5mbps', '5mbps', '5mbps', 'ADSL', 135.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('3cba3cb1-2534-4cae-a9a2-b1e5e600d4d7', 'Ezecom', 'EZECOM Exlusive Basic', '3mbps', '3mbps', 'ADSL', 27.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('d2256547-7651-498f-8744-5735c7d19c48', 'Ezecom', 'EZECOM Exlusive Plus', '5mbps', '5mbps', 'ADSL', 45.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true),
('53d63e20-a1dc-4979-8f71-56b5b3bf1fef', 'Ezecom', 'EZECOM Exlusive Complete', '7mbps', '7mbps', 'ADSL', 69.00, 'https://www.ezecom.com.kh/our-services', now()::timestamptz(0), now()::timestamptz(0), true);