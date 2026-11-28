-- Sample data for local development only. Safe to delete this folder for production.
-- IDs are fixed so the data is easy to recognise: a0.. users, c0.. categories, b0.. applications.

INSERT INTO categories (id, name, description) VALUES
 ('c001', 'Office furniture', 'Desks, chairs and fit-outs'),
 ('c002', 'Catering', 'Food and refreshments for events'),
 ('c003', 'Printing and signage', 'Printing, branding and signs'),
 ('c004', 'Electrical', 'Installations and repairs'),
 ('c005', 'Construction', 'Building and maintenance');

-- Applicants (a1..a6), buyers (b1..b3 -> a7..a9)
INSERT INTO users (id, email, phone, display_name, account_status, created_at) VALUES
 ('a001', 'naledi@example.com',  '0712345678', 'Naledi Khumalo',  'ACTIVE',    now() - interval '2 days'),
 ('a002', 'thabo@example.com',   '0823456789', 'Thabo Mokoena',   'ACTIVE',    now() - interval '3 days'),
 ('a003', 'sipho@example.com',   '0834567890', 'Sipho Dlamini',   'ACTIVE',    now() - interval '5 days'),
 ('a004', 'lerato@example.com',  '0845678901', 'Lerato Khumalo',  'ACTIVE',    now() - interval '9 days'),
 ('a005', 'ayanda@example.com',  '0756789012', 'Ayanda Nkosi',    'ACTIVE',    now() - interval '12 days'),
 ('a006', 'pieter@example.com',  '0767890123', 'Pieter van Wyk',  'SUSPENDED', now() - interval '20 days'),
 ('a007', 'karabo@example.com',  '0778901234', 'Karabo Mahlangu', 'ACTIVE',    now() - interval '30 days'),
 ('a008', 'nomvula@example.com', '0789012345', 'Nomvula Sithole', 'ACTIVE',    now() - interval '35 days'),
 ('a009', 'johan@example.com',   '0790123456', 'Johan Pretorius', 'ACTIVE',    now() - interval '50 days');

INSERT INTO user_roles (user_id, role) VALUES
 ('a001', 'CUSTOMER'),
 ('a002', 'CUSTOMER'),
 ('a003', 'CUSTOMER'),
 ('a003', 'PROVIDER'),
 ('a004', 'CUSTOMER'),
 ('a005', 'CUSTOMER'),
 ('a005', 'PROVIDER'),
 ('a006', 'CUSTOMER'),
 ('a007', 'CUSTOMER'),
 ('a008', 'CUSTOMER'),
 ('a009', 'CUSTOMER');

INSERT INTO applications (application_id, owner_user_id, business_name, owner_name, location_text,
                          category_id, capacity, contact_number, about, status, created_at) VALUES
 ('b001', 'a001', 'Naledi Khumalo Interiors', 'Naledi Khumalo', 'Pretoria',
  'c001', '3 staff, 20 desks a week', '0712345678', 'Custom office furniture for small businesses and training centres.', 'PENDING', now() - interval '2 days'),
 ('b002', 'a002', 'Mokoena Construction (Pty) Ltd', 'Thabo Mokoena', 'Johannesburg',
  'c005', '12 staff', '0823456789', 'Registered building contractor, 8 years in commercial maintenance.', 'PENDING', now() - interval '3 days'),
 ('b003', 'a003', 'Dlamini Electrical', 'Sipho Dlamini', 'Soweto',
  'c004', '2 electricians', '0834567890', 'Residential and small commercial electrical work.', 'ACCEPTED', now() - interval '5 days'),
 ('b004', 'a004', 'Lerato Khumalo Print Studio', 'Lerato Khumalo', 'Soweto',
  'c003', '1 large-format printer', '0845678901', 'Signage and banners.', 'MORE_INFO_REQUIRED', now() - interval '9 days'),
 ('b005', 'a005', 'Nkosi Catering (Pty) Ltd', 'Ayanda Nkosi', 'Johannesburg',
  'c002', 'Events up to 200 guests', '0756789012', 'Corporate and community catering.', 'ACCEPTED', now() - interval '12 days'),
 ('b006', 'a006', 'Pieter van Wyk Building', 'Pieter van Wyk', 'Pretoria',
  'c005', '4 staff', '0767890123', 'General building work.', 'REJECTED', now() - interval '20 days');

INSERT INTO attachments (application_id, entity_type, file_url, content_type, size_bytes) VALUES
 ('b001', 'ID_DOCUMENT',          'applications/naledi/naledi-id.pdf',            'application/pdf', 182400),
 ('b001', 'PROOF_OF_ADDRESS',     'applications/naledi/proof-of-address.pdf',     'application/pdf', 96200),
 ('b002', 'ID_DOCUMENT',          'applications/thabo/thabo-id.pdf',              'application/pdf', 175300),
 ('b002', 'PROOF_OF_ADDRESS',     'applications/thabo/company-address.pdf',       'application/pdf', 88100),
 ('b002', 'COMPANY_REGISTRATION', 'applications/thabo/company-registration.pdf', 'application/pdf', 240900),
 ('b003', 'ID_DOCUMENT',          'applications/sipho/sipho-id.pdf',              'application/pdf', 170000),
 ('b004', 'ID_DOCUMENT',          'applications/lerato/lerato-id.jpg',            'image/jpeg',      64000);

-- Accepted applications already have a business profile and PROVIDER role.
INSERT INTO business_profiles (owner_user_id, business_name, owner_name, location_text, category_id,
                               capacity, contact_number, about, business_status, created_at) VALUES
 ('a003', 'Dlamini Electrical', 'Sipho Dlamini', 'Soweto', 'c004',
  '2 electricians', '0834567890', 'Residential and small commercial electrical work.', 'ACTIVE', now() - interval '4 days'),
 ('a005', 'Nkosi Catering (Pty) Ltd', 'Ayanda Nkosi', 'Johannesburg', 'c002',
  'Events up to 200 guests', '0756789012', 'Corporate and community catering.', 'ACTIVE', now() - interval '10 days');

-- Past admin decisions (what the portal writes when you approve/reject/request info).
INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata, created_at) VALUES
 (NULL, 'APPLICATION_ACCEPTED',       'APPLICATION', 'b003', '{}', now() - interval '4 days'),
 (NULL, 'APPLICATION_ACCEPTED',       'APPLICATION', 'b005', '{}', now() - interval '10 days'),
 (NULL, 'APPLICATION_INFO_REQUESTED', 'APPLICATION', 'b004', '{"message":"Please upload a clearer copy of your ID document."}', now() - interval '8 days'),
 (NULL, 'APPLICATION_REJECTED',       'APPLICATION', 'b006', '{"reason":"The ID document does not match the registered name."}', now() - interval '18 days');

INSERT INTO opportunities (id, buyer_user_id, category_id, title, description, location_text, budget_amount,
                           closes_at, delivery_at, status) VALUES
 ('d001', 'a007', 'c001',
  'Supply desks and chairs for a training centre', 'Supply and assemble 20 desks and 40 stackable chairs.', 'Pretoria', 85000.00,
  now() + interval '30 days', now() + interval '50 days', 'OPEN'),
 ('d002', 'a008', 'c002',
  'Cater a small business workshop', 'Provide lunch and refreshments for 60 attendees.', 'Johannesburg', 18000.00,
  now() + interval '14 days', now() + interval '25 days', 'OPEN'),
 ('d003', 'a009', 'c003',
  'Print community centre signage', 'Print and install directional signs for a community centre.', 'Soweto', 12000.00,
  now() - interval '30 days', now() - interval '15 days', 'CLOSED');

INSERT INTO opportunity_requirements (id, opportunity_id, requirement_text, is_mandatory) VALUES
 ('e001', 'd001', 'Include delivery and assembly in the quote.', TRUE),
 ('e002', 'd001', 'Provide a manufacturer warranty.', FALSE),
 ('e003', 'd002', 'Include vegetarian meals and label allergens.', TRUE);

INSERT INTO quotes (id, opportunity_id, provider_user_id, status, provider_message, total_amount,
                    prepared_at, submitted_at, decision_at) VALUES
 ('f001', 'd002', 'a005', 'ACCEPTED',
  'Happy to cater with a full vegetarian option.', 16500.00, now() - interval '6 days', now() - interval '5 days', now() - interval '3 days'),
 ('f002', 'd001', 'a003', 'SUBMITTED',
  'Can deliver within three weeks.', 79000.00, now() - interval '2 days', now() - interval '1 day', NULL),
 ('f003', 'd003', 'a003', 'DECLINED',
  'Signage supply and install.', 13500.00, now() - interval '40 days', now() - interval '38 days', now() - interval '33 days');

INSERT INTO quote_items (quote_id, description, quantity, unit_price, sort_order) VALUES
 ('f001', 'Lunch per person',  60, 220.00, 0),
 ('f001', 'Refreshments',      60,  55.00, 1),
 ('f002', 'Desks (assembled)', 20, 1850.00, 0),
 ('f002', 'Stackable chairs',  40, 1000.00, 1);

INSERT INTO private_job_costs (quote_id, description, estimated_amount, payment_timing) VALUES
 ('f002', 'Timber and hardware', 42000.00, 'BEFORE');
