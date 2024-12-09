-- Inserts for qualifications
INSERT INTO qualifications (name) VALUES 
('Técnic en Desenvolupament Web'), 
('Técnic en Administració de Sistemes'), 
(`Técnic en Desenvolupament d\'Aplicacions Multiplataforma`), 
('Técnic en Sistemes Microinformàtics i Xarxes'), 
('Técnic en Sistemes de Telecomunicacions i Informàtica');

-- Inserts for typesUsers
INSERT INTO typesUsers (name) VALUES 
('Estudiant'), 
('Professor'), 
('Administrador');

-- Inserts for typesPublications
INSERT INTO typesPublications (name) VALUES 
('Comunitat'), 
('Petició');

-- Inserts for users (professors)
INSERT INTO users (typesUsers_id, name, email, password, token, verified, status, review, class_id) VALUES 
(2, 'Joan Rovira', 'joan@example.com', 'password1', 'token1', true, 'approved', 4.7, 1),
(2, 'Maria Segura', 'maria@example.com', 'password2', 'token2', true, 'approved', 4.8, 2),
(2, 'Pere Mas', 'pere@example.com', 'password3', 'token3', true, 'approved', 4.6, 3),
(2, 'Núria Pons', 'nuria@example.com', 'password4', 'token4', true, 'approved', 4.9, 4),
(2, 'Carles Bosch', 'carles@example.com', 'password5', 'token5', true, 'approved', 4.5, 5);

-- Inserts for users (students)
INSERT INTO users (typesUsers_id, name, email, password, token, verified, status, review, class_id) VALUES 
(1, 'Laura Puig', 'laura@example.com', 'password6', 'token6', true, 'approved', 4.2, 1),
(1, 'Martí Vila', 'marti@example.com', 'password7', 'token7', true, 'approved', 3.9, 2),
(1, 'Gemma Riera', 'gemma@example.com', 'password8', 'token8', true, 'approved', 4.3, 3),
(1, 'Oriol Serra', 'oriol@example.com', 'password9', 'token9', true, 'approved', 4.1, 4),
(1, 'Anna Martí', 'anna@example.com', 'password10', 'token10', true, 'approved', 4.4, 5);

-- Inserts for users (administrators)
INSERT INTO users (typesUsers_id, name, email, password, token, verified, status, review, class_id) VALUES 
(3, 'Administradora A', 'adminA@example.com', 'adminPasswordA', 'adminTokenA', true, 'approved', 0.0, NULL),
(3, 'Administrador B', 'adminB@example.com', 'adminPasswordB', 'adminTokenB', true, 'approved', 0.0, NULL);

-- Inserts for classes
INSERT INTO classes (name, teacher_user_id) VALUES 
('1r DAM', 1), 
('2n DAM', 2), 
('1r DAW', 3), 
('2n DAW', 4), 
('1r SMX', 5), 
('2n SMX', 1), 
('1r ASIX', 2), 
('2n ASIX', 3);

-- Inserts for usersQualifications
INSERT INTO usersQualifications (user_id, qualification_id) VALUES 
(1, 1), 
(2, 2), 
(3, 3), 
(4, 4), 
(5, 5);

-- Inserts for reviews
INSERT INTO reviews (reviewed_user_id, reviewer_user_id, rating, comment) VALUES 
(1, 2, 4.5, 'Bona feina!'), 
(3, 4, 3.2, 'Podria ser millor.'), 
(5, 1, 5.0, 'Excel·lent!'), 
(2, 3, 2.8, 'Necessita millorar.'), 
(4, 5, 4.0, 'Bon esforç.');

-- Inserts for publications
INSERT INTO publications (typesPublications_id, title, description, user_id, reports) VALUES 
(1, 'Introducció al SQL', 'Aprèn les bases del SQL.', 1, 0), 
(2, 'Bases de Dades Avançades', `Endinsa\'t en la gestió de bases de dades.`, 2, 1), 
(3, 'Tendències en Data Science', 'Últimes tendències en ciència de dades.', 3, 2), 
(4, 'Introducció al Machine Learning', 'Una guia per a principiants al machine learning.', 4, 3), 
(5, 'Ressenyes Tecnològiques', 'Ressenyes dels últims productes tecnològics.', 5, 4);

-- Inserts for comments
INSERT INTO comments (publication_id, user_id, commentReply_id, comment) VALUES 
(1, 2, NULL, 'Molt informatiu!'), 
(2, 3, 1, 'Gràcies pels detalls.'), 
(3, 4, 2, 'Gran lectura!'), 
(4, 5, 3, 'Article útil.'), 
(5, 1, 4, 'Ben escrit.');

-- Inserts for reportsPublications
INSERT INTO reportsPublications (publication_id, user_id, report) VALUES 
(1, 3, 'Contingut inadequat'), 
(2, 4, 'Spam'), 
(3, 5, 'Llenguatge ofensiu'), 
(4, 1, 'Plagi'), 
(5, 2, 'Informació falsa');

-- Inserts for reportsComments
INSERT INTO reportsComments (comment_id, user_id, report) VALUES 
(1, 3, 'Llenguatge ofensiu'), 
(2, 4, 'Spam'), 
(3, 5, 'Contingut inadequat'), 
(4, 1, 'Informació falsa'), 
(5, 2, 'Plagi');

-- Inserts for reportsUsers
INSERT INTO reportsUsers (reported_user_id, user_id, report) VALUES 
(1, 2, 'Assetjament'), 
(3, 4, 'Conducta inapropiada'), 
(5, 1, 'Spam'), 
(2, 3, 'Comportament inadequat'), 
(4, 5, 'Abús');