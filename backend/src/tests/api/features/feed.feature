Feature: feed

Scenario: Postagens encontradas para os usuários seguidos
    Given O usuário "Carlos Souza" existe na plataforma Twibbles e tem o ID "7" 3
    And "Carlos Souza" segue os usuario "João Silva" e tem o ID "5" 3
    And "Jão Silva" tem 1 postagem publicada 3
    When "Carlos" Souza acessa seu feed 3
    Then O sistema retorna status 200 com a mensagem "Posts found" 3