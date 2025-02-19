Feature: Comentários em postagens

  Scenario: Visualização de Comentários em uma postagem
    Given existe um post de id 22 criado pelo usuário de nome "Alice Peruniz" e id 2309 1
    And nesse post existe um comentário de id 1 criado pelo usuário de nome "John Doe" e id 4407 com conteúdo igual a "First!" 1
    When uma requisição GET for enviada para "/comments/post/22" 1
    Then o status da resposta deve ser "200" 1
    And o corpo da resposta deve ser uma lista de comentários 1
    And o comentário de id 1 criado pelo usuário de nome "John Doe" e id 4407 com conteúdo igual a "First!" deve estar na lista 1

  Scenario: Criação de comentário por um usuário em um post existente
    Given existe um usuário de id 101 com nome "Carlos Silva" 2
    And existe um post de id 55 criado pelo usuário de id 102 2
    When uma requisição POST for enviada para "/comments/user/102/post/55" com o corpo contendo o comentário "Muito interessante!" 2
    Then o status da resposta deve ser "201" 2
    And o corpo da resposta deve conter um comentário com conteúdo "Muito interessante!" 2

  Scenario: Criação de comentário em um post que não existe
    Given existe um usuário de id 101 com nome "Carlos Silva" 3
    And não existe um post de id 999 3
    When uma requisição POST for enviada para "/comments/user/101/post/999" com o corpo contendo o comentário "Comentário inválido" 3
    Then o status da resposta deve ser "404" 3
    And a mensagem da resposta deve ser "Post not found" 3

  Scenario: Deleção de um comentário
    Given existe um usuário de id 101 com nome "Carlos Silva" 4
    And existe um comentário de id 10 criado pelo usuário de id 101 no post de id 55 com conteúdo "Muito interessante!" 4
    When uma requisição DELETE for enviada para "/comments/user/101/comment/11" 4
    Then o status da resposta deve ser "200" 4
    And a mensagem da resposta deve ser "Comment deleted successfully" 4

  Scenario: Visualização de comentários em um post sem comentários
    Given existe um post de id 33 criado pelo usuário de nome "Bruno Souza" e id 1234 5
    And nesse post não existem comentários 5
    When uma requisição GET for enviada para "/comments/post/33" 5
    Then o status da resposta deve ser "404" 5
    And a mensagem da resposta deve ser "No comments found for this post" 5
