Feature: Follow

    Scenario: Requisição para seguir usuário público com sucesso
        Given O usuário de id = "1" não segue o usuário de id = "2" 1
        And O usuário de id = "2" tem o perfil público (is_private = False) 1
        When Uma requisição "POST" for enviada para "/follow/1/follow/2" 1
        Then O status da resposta deve ser 201 1
        And A mensagem deve ser "Followed successfully" 1

    Scenario: Requisição para seguir usuário com perfil privado com sucesso
        Given O usuário de id = "1" não segue o usuário de id = "4" 2
        And O usuário de id = "4" tem o perfil privado 2
        And O usuário de id = "1" não enviou a solicitação para o usuário de id = "4" 2
        When Uma requisição "POST" for enviada para "/follow/1/follow/4" 2
        Then O status da resposta deve ser "201" 2
        And A mensagem deve ser "Follow request sent" 2

    Scenario: Requisição para deixar de seguir usuário com sucesso
        Given Usuário de id = "1" segue o usuário de id = "2" 3
        When Uma requisição "POST" for enviada para /follow/1/unfollow/2 3
        Then O status da resposta deve ser "200" 3
        And A mensagem deve ser "Unfollowed successfully" 3
    
    Scenario: Requisição para verificar solicitações pendentes de follow
        Given Usuário de id = 4 tem o perfil privado 4
        And recebeu solicitações de follow dos usuários de id = 2 e id = 3 4
        When Uma requisição "GET" for enviada para follow/4/follow_requests_as_requested 4
        Then O status da resposta deve ser "200" 4
        And A mensagem deve ser "OK" 4
        And O JSON da resposta deve conter a lista das solicitações dos usuários de id = 2 e id = 3 4
    
    Scenario: Requisição para aprovar solicitação de follow
        Given Usuário de id = 4 tem o perfil privado 5
        And o usuário de id = 4 não é seguido pelo usuário de id = 2 5
        And Recebeu solicitação de follow do usuário de id = 2 5
        When Uma requisição "POST" é enviada para follow/2/accept_request/4 5
        Then O status da resposta deve ser "201" 5
        And A mensagem deve ser "Follow request accepted" 5

    Scenario: Requisição para rejeitar solicitação de follow
        Given Usuário de id = 4 tem o perfil privado 6
        And o usuário de id = 4 não é seguido pelo usuário de id = 2 6
        And Recebeu solicitação de follow do usuário de id = 2 6
        When Uma requisição "POST" é enviada para follow/2/reject_request/4 6
        Then O status da resposta deve ser "200" 6
        And A mensagem deve ser "Follow request rejected" 6

    Scenario: Requisição para verificar perfis seguidos
        Given Usuário de id = 1 segue os usuários de id = 2 e id = 3 7
        When Uma requisição "GET" é enviada para follow/1/following 7
        Then O status da resposta deve ser "200" 7
        And A mensagem deve ser "Followed users retrieved successfully" 7
        And O JSON da resposta deve conter uma lista que contém os usuários de id = 2 e id = 3 7

    Scenario: Requisição para verificar perfis seguidores
        Given Usuário de id = 1 é seguido pelos usuários de id = 2 e id = 3 8
        When Uma requisição "GET" é enviada para follow/1/followers 8
        Then O status da resposta deve ser "200" 8
        And A mensagem deve ser "Followers retrieved successfully" 8
        And O JSON da resposta deve conter uma lista que contém os usuários de id = 2 e id = 3 8
    
    
    