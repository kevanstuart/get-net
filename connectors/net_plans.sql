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

ALTER TABLE net_plans
ADD COLUMN notes varchar(200);

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

INSERT INTO net_plans (provider, provider_logo,plan,download,upload,connection_type,price,price_model,link,date_added,date_modified,active) VALUES
('OPENNET', 'uploads/opennet.png', 'Home Lite', 6, 6, 'ADSL', 12, 'per month', 'https://www.opennet.com.kh/news/adsl/adsl-home-premium-for-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'Home Basic', 8, 8, 'ADSL', 18, 'per month', 'https://www.opennet.com.kh/news/adsl/adsl-home-premium-for-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'Home Advance', 10, 10, 'ADSL', 24, 'per month', 'https://www.opennet.com.kh/news/adsl/adsl-home-premium-for-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'Home Pro', 12, 12, 'ADSL', 30, 'per month', 'https://www.opennet.com.kh/news/adsl/adsl-home-premium-for-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'F6', 7, 7, 'Fiber', 16, 'per month', 'https://www.opennet.com.kh/news/ftth/cambodia-fiber-to-the-home-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'F9', 10, 10, 'Fiber', 23,  'per month', 'https://www.opennet.com.kh/news/ftth/cambodia-fiber-to-the-home-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'F12', 12, 12, 'Fiber', 30, 'per month', 'https://www.opennet.com.kh/news/ftth/cambodia-fiber-to-the-home-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'B15', 15, 15, 'Fiber', 39, 'per month', 'https://www.opennet.com.kh/news/ftth/cambodia-fiber-to-the-home-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'B25', 25, 25, 'Fiber', 66, 'per month', 'https://www.opennet.com.kh/news/ftth/cambodia-fiber-to-the-home-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'B35', 35, 35, 'Fiber', 88, 'per month', 'https://www.opennet.com.kh/news/ftth/cambodia-fiber-to-the-home-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('OPENNET', 'uploads/opennet.png', 'B50', 50, 50, 'Fiber', 118, 'per month', 'https://www.opennet.com.kh/news/ftth/cambodia-fiber-to-the-home-phnompenh/', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('SingMeng Telemedia', 'uploads/singmeng.png', 'Internet 4mbps', 4, 4, 'Fiber', 12, 'per month', 'http://smtelemedia.com/sign-up-ftth/?service-name=4+Mbps', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('SingMeng Telemedia', 'uploads/singmeng.png', 'Internet 6mbps', 6, 6, 'Fiber', 14.99, 'per month', 'http://smtelemedia.com/sign-up-ftth/?service-name=6+Mbps', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('SingMeng Telemedia', 'uploads/singmeng.png', 'Internet 8mbps', 8, 8, 'Fiber', 21.99, 'per month', 'http://smtelemedia.com/sign-up-ftth/?service-name=8+Mbps', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('SingMeng Telemedia', 'uploads/singmeng.png', 'Internet 10mbps', 10, 10, 'Fiber', 28.99, 'per month', 'http://smtelemedia.com/sign-up-ftth/?service-name=10+Mbps', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('SingMeng Telemedia', 'uploads/singmeng.png', 'Internet 14mbps', 12, 12, 'Fiber', 33.99, 'per month', 'http://smtelemedia.com/sign-up-ftth/?service-name=12+Mbps', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('Kingtel', 'uploads/kingtel.png', 'Fiber 10', 10, 10, 'Fiber', 18.99, 'per month', 'http://www.kingtel.com.kh/premium_fiber_optichome.html', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('Kingtel', 'uploads/kingtel.png', 'Fiber 15', 15, 15, 'Fiber', 26.99, 'per month', 'http://www.kingtel.com.kh/premium_fiber_optichome.html', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('Kingtel', 'uploads/kingtel.png', 'Fiber 20', 20, 20, 'Fiber', 35.88, 'per month', 'http://www.kingtel.com.kh/premium_fiber_optichome.html', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('Kingtel', 'uploads/kingtel.png', 'Tam Chet 3', 3, 3, '4G LTE+', 9.99, 'per month', 'http://www.kingtel.com.kh/unlimited-data-traffic.html', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('Kingtel', 'uploads/kingtel.png', 'Tam Chet 6', 6, 6, '4G LTE+', 16.99, 'per month', 'http://www.kingtel.com.kh/unlimited-data-traffic.html', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('Kingtel', 'uploads/kingtel.png', 'Tam Chet 10', 10, 10, '4G LTE+', 24.99, 'per month', 'http://www.kingtel.com.kh/unlimited-data-traffic.html', now()::timestamptz(0), now()::timestamptz(0), TRUE),
('Kingtel', 'uploads/kingtel.png', 'Tam Chet 15', 15, 15, '4G LTE+', 34.99, 'per month', 'http://www.kingtel.com.kh/unlimited-data-traffic.html', now()::timestamptz(0), now()::timestamptz(0),TRUE);

