Feature: Login

    Scenario: Login com sucesso
    Given: existe um usuário de id = 1 já foi cadastrado com nome de usuário "alicep" e senha "senha123"
    When: Uma requisição "GET" for enviada para "/get_user_by_id/1" 1 com os dados:
        nomeDeUsuario: "alicep"
        senha: "senha123"
    Then: O status da resposta deve ser "User found" 1
    And: O servidor valida as credenciais

    Scenario: Requisição para redefinição de senha com sucesso
    Given: O usuário de id = 1 solicitou a redefinição de senha e recebeu um token "token123"
    When: Uma requisição "POST" for enviada para user/update_password com os dados:
        token: "token123"
        nova senha: "novaSenha123"
    Then: O status da resposta deve ser "200"
    And: A mensagem deve ser "Senha redefinida com sucesso"