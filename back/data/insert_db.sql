-- Inserciones para qualifications
INSERT INTO qualifications (name) VALUES 
('Certificat de professionalitat de nivell 1'),
('Certificat acadèmic de superació del PFI'), 
('Tècnic/a en Sistemes Microinformàtics i Xarxes'), 
('Tècnic/a Superior en Administració de Sistemes Informátics en Xarxa'),
('Tècnic/a Superior en Desenvolupament d\'Aplicacions Multiplataforma'),
('Tècnic/a Superios en Desenvolupament d\'Aplicacions Web'),
('Tècnic/a Superior en Desenvolupament d\'Aplicacions Multiplataforma i Videojocs'),
('Tècnic/a Superior en Animació 3D, Jocs i Entorns Interactius'),
('Curs d\'Especialització en Desenvolupament de Videojocs i Realitat Virtual');

-- Inserciones para typesUsers
INSERT INTO typesUsers (name) VALUES 
('Estudiant'), 
('Professor'), 
('Administrador');

-- Inserciones para typesPublications
INSERT INTO typesPublications (name) VALUES 
('Comunitat'), 
('Petició');

-- Inserciones para classes (necesarias antes de insertar usuarios que las referencian)
INSERT INTO classes (name) VALUES 
('PFI 1'), 
('PFI 2'), 
('1SMX-A1'), 
('1SMX-A2'), 
('1SMX-A3'), 
('1SMX-A4'), 
('1SMX-B1/B2'), 
('2SMX-A1'), 
('2SMX-A2'), 
('2SMX-A3 (ANG)'), 
('2SMX-B'), 
('1ASIX-B1'), 
('1ASIX-B2'), 
('2ASIX-B1'), 
('2ASIX-B2 (ANG)'), 
('1 DAM'), 
('2 DAM'), 
('1 DAW'), 
('2 DAW'), 
('1 DAMVI'), 
('2 DAMVI'), 
('1 A3D'), 
('2 A3D'), 
('CURS ESPECIALITZACIÓ');

-- Inserciones para users (profesores)
INSERT INTO users (typesUsers_id, name, email, password, city, availibility, verified, status, review, class_id) VALUES
(2, 'Dídac Pérez', 'didac@example.com', '$2a$10$Rbmhs0nA8LdsWujBADdO/.YVLcp172ija2rRyi7qrDAvsGEMbOi7q', 'Barcelona, Espanya', '{"monday": "9-5", "tuesday": "9-5"}', true, 'approved', 4.7, 1),
(2, 'Ana María Sossa', 'ana@example.com', '$2a$10$fSSKxomTri57XJZTS2nNduhWCA0QDgzBnm7bFMd20txKGFSLTG9nS', 'Girona, Espanya', '{"monday": "10-6", "wednesday": "10-6"}', true, 'approved', 4.8, 2),
(2, 'Vanessa Llop', 'vanessa@example.com', '$2a$10$js75QMdBy7IUyTF7Pp/xj.hdSsdZ87JwEkpYToWXjq2YHe0COU2fC', 'Tarragona, Espanya', '{"thursday": "9-5", "friday": "9-5"}', true, 'approved', 4.6, 3),
(2, 'Raül Pons', 'raul@example.com', '$2a$10$3oGsr3ns4JAA3A08EwICTOsNS1LeEdBwgMBt9PPeRWa3pFvRHXR8e', 'Lleida, Espanya', '{"monday": "8-4", "tuesday": "8-4"}', true, 'approved', 4.9, 4),
(2, 'Albert Casas', 'albert@example.com', '$2a$10$Zzqvnd2p7CMiTPfdfqyTxu7niQibv0oFXTI6VXDggxcJKqnNFMKay', 'Manresa, Espanya', '{"wednesday": "10-6", "thursday": "10-6"}', true, 'approved', 4.5, 5),
(2, 'Joan Sánchez', 'joan@example.com', '$2a$10$PFfOZTo2BUwrpgHw.webQOhH355BeNuCMQUwDAhfDdY3zXlxv5vB2', 'Reus, Espanya', '{"monday": "9-5", "friday": "9-5"}', true, 'approved', 4.4, 6),
(2, 'Ceferino Yuste', 'ceferino@example.com', '$2a$10$Q3jz7Dz57zBX1OOH2rgiCOswLc/S0iWz1TmitF84khfUVMuNM8WQK', 'Mataró, Espanya', '{"tuesday": "8-4", "thursday": "8-4"}', true, 'approved', 4.3, 7),
(2, 'Emma Morales', 'emma@example.com', '$2a$10$R4GlINB/QUChE7zvb/v3JueVALB2sb7oDfWgS8AXWaWz8SWICHKoS', 'Sabadell, Espanya', '{"monday": "9-6", "friday": "9-6"}', true, 'approved', 4.2, 8),
(2, 'Juanjo Carrasco', 'juanjo@example.com', '$2a$10$EY9KBBktoRqOxvshKlPbK.R/k.XsFw116/IECups970d.GDHLH/rS', 'Terrassa, Espanya', '{"tuesday": "10-7", "wednesday": "10-7"}', true, 'approved', 4.1, 9),
(2, 'Noah Escartí', 'noah@example.com', '$2a$10$Jk14u0mOjoBnhIft7ih6XOS2IAQf648GqokZZxuOb/qaQs6pea5BC', 'Badalona, Espanya', '{"thursday": "8-3", "friday": "8-3"}', true, 'approved', 4.0, 10),
(2, 'Ernesto Meiras', 'ernesto@example.com', '$2a$10$xFi7ln4O6rRWYVHaf0JMIe7liR4fRN4YMJ/jKjDSPxGKVLJJCr5Uu', 'Granollers, Espanya', '{"monday": "9-6", "tuesday": "9-6"}', true, 'approved', 3.9, 11),
(2, 'Rafa Monje', 'rafa@example.com', '$2a$10$diaDTxSwnsgxliK2MLaL5.uPx3ejzNouIdnkg31WoxiO8JbfdlGO.', 'Vic, Espanya', '{"wednesday": "8-4", "thursday": "8-4"}', true, 'approved', 3.8, 12),
(2, 'Segundo González', 'segundo@example.com', '$2a$10$0myrYcrdjhDoUV0CmhMmX.x7XLG2zQW5hH9ssdl39FpHB3S6Q82m2', 'Blanes, Espanya', '{"monday": "10-7", "friday": "10-7"}', true, 'approved', 3.7, 13),
(2, 'Marc Aribau', 'marc@example.com', '$2a$10$MRdbSdNXxS1SPazclNPHRevBaldwWOADf28z7WYY6aGkUjNxswdXC', 'Igualada, Espanya', '{"tuesday": "9-5", "wednesday": "9-5"}', true, 'approved', 3.6, 14),
(2, 'Héctor Alonso de la Rosa', 'hector@example.com', '$2a$10$0wlg7KU5vw8HrqapJq2msO8J36I897Uv6GWJ.KsWFPJ4g8UFXh73i', 'Cerdanyola del Vallès, Espanya', '{"thursday": "10-6", "friday": "10-6"}', true, 'approved', 3.5, 15),
(2, 'Juan Delgado', 'juan@example.com', '$2a$10$8wvl61SPGN8.aZlDAejLsOZsk1b.MmHIcWLpaHxgSuVXBr.ZjnJKK', 'Sant Cugat del Vallès, Espanya', '{"monday": "8-4", "wednesday": "8-4"}', true, 'approved', 3.4, 16),
(2, 'Pol Prats', 'pol@example.com', '$2a$10$9CSxFLEffNVaEHl.1JRmBO8LEQPhTgSmSaxKOAinGS4gaTmQHV3lK', 'Mollet del Vallès, Espanya', '{"tuesday": "9-6", "thursday": "9-6"}', true, 'approved', 3.3, 17),
(2, 'Gerard Torrent', 'gerard@example.com', '$2a$10$IU1RWxrLICgOz2dayfQRbOI7XqlQU6lsHpLl.nxuAjWmQYRWYAOhq', 'Vilanova i la Geltrú, Espanya', '{"monday": "9-5", "friday": "9-5"}', true, 'approved', 3.2, 18),
(2, 'Álvaro Pérez', 'alvaro@example.com', '$2a$10$/Y/qjEuemROqYtbD5zxJ8Oc3yurSnUnEwFc3k8NPxhLlfPVmTKDjq', 'Figueres, Espanya', '{"tuesday": "10-7", "wednesday": "10-7"}', true, 'approved', 3.1, 19),
(2, 'David Sierra', 'david@example.com', '$2a$10$jOFR.QT29EirNxSEmzbIF.zaOEXL0IVt7goIh2FLiEOU3ROkQwaw.', 'El Prat de Llobregat, Espanya', '{"thursday": "8-3", "friday": "8-3"}', true, 'approved', 3.0, 20),
(2, 'Laura Carrillo', 'laura@example.com', '$2a$10$FGixUNiFk78QIX1NK5zoRe1m0s4UDQVNXfx/4ozkreXunkLS12BL2', 'Cornellà de Llobregat, Espanya', '{"monday": "10-6", "tuesday": "10-6"}', true, 'approved', 2.9, 21),
(2, 'Oriol Pelino', 'oriol@example.com', '$2a$10$QwjvVZfAuUcmXNQCtKccfeRJyDFO.T0PpRRTGYN7hAog6.E1T7SmW', 'Roses, Espanya', '{"wednesday": "9-4", "friday": "9-4"}', true, 'approved', 2.8, 22),
(2, 'Marc Esteve', 'marc.esteve@example.com', '$2a$10$GqD5MlpY/26KXKfHnT38kO8ijOkm/w5cGwIUzHk9a8fo8mSixmPne', 'Vilafranca del Penedès, Espanya', '{"monday": "8-3", "thursday": "8-3"}', true, 'approved', 2.7, 23);


-- Inserciones para users (estudiantes)
INSERT INTO users (typesUsers_id, name, email, password, city, verified, status, review, class_id) VALUES 
(1, 'Laura Puig', 'laura.puig@example.com', '$2a$10$CSY1r14epk1h3Z3dvAk22O32VTtSVMOb.wQmY0kbjqiHgUnVWDiaC', 'Barcelona, Espanya', true, 'approved', 4.2, 1),
(1, 'Martí Vila', 'marti.vila@example.com', '$2a$10$ESf05ZjrrLSIITVpQF9pAO3dsHc2sfrNTAoyMz5CIEI7F4wnu49T2', 'Girona, Espanya', true, 'approved', 3.9, 2),
(1, 'Gemma Riera', 'gemma.riera@example.com', '$2a$10$uEyRLtI.8J0NmZ/DVNbH0.YxC89CkAIBbZndP0GYvU2g7BGeCFV8e', 'Tarragona, Espanya', true, 'approved', 4.3, 3),
(1, 'Oriol Serra', 'oriol.serra@example.com', '$2a$10$vBnPHviwbtMxvTaBvGy6aeX8djcDIFMKr47MnDbukqHSACGAkXtR6', 'Lleida, Espanya', true, 'approved', 4.1, 4),
(1, 'Anna Martí', 'anna.marti@example.com', '$2a$10$Kz5w8f9SPaRMX5QnvsfBp.3yTZ1uMCP2/uc95fdEDSArkoa6Zfoa.', 'Barcelona, Espanya', true, 'approved', 4.4, 5);


-- Inserciones para users (administradores)
INSERT INTO users (typesUsers_id, name, email, password, verified, status, review, class_id) VALUES 
(3, 'Administradora A', 'adminA@example.com', '$2a$10$OAuGpEnQqJxEPJdwbMNUpu6DPy4kOhMgkfrh4V/bm0WYiCIujpstS', true, 'approved', 0.0, NULL),
(3, 'Administrador B', 'adminB@example.com', '$2a$10$LM7s9c5s36jkGkHDXVxfqeYa6cNvs41JiUqDg8eutD6B54Urxx6ZO', true, 'approved', 0.0, NULL);

-- Inserciones para usersQualifications
INSERT INTO usersQualifications (user_id, qualification_id) VALUES 
(1, 1), 
(2, 2), 
(3, 3), 
(4, 4), 
(5, 5);

-- Inserciones para reviews
INSERT INTO reviews (reviewed_user_id, reviewer_user_id, rating) VALUES 
(1, 2, 4.5), 
(3, 4, 3.2), 
(5, 1, 5.0), 
(2, 3, 2.8), 
(4, 5, 4.0);

-- Inserciones para publications
INSERT INTO publications (typesPublications_id, title, description, user_id, reports) VALUES 
(1, 'Introducció al SQL', 'Aprèn les bases del SQL.', 1, 0), 
(1, 'Bases de Dades Avançades', 'Endinsa\'t en la gestió de bases de dades.', 2, 1), 
(1, 'Tendències en Data Science', 'Últimes tendències en ciència de dades.', 3, 2), 
(1, 'Introducció al Machine Learning', 'Una guia per a principiants al machine learning.', 4, 3), 
(1, 'Ressenyes Tecnològiques', 'Ressenyes dels últims productes tecnològics.', 5, 4);

-- Inserciones para comments
INSERT INTO comments (publication_id, user_id, commentReply_id, comment) VALUES 
(1, 2, NULL, 'Molt informatiu!'), 
(2, 3, 1, 'Gràcies pels detalls.'), 
(3, 4, 2, 'Gran lectura!'), 
(4, 5, 3, 'Article útil.'), 
(5, 1, 4, 'Ben escrit.');

-- Inserciones para reportsPublications
INSERT INTO reportsPublications (publication_id, user_id, report) VALUES 
(1, 3, 'Contingut inadequat'), 
(2, 4, 'Spam'), 
(3, 5, 'Llenguatge ofensiu'), 
(4, 1, 'Plagi'), 
(5, 2, 'Informació falsa');

-- Inserciones para reportsComments
INSERT INTO reportsComments (comment_id, user_id, report) VALUES 
(1, 3, 'Llenguatge ofensiu'), 
(2, 4, 'Spam'), 
(3, 5, 'Contingut inadequat'), 
(4, 1, 'Informació falsa'), 
(5, 2, 'Plagi');

-- Inserciones para reportsUsers
INSERT INTO reportsUsers (reported_user_id, user_id, report) VALUES 
(1, 2, 'Assetjament'), 
(3, 4, 'Conducta inapropiada'), 
(5, 1, 'Spam'), 
(2, 3, 'Comportament inadequat'), 
(4, 5, 'Abús');

-- Inserciones para teacherClasses (relaciona a los profesores con sus clases)
INSERT INTO teachersClasses (user_id, class_id) VALUES 
(1, 1), 
(2, 2), 
(3, 3), 
(4, 4), 
(5, 5), 
(6, 6), 
(7, 7), 
(8, 8), 
(9, 9), 
(10, 10), 
(11, 11), 
(12, 12), 
(13, 13), 
(14, 14), 
(15, 15), 
(16, 16), 
(17, 17), 
(18, 18), 
(19, 19), 
(20, 20), 
(21, 21), 
(22, 22), 
(23, 23), 
(24, 23);