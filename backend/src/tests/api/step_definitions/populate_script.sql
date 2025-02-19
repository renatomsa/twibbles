INSERT INTO user_account (id, user_name, email, is_private, password, profile_img_path, bio)
VALUES (709, 'João Pedro', 'jp@gmail.com', false, 'jp123', '', 'Bio1');

INSERT INTO user_account (id, user_name, email, is_private, password, profile_img_path, bio)
VALUES (024, 'Jonato Serrano', 'rena@gmail.com', false, 'rena123', '', 'Bio2');

INSERT INTO user_account (id, user_name, email, is_private, password, profile_img_path, bio)
VALUES (1001, 'rodrigo123', 'rodrigo@gmail.com', false, 'rena123', '', 'Bio2');

INSERT INTO user_account (id, user_name, email, is_private, password, profile_img_path, bio)
VALUES (1002, 'Joao henrique', 'jenriqyue@gmail.com', false, 'rena123', '', 'Bio2');

INSERT INTO user_account (id, user_name, email, is_private, password, profile_img_path, bio)
VALUES (1003, 'rafailson', 'rafa@gmail.com', false, 'rena123', '', 'Bio2');

INSERT INTO user_account (id, user_name, email, is_private, password, profile_img_path, bio)
VALUES (1004, 'Alice', 'alice@gmail.com', true, 'rena123', '', 'Bio2');

INSERT INTO user_account (id, user_name, email, is_private, password, profile_img_path, bio) VALUES
(2907, 'Carlos Souza', 'password123', 'carlos@example.com', false, 'rena123', '', 'Bio2')

INSERT INTO user_account (id, user_name, email, is_private, password, profile_img_path, bio) VALUES
(2905, 'João Silva', 'password123', 'joao@example.com', false, 'rena123', '', 'Bio2')


INSERT INTO post (id, user_id, text) VALUES
(1, 2905, 'Este é um texto válido dentro do limite de 280 caracteres.');

INSERT INTO post (id, user_id, text) VALUES
(2, 2905, 'Segundo post criado');
