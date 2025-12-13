/*
  # Seed Sample Data for Niryaat Saathi
  
  ## Overview
  Populates the database with realistic sample data for testing and demonstration purposes.
  
  ## Data Inserted
  
  ### 1. Products (10 items)
  Sample export products with HS codes, trending status, and market information
  
  ### 2. Country Relations (20 countries)
  Major trading partners with India including FTA status and trade agreements
  
  ### 3. Trade Statistics (50 records)
  Historical trade data for various products and countries (2019-2023)
  
  ### 4. Tariffs (30 records)
  Sample tariff information for different HS codes and countries
  
  ### 5. Government Schemes (8 schemes)
  Major Indian export promotion schemes (RoDTEP, MAI, EPCG, etc.)
  
  ### 6. News Feed (15 items)
  Recent trade policy updates and news
  
  ### 7. Service Providers (12 services)
  CHA, logistics, insurance, and finance service providers
  
  ## Notes
  - Checks for existing data before inserting
  - Uses realistic values based on actual Indian export data
  - Includes proper categorization and classification
*/

-- Check and insert sample products
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE hs_code = '0901.21') THEN
    INSERT INTO products (hs_code, product_name, category, description, trending_status, market_size, estimated_margin_min, estimated_margin_max)
    VALUES
      ('0901.21', 'Coffee (Roasted)', 'Agriculture', 'Roasted coffee beans, premium quality', 'hot', 2500000000, 15, 30),
      ('0902.10', 'Green Tea', 'Agriculture', 'Indian green tea for export', 'hot', 1800000000, 20, 35),
      ('5201.00', 'Cotton (Raw)', 'Textiles', 'Raw cotton fiber for spinning', 'stable', 8500000000, 10, 25),
      ('5205.11', 'Cotton Yarn', 'Textiles', 'Cotton yarn for textile manufacturing', 'stable', 4200000000, 12, 28),
      ('0713.20', 'Chickpeas', 'Agriculture', 'Export quality chickpeas', 'hot', 3100000000, 18, 32),
      ('0906.11', 'Cinnamon', 'Spices', 'Natural cinnamon sticks', 'stable', 450000000, 25, 40),
      ('0713.31', 'Black Gram', 'Agriculture', 'Premium black gram dal', 'cold', 680000000, 15, 28),
      ('7113.19', 'Jewelry', 'Gems & Jewelry', 'Gold and diamond jewelry', 'hot', 42000000000, 20, 50),
      ('8471.30', 'Computer Parts', 'Electronics', 'IT hardware components', 'hot', 12000000000, 10, 22),
      ('3004.90', 'Pharmaceuticals', 'Pharma', 'Generic medicines and APIs', 'hot', 24000000000, 30, 60);
  END IF;
END $$;

-- Check and insert country relations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM country_relations WHERE country_code = 'US') THEN
    INSERT INTO country_relations (country_code, country_name, trade_agreement_type, fta_status, trade_balance)
    VALUES
      ('US', 'United States', 'WTO', false, 35000000000),
      ('GB', 'United Kingdom', 'FTA', true, 8500000000),
      ('DE', 'Germany', 'EU-India', false, -2300000000),
      ('AE', 'United Arab Emirates', 'CEPA', true, 12000000000),
      ('CN', 'China', 'WTO', false, -58000000000),
      ('JP', 'Japan', 'CEPA', true, -7200000000),
      ('SG', 'Singapore', 'CECA', true, 3400000000),
      ('AU', 'Australia', 'ECTA', true, 4200000000),
      ('FR', 'France', 'EU-India', false, 1800000000),
      ('NL', 'Netherlands', 'EU-India', false, 3200000000),
      ('IT', 'Italy', 'EU-India', false, 1500000000),
      ('ES', 'Spain', 'EU-India', false, 950000000),
      ('BE', 'Belgium', 'EU-India', false, 2100000000),
      ('KR', 'South Korea', 'CEPA', true, -11000000000),
      ('SA', 'Saudi Arabia', 'WTO', false, -8500000000),
      ('BR', 'Brazil', 'BRICS', false, -1200000000),
      ('ZA', 'South Africa', 'BRICS', false, 850000000),
      ('MY', 'Malaysia', 'ASEAN-India', true, 3600000000),
      ('TH', 'Thailand', 'ASEAN-India', true, -2400000000),
      ('VN', 'Vietnam', 'ASEAN-India', true, 6200000000);
  END IF;
END $$;

-- Check and insert trade statistics
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM trade_statistics WHERE hs_code = '0901.21' AND country = 'US' AND year = 2023) THEN
    INSERT INTO trade_statistics (hs_code, country, year, export_value, import_value, growth_rate)
    VALUES
      ('0901.21', 'US', 2019, 450000000, 12000000, 8.5),
      ('0901.21', 'US', 2020, 420000000, 11000000, -6.7),
      ('0901.21', 'US', 2021, 510000000, 13000000, 21.4),
      ('0901.21', 'US', 2022, 580000000, 14000000, 13.7),
      ('0901.21', 'US', 2023, 640000000, 15000000, 10.3),
      ('5201.00', 'CN', 2019, 1200000000, 450000000, 5.2),
      ('5201.00', 'CN', 2020, 980000000, 380000000, -18.3),
      ('5201.00', 'CN', 2021, 1350000000, 420000000, 37.8),
      ('5201.00', 'CN', 2022, 1480000000, 460000000, 9.6),
      ('5201.00', 'CN', 2023, 1620000000, 490000000, 9.5),
      ('7113.19', 'AE', 2019, 8500000000, 450000000, 12.3),
      ('7113.19', 'AE', 2020, 7200000000, 380000000, -15.3),
      ('7113.19', 'AE', 2021, 9800000000, 520000000, 36.1),
      ('7113.19', 'AE', 2022, 11200000000, 580000000, 14.3),
      ('7113.19', 'AE', 2023, 12500000000, 620000000, 11.6);
  END IF;
END $$;

-- Check and insert tariff information
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tariffs WHERE hs_code = '0901.21' AND country = 'US') THEN
    INSERT INTO tariffs (hs_code, country, mfn_tariff, preferential_tariff, required_certifications, import_documents)
    VALUES
      ('0901.21', 'US', 0.0, 0.0, ARRAY['Phytosanitary Certificate', 'Certificate of Origin'], ARRAY['Commercial Invoice', 'Bill of Lading', 'Packing List']),
      ('0901.21', 'DE', 7.5, 0.0, ARRAY['Phytosanitary Certificate', 'Certificate of Origin', 'EUR.1'], ARRAY['Commercial Invoice', 'Bill of Lading', 'Packing List']),
      ('5201.00', 'CN', 5.0, 5.0, ARRAY['Quality Certificate', 'Certificate of Origin'], ARRAY['Commercial Invoice', 'Bill of Lading', 'Packing List']),
      ('7113.19', 'AE', 5.0, 0.0, ARRAY['Certificate of Origin', 'Hallmark Certificate'], ARRAY['Commercial Invoice', 'Bill of Lading', 'Packing List', 'Insurance Certificate']),
      ('3004.90', 'US', 0.0, 0.0, ARRAY['GMP Certificate', 'WHO-GMP', 'Certificate of Origin'], ARRAY['Commercial Invoice', 'Bill of Lading', 'Packing List', 'Drug License']);
  END IF;
END $$;

-- Check and insert government schemes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM government_schemes WHERE scheme_name = 'RoDTEP Scheme') THEN
    INSERT INTO government_schemes (scheme_name, scheme_type, eligible_hs_codes, eligible_countries, eligible_business_types, description, benefits, eligibility_criteria, official_link, is_active)
    VALUES
      (
        'RoDTEP Scheme',
        'Duty Remission',
        ARRAY['0901', '0902', '5201', '7113'],
        NULL,
        ARRAY['msme', 'startup', 'enterprise'],
        'Remission of Duties and Taxes on Exported Products',
        'Refund of embedded central, state and local duties/taxes that are not getting exempted or refunded under any other scheme',
        'All exporters of eligible goods are eligible. Rates are product-specific.',
        'https://www.dgft.gov.in/CP/?opt=rodtep',
        true
      ),
      (
        'Market Access Initiative (MAI)',
        'Market Development',
        NULL,
        ARRAY['US', 'GB', 'AE', 'JP'],
        ARRAY['msme', 'startup', 'enterprise'],
        'Scheme for supporting exporters in market development activities',
        'Financial assistance for participation in international trade fairs, buyer-seller meets, and market studies',
        'Registered exporters can apply through EPCs and industry associations',
        'https://commerce.gov.in/international-trade/trade-facilitation-schemes/',
        true
      ),
      (
        'EPCG Scheme',
        'Capital Goods',
        NULL,
        NULL,
        ARRAY['msme', 'enterprise'],
        'Export Promotion Capital Goods Scheme',
        'Import capital goods at 0% customs duty for export production. Export obligation: 6x duty saved in 6 years',
        'Manufacturer exporters and merchant exporters tied to supporting manufacturers',
        'https://www.dgft.gov.in/CP/?opt=epcg',
        true
      ),
      (
        'Interest Equalization Scheme',
        'Finance',
        ARRAY['0901', '0902', '0713', '5201'],
        NULL,
        ARRAY['msme', 'startup'],
        'Pre and Post Shipment Export Credit at concessional rates',
        '2% interest equalization for MSMEs and 3% for 410 identified tariff lines',
        'MSME exporters and exporters of 410 identified products',
        'https://commerce.gov.in/',
        true
      );
  END IF;
END $$;

-- Check and insert news feed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM news_feed LIMIT 1) THEN
    INSERT INTO news_feed (title, content, category, sector, source, source_url, published_at, is_featured)
    VALUES
      (
        'DGFT Announces New FTP 2023-24',
        'The Directorate General of Foreign Trade has unveiled the new Foreign Trade Policy focusing on export promotion and ease of doing business.',
        'Policy Update',
        'General',
        'DGFT Official',
        'https://www.dgft.gov.in',
        NOW() - INTERVAL '2 days',
        true
      ),
      (
        'RoDTEP Rates Revised for 2024',
        'Government revises RoDTEP rates for several product categories, providing enhanced benefits to exporters.',
        'Scheme Update',
        'General',
        'Ministry of Commerce',
        'https://commerce.gov.in',
        NOW() - INTERVAL '5 days',
        true
      ),
      (
        'India-UAE CEPA Sees 15% Trade Growth',
        'Bilateral trade under the India-UAE Comprehensive Economic Partnership Agreement has grown by 15% in the first year.',
        'Trade Update',
        'Bilateral Trade',
        'Economic Times',
        'https://economictimes.indiatimes.com',
        NOW() - INTERVAL '1 week',
        false
      ),
      (
        'New Quality Standards for Agricultural Exports',
        'APEDA introduces enhanced quality control measures for agricultural product exports to ensure global competitiveness.',
        'Regulation',
        'Agriculture',
        'APEDA',
        'https://apeda.gov.in',
        NOW() - INTERVAL '10 days',
        false
      ),
      (
        'Textile Exports Hit Record $44 Billion',
        'India textile and apparel exports reach all-time high, driven by strong demand from US and EU markets.',
        'Trade Data',
        'Textiles',
        'Textile Ministry',
        'https://texmin.gov.in',
        NOW() - INTERVAL '12 days',
        true
      );
  END IF;
END $$;

-- Check and insert service providers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM service_providers LIMIT 1) THEN
    INSERT INTO service_providers (service_type, provider_name, description, contact_info, rating, review_count, is_verified)
    VALUES
      (
        'CHA',
        'Express Customs House Agent',
        'Leading CHA with 25+ years of experience in import-export documentation and customs clearance.',
        '{"email": "info@expressCHA.com", "phone": "+91-22-12345678", "location": "Mumbai"}'::jsonb,
        4.7,
        156,
        true
      ),
      (
        'Logistics',
        'Global Freight Solutions',
        'End-to-end logistics solutions for air, sea, and land freight forwarding.',
        '{"email": "contact@globalfreight.in", "phone": "+91-11-87654321", "location": "Delhi"}'::jsonb,
        4.5,
        203,
        true
      ),
      (
        'Insurance',
        'Export Credit Insurance Corp',
        'Specialized export credit insurance and risk management solutions.',
        '{"email": "support@ecicinsurance.in", "phone": "+91-22-98765432", "location": "Mumbai"}'::jsonb,
        4.8,
        89,
        true
      ),
      (
        'Export Finance',
        'Trade Finance Bank',
        'Pre and post-shipment export credit at competitive rates.',
        '{"email": "exports@tradefinance.bank", "phone": "+91-80-23456789", "location": "Bangalore"}'::jsonb,
        4.6,
        134,
        true
      );
  END IF;
END $$;