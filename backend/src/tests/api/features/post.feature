Feature: post

Scenario: Postagem criada com sucesso com texto válido dentro do limite de 280 caracteres
    Given O usuário "João Silva" existe na plataforma Twibbles
    And João Silva tem o ID 1
    When João Silva cria uma postagem com o texto "Este é um texto válido dentro do limite de 280 caracteres."
    Then O sistema retorna status 200 com a mensagem "Post created"

Scenario: Falha ao criar postagem com texto excedendo 280 caracteres
    Given O usuário "Carlos Souza" existe na plataforma Twibbles
    And Carlos Souza tem o ID 3
    When Carlos Souza cria uma postagem com o texto "A" repetido 281 vezes
    Then O sistema retorna status 400 com a mensagem "Post text cannot exceed 280 characters"

Scenario: Falha ao criar postagem com texto composto apenas por espaços
    Given O usuário "Fernando Lima" existe na plataforma Twibbles
    And Fernando Lima tem o ID 5
    When Fernando Lima cria uma postagem com o texto "        " (somente espaços)
    Then O sistema retorna status 400 com a mensagem "Post text cannot be empty"

