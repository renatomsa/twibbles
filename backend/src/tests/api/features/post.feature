Feature: post

Scenario: Postagem criada com sucesso com texto válido dentro do limite de 280 caracteres
    Given O usuário "João Silva" existe na plataforma Twibbles e tem o ID "1" 1
    When "João Silva" cria uma postagem com o texto "Este é um texto válido dentro do limite de 280 caracteres." 1
    Then O sistema retorna status 201 com a mensagem "Post created" 1
