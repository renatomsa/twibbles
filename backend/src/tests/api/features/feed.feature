Feature: feed

Scenario: Postagens encontradas para os usuários seguidos
    Given O usuário "Carlos Souza" existe na plataforma Twibbles e tem o ID "7" 3
    when "Carlos Souza" segue os usuario "João Silva" e tem o ID "5" 3
    And "Jão Silva" tem 1 postagem publicada 3
    then "Carlos" Souza acessa seu feed 3
    And O sistema retorna status 200 com a mensagem "Posts found" 3
