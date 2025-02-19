Feature: post

Scenario: Postagem criada com sucesso com texto válido dentro do limite de 280 caracteres
    Given O usuário "João Silva" existe na plataforma Twibbles
    And João Silva tem o ID 2905
    When João Silva cria uma postagem com o texto "Este é um texto válido dentro do limite de 280 caracteres."
    Then O sistema retorna status 200 com a mensagem "Post created"

Scenario: N-Enesima Postagem criada com sucesso com texto válido dentro do limite de 280 caracteres
    Given O usuário "João Silva" existe na plataforma Twibbles
    And João Silva tem o ID 2905
    When João Silva cria uma outra postagem com o texto "Segundo post criado"
    Then O sistema retorna status 200 com a mensagem "Post created"

