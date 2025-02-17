Feature: feed

Scenario: Usuário não segue ninguém
    Given O usuário "João Silva" existe na plataforma Twibbles
    And João Silva não segue ninguém
    When João Silva acessa seu feed
    Then O sistema retorna status 200 com a mensagem "User does not follow anyone"
    And O feed de João Silva está vazio

Scenario: Nenhuma postagem encontrada para os usuários seguidos
    Given O usuário "Maria Oliveira" existe na plataforma Twibbles
    And Maria Oliveira segue os usuários "Carlos Souza" e "Ana Pereira"
    And Nenhum dos usuários seguidos possui postagens publicadas
    When Maria Oliveira acessa seu feed
    Then O sistema retorna status 404 com a mensagem "No posts were found"
    And O feed de Maria Oliveira está vazio

Scenario: Postagens encontradas para os usuários seguidos
    Given O usuário "Carlos Souza" existe na plataforma Twibbles
    And Carlos Souza segue os usuários "João Silva" e "Ana Pereira"
    And João Silva tem 3 postagens publicadas e Ana Pereira tem 2 postagens publicadas
    When Carlos Souza acessa seu feed
    Then O sistema retorna status 200 com a mensagem "Posts found"
    And O feed de Carlos Souza contém 5 postagens de João Silva e Ana Pereira, ordenadas por data