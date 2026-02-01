SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict cvq5qAulYJxtRtV7DJFKgnhTY3IwJCo9csbdD949lM7CnJpqO7PAWMdqebHt7Xq

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 'authenticated', 'authenticated', 'mjferrei@uwaterloo.ca', '$2a$10$MwaEQPYzzMul79966Mt7h..DGKAWLztDKXEmpdwezTB0cxdJ1o.5i', '2025-12-22 23:19:05.46739+00', NULL, '', '2025-12-22 23:18:42.431182+00', '', NULL, '', '', NULL, '2026-01-04 21:45:19.831449+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "08015e0e-f7f3-4e8e-bbf4-719d6c63930a", "name": "Michael Ferreira", "email": "mjferrei@uwaterloo.ca", "email_verified": true, "phone_verified": false}', NULL, '2025-12-22 23:18:42.416217+00', '2026-01-11 03:07:15.929953+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('08015e0e-f7f3-4e8e-bbf4-719d6c63930a', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', '{"sub": "08015e0e-f7f3-4e8e-bbf4-719d6c63930a", "name": "Michael Ferreira", "email": "mjferrei@uwaterloo.ca", "email_verified": true, "phone_verified": false}', 'email', '2025-12-22 23:18:42.426219+00', '2025-12-22 23:18:42.42627+00', '2025-12-22 23:18:42.42627+00', '5dc700a0-5a71-4278-8675-9a0d6de83566');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('cc864381-8e63-4fe0-af93-b4c7b330c8c7', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', '2026-01-04 21:45:19.831582+00', '2026-01-11 03:07:15.946807+00', NULL, 'aal1', NULL, '2026-01-11 03:07:15.946684', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '129.97.125.5', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('cc864381-8e63-4fe0-af93-b4c7b330c8c7', '2026-01-04 21:45:19.921864+00', '2026-01-04 21:45:19.921864+00', 'password', 'f787bff8-fd30-40d8-bdf7-3204c5cd6bef');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 16, 'blouq4vygkpq', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', true, '2026-01-04 21:45:19.881726+00', '2026-01-11 03:07:15.88023+00', NULL, 'cc864381-8e63-4fe0-af93-b4c7b330c8c7'),
	('00000000-0000-0000-0000-000000000000', 17, 'fhpcqcsgm7dq', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', false, '2026-01-11 03:07:15.911355+00', '2026-01-11 03:07:15.911355+00', 'blouq4vygkpq', 'cc864381-8e63-4fe0-af93-b4c7b330c8c7');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."listings" ("id", "user_id", "title", "description", "price", "address", "move_in", "move_out", "bedrooms", "bathrooms", "image", "amenities", "created_at", "updated_at", "poster_name", "search_terms") VALUES
	(10, '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 'Condo 5 mins from MC', 'Moden condo available for sublet close to the heart of campus', 1200.00, '330 Philip St.', '2026-05-01 00:00:00', '2026-08-31 00:00:00', 4, 2, 'https://cdngeneral.rentcafe.com/dmslivecafe/2/20735/Living_Dining_final.jpg', '{WiFi,Furnished,Balcony,Parking,"Pet Friendly","Air Conditioning",Kitchen}', '2025-12-23 20:01:05.006468', '2025-12-23 20:01:05.006468', 'Michael Ferreira', 'spring 2026'),
	(11, '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 'New Condo Available Downtown', 'Beautiful Apartment in the heart of the city', 1297.00, '123 Queen St.', '2026-01-01 00:00:00', '2026-07-31 00:00:00', 2, 2, 'https://todaylivinggroup.com/wp-content/uploads/2020/10/65bremner_4002-7-scaled.jpg', '{WiFi,Laundry,Gym,"Utilities Included",Heating,"Air Conditioning",Kitchen,Balcony,Furnished,Dishwasher}', '2025-12-30 17:24:05.488732', '2025-12-30 17:24:05.488732', 'Michael Ferreira', 'new condo available downtown beautiful apartment in the heart of the city 123 queen st. wifi laundry gym utilities included heating air conditioning kitchen balcony furnished dishwasher'),
	(9, '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 'Apartment on King St', 'Beautiful property on King St. 20 minutes from campus', 1000.00, '1234 King St.', '2026-01-01 00:00:00', '2026-04-30 00:00:00', 2, 1, 'https://images.squarespace-cdn.com/content/v1/534c8a1fe4b0259491342174/1727877587566-MWAKRME7SAO908M9L6UA/10.png', '{Furnished,WiFi,Dishwasher,Laundry,Balcony,Kitchen,"Air Conditioning",Heating}', '2025-12-23 19:58:18.097106', '2025-12-23 19:58:18.097106', 'Michael Ferreira', 'winter 2026');


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."messages" ("id", "sender_id", "recipient_id", "listing_id", "content", "created_at", "sender_name") VALUES
	(2, '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 9, 'this is a test message', '2025-12-28 16:49:10.915591', 'Michael Ferreira'),
	(3, '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 9, 'Hi! Can I learn more about this listing?', '2025-12-30 17:12:05.306887', 'Michael Ferreira'),
	(4, '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 9, 'Hi! I would love to learn more about this listing', '2025-12-30 17:14:32.596921', 'Michael Ferreira'),
	(5, '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 9, 'Hi! I would love to learn more about this listing', '2025-12-30 17:16:21.343652', 'Michael Ferreira'),
	(6, '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 9, 'Hi! I would like to learn more about this listing.', '2025-12-30 17:23:13.691507', 'Michael Ferreira'),
	(7, '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', '08015e0e-f7f3-4e8e-bbf4-719d6c63930a', 9, 'This is a test message to see if it sends', '2026-01-11 03:07:45.359234', 'Michael Ferreira');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 17, true);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."favorites_id_seq"', 1, false);


--
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."listings_id_seq"', 11, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."messages_id_seq"', 7, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."notifications_id_seq"', 7, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict cvq5qAulYJxtRtV7DJFKgnhTY3IwJCo9csbdD949lM7CnJpqO7PAWMdqebHt7Xq

RESET ALL;
