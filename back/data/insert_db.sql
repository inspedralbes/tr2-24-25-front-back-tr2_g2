-- Inserciones para qualifications
INSERT INTO qualifications (name) VALUES 
('Tècnic en Desenvolupament Web'), 
('Tècnic en Administració de Sistemes'),
('Tècnic en Desenvolupament d\'Aplicacions Multiplataforma'), 
('Tècnic en Sistemes Microinformàtics i Xarxes'), 
('Tècnic en Sistemes de Telecomunicacions i Informàtica');

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
('1r DAM'), 
('2n DAM'), 
('1r DAW'), 
('2n DAW'), 
('1r SMX'), 
('2n SMX'), 
('1r ASIX'), 
('2n ASIX');

-- Inserciones para users (profesores)
INSERT INTO users (typesUsers_id, name, email, password, token, verified, status, review, class_id) VALUES 
(2, 'Joan Rovira', 'joan@example.com', 'password1', 'token1', true, 'approved', 4.7, 1),
(2, 'Maria Segura', 'maria@example.com', 'password2', 'token2', true, 'approved', 4.8, 2),
(2, 'Pere Mas', 'pere@example.com', 'password3', 'token3', true, 'approved', 4.6, 3),
(2, 'Núria Pons', 'nuria@example.com', 'password4', 'token4', true, 'approved', 4.9, 4),
(2, 'Carles Bosch', 'carles@example.com', 'password5', 'token5', true, 'approved', 4.5, 5);

-- Inserciones para users (estudiantes)
INSERT INTO users (typesUsers_id, name, email, password, token, verified, status, review, class_id) VALUES 
(1, 'Laura Puig', 'laura@example.com', 'password6', 'token6', true, 'approved', 4.2, 1),
(1, 'Martí Vila', 'marti@example.com', 'password7', 'token7', true, 'approved', 3.9, 2),
(1, 'Gemma Riera', 'gemma@example.com', 'password8', 'token8', true, 'approved', 4.3, 3),
(1, 'Oriol Serra', 'oriol@example.com', 'password9', 'token9', true, 'approved', 4.1, 4),
(1, 'Anna Martí', 'anna@example.com', 'password10', 'token10', true, 'approved', 4.4, 5);

-- Inserciones para users (administradores)
INSERT INTO users (typesUsers_id, name, email, password, token, verified, status, review, class_id) VALUES 
(3, 'Administradora A', 'adminA@example.com', 'adminPasswordA', 'adminTokenA', true, 'approved', 0.0, NULL),
(3, 'Administrador B', 'adminB@example.com', 'adminPasswordB', 'adminTokenB', true, 'approved', 0.0, NULL);

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