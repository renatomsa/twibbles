Feature: Perfil

    Scenario: Requisição para visualizar o perfil com sucesso
    Given: O usuário de id = 1 está logado no sistema
    When: Uma requisição "GET" for enviada para "/get_user_by_id/1"
    Then: O status da resposta deve ser "200"
    And: A mensagem da resposta deve ser "User found"
    And: O servidor retorna os dados do perfil do usuário
    And: O JSON da resposta deve conter os dados: id, nome de usuário, email, biografia, foto de perfil e status de privacidade.

    Scenario: Requisição para editar o perfil com sucesso
    Given: O usuário de id = 1 está logado no sistema
    When: Uma requisição "PATCH" for enviada para "/update_profile/1/Alice%20Peruniz%20Oliveira/url_da_foto.jpg/Exemplo%20de%20biografia"
    Then: O status da resposta deve ser "200"
    And: O servidor atualiza os dados do perfil do usuário de id = 1
    And: A mensagem deve ser "User privacy updated"