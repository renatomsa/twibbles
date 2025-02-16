Feature: Follow

    Scenario: Requisição para seguir usuário público com sucesso
        Given: O usuário de id = 1 não segue o usuário de id = 2
        And: O usuário de id = 2 tem o perfil público (is_private = False)
        When: Uma requisição "POST" for enviada para /follow/1/follow/2
        Then: O status da resposta deve ser "201"
        And: A mensagem deve ser "Followed successfully" 

    Scenario: Requisição para seguir usuário com perfil privado com sucesso
        Given: O usuário de id = 1 não segue o usuário de id = 2
        And: O usuário de id = 2 tem o perfil privado
        When: Uma requisição "POST" for enviada para /follow/1/follow/2
        Then: O status da resposta deve ser "201"
        And: A mensagem deve ser "Follow request sent"

    Scenario: Requisição para deixar de seguir usuário com sucesso
        Given: Usuário de id = 1 segue o usuário de id = 2
        When: Uma requisição "POST" for enviada para /follow/1/unfollow/2
        Then: O status da resposta deve ser "200"
        And: A mensagem deve ser "Unfollowed successfully"
    
    Scenario: Requisição para verificar solicitações pendentes de follow
        Given: Usuário de id = 1 tem o perfil privado
        And: recebeu solicitações de follow dos usuários de id = 2 e id = 3
        And: As solicitações dos usuários de id = 2 e id = 3 não foram aceitas ou rejeitadas
        When: Uma requisição "GET" for enviada para follow/1/follow_requests_as_requested
        Then: O status da resposta deve ser "200"
        And: A mensagem deve ser "OK"
        And: O JSON da resposta deve conter a lista das solicitações dos usuários de
        id = 2 e id = 3
    
    Scenario: Requisição para aprovar solicitação de follow
        Given: Usuário de id = 1 tem o perfil privado
        And: Recebeu solicitação de follow do usuário de id = 2
        And: A solicitação do usuário de id = 2 não foi aceita ou rejeitada
        When: Uma requisição "POST" é enviada para follow/2/accept_request/1
        Then: O status da resposta deve ser "201"
        And: A mensagem deve ser "Follow request accepted"

    Scenario: Requisição para rejeitar solicitação de follow
        Given: Usuário de id = 1 tem o perfil privado
        And: Recebeu solicitação de follow do usuário de id = 2
        And: A solicitação do usuário de id = 2 não foi aceita ou rejeitada
        When: Uma requisição "POST" é enviada para follow/2/reject_request/1
        Then: O status da resposta deve ser "200"
        And: A mensagem deve ser "Follow request rejected"

    Scenario: Requisição para verificar perfis seguidos
        Given: Usuário de id = 1 segue os usuários de id = 2 e id = 3
        When: Uma requisição "GET" é enviada para follow/1/following
        Then: O status da resposta deve ser "200"
        And: A mensagem deve ser "Followed users retrieved successfully"
        And: O JSON da resposta deve conter uma lista que contém os usuários
        de id = 2 e id = 3
    
    Scenario: Requisição para verificar perfis seguidores
        Given: Usuário de id = 1 é seguido pelos usuários de id = 2 e id = 3
        When: Uma requisição "GET" é enviada para follow/1/followers
        Then: O status da resposta deve ser "200"
        And: A mensagem deve ser "Followers retrieved successfully"
        And: O JSON da resposta deve conter uma lista que contém os usuários
        de id = 2 e id = 3
    
    
    