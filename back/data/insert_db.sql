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
INSERT INTO users (typesUsers_id, name, email, password, profile, verified, status, review, class_id) VALUES 
(2, 'Dídac Pérez', 'didac@example.com', 'password1', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/presidente_pedro_sanchez.png', true, 'approved', 4.7, 1),
(2, 'Ana María Sossa', 'ana@example.com', 'password2', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministra_maria_jesus_montero.jpg', true, 'approved', 4.8, 2),
(2, 'Vanessa Llop', 'vanessa@example.com', 'password3', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministra_yolanda_diaz.jpg', true, 'approved', 4.6, 3),
(2, 'Raül Pons', 'raul@example.com', 'password4', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_jose_manuel_albares.jpg', true, 'approved', 4.9, 4),
(2, 'Albert Casas', 'albert@example.com', 'password5', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_felix_bolanos.jpg', true, 'approved', 4.5, 5),
(2, 'Joan Sánchez', 'joan@example.com', 'password6', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministra_margarita_robles.jpg', true, 'approved', 4.4, 6),
(2, 'Ceferino Yuste', 'ceferino@example.com', 'password7', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_fernando_marlaska.jpg', true, 'approved', 4.3, 7),
(2, 'Emma Morales', 'emma@example.com', 'password8', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_oscar_puente.jpg', true, 'approved', 4.2, 8),
(2, 'Juanjo Carrasco', 'juanjo@example.com', 'password9', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministra_pilar_alegria.jpg', true, 'approved', 4.1, 9),
(2, 'Noah Escartí', 'noah@example.com', 'password10', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_jordi_hereu.jpg', true, 'approved', 4.0, 10),
(2, 'Ernesto Meiras', 'ernesto@example.com', 'password11', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_luis_planas.jpg', true, 'approved', 3.9, 11),
(2, 'Rafa Monje', 'rafa@example.com', 'password12', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_angel_victor_torres.jpg', true, 'approved', 3.8, 12),
(2, 'Segundo González', 'segundo@example.com', 'password13', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_ernest_urtasun.jpg', true, 'approved', 3.7, 13),
(2, 'Marc Aribau', 'marc@example.com', 'password14', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_carlos_cuerpo.png', true, 'approved', 3.6, 14),
(2, 'Héctor Alonso de la Rosa', 'hector@example.com', 'password15', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministra_monica_garcia.jpg', true, 'approved', 3.5, 15),
(2, 'Juan Delgado', 'juan@example.com', 'password16', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro_pablo_bustinduy.jpg', true, 'approved', 3.4, 16),
(2, 'Pol Prats', 'pol@example.com', 'password17', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministra_diana_morant.jpg', true, 'approved', 3.3, 17),
(2, 'Gerard Torrent', 'gerard@example.com', 'password18', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministra_ana_redondo.jpg', true, 'approved', 3.2, 18),
(2, 'Álvaro Pérez', 'alvaro@example.com', 'password19', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministro-oscar-lopez.png', true, 'approved', 3.1, 19),
(2, 'David Sierra', 'david@example.com', 'password20', 'https://www.lamoncloa.gob.es/gobierno/PublishingImages/xv-legislatura/biografias/ministra_sira_abed.jpg', true, 'approved', 3.0, 20),
(2, 'Laura Carrillo', 'laura@example.com', 'password21', 'https://media.licdn.com/dms/image/v2/D4D35AQEOBuDgNnYONA/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1719444320701?e=1737115200&v=beta&t=M42A7n7ih5bMzR18zl5-7uhJZ75JhS3UT4G8ofdIMKA', true, 'approved', 2.9, 21),
(2, 'Oriol Pelino', 'oriol@example.com', 'password22', 'https://media.licdn.com/dms/image/v2/C4D03AQH7nuq4gWaNtw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1639676601748?e=1741824000&v=beta&t=exnw6fuPK0FIqS9keQqCZc1atewOj1qI0R8nLni0Dp4', true, 'approved', 2.8, 22),
(2, 'Marc Esteve', 'marc.esteve@example.com', 'password23', 'https://media.licdn.com/dms/image/v2/D5603AQHV5g_kNdW_3g/profile-displayphoto-shrink_200_200/B56ZNuSdUcGcAY-/0/1732722153244?e=1741824000&v=beta&t=7BAY6SGt72Q7NeYcSkIUwvV7TgteX9jlydqHCVk_M_0', true, 'approved', 2.7, 23);

-- Inserciones para users (estudiantes)
INSERT INTO users (typesUsers_id, name, email, password, verified, status, review, class_id) VALUES 
(1, 'Laura Puig', 'laura@example.com', 'password24', true, 'approved', 4.2, 1),
(1, 'Martí Vila', 'marti@example.com', 'password25', true, 'approved', 3.9, 2),
(1, 'Gemma Riera', 'gemma@example.com', 'password26', true, 'approved', 4.3, 3),
(1, 'Oriol Serra', 'oriol@example.com', 'password27', true, 'approved', 4.1, 4),
(1, 'Anna Martí', 'anna@example.com', 'password28', true, 'approved', 4.4, 5);

-- Inserciones para users (administradores)
INSERT INTO users (typesUsers_id, name, email, password, verified, status, review, class_id) VALUES 
(3, 'Administradora A', 'adminA@example.com', 'password29', true, 'approved', 0.0, NULL),
(3, 'Administrador B', 'adminB@example.com', 'password30', true, 'approved', 0.0, NULL);

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
(1, 'Bases de Dades Avançades', 'Endinsa\'t en la gestió de bases de dades.', 2, 0), 
(1, 'Tendències en Data Science', 'Últimes tendències en ciència de dades.', 3, 1), 
(1, 'Introducció al Machine Learning', 'Una guia per a principiants al machine learning.', 4, 0), 
(1, 'Ressenyes Tecnològiques', 'Ressenyes dels últims productes tecnològics.', 5, 0);

-- Inserciones para comments
INSERT INTO comments (publication_id, user_id, commentReply_id, comment) VALUES 
(1, 2, NULL, 'Molt informatiu!'), 
(2, 3, 1, 'Gràcies pels detalls.'), 
(3, 4, NULL, 'Gran lectura!'), 
(4, 5, NULL, 'Article útil.'), 
(5, 1, NULL, 'Ben escrit.');

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

-- Inserts for reportsPublications
INSERT INTO reportsPublications (publicationId, userId, reportReason, reportDate) VALUES
(1, 1, 'Inappropriate content', '2023-01-01'),
(2, 2, 'Spam', '2023-01-02'),
(3, 3, 'Harassment', '2023-01-03');

-- Inserts for reportsComments
INSERT INTO reportsComments (commentId, userId, reportReason, reportDate) VALUES
(1, 1, 'Offensive language', '2023-01-01'),
(2, 2, 'Spam', '2023-01-02'),
(3, 3, 'Harassment', '2023-01-03');

-- Inserts for reportsUsers
INSERT INTO reportsUsers (userId, reportReason, reportDate) VALUES
(1, 'Multiple account abuse', '2023-01-01'),
(2, 'Inappropriate behavior', '2023-01-02'),
(3, 'Spam', '2023-01-03');