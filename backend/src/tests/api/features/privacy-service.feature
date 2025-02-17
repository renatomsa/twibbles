Feature: Privacidade do perfil

# Service
Scenario: Obter a privacidade do perfil de um usuário
    Given existe um usuário de nome "João Pedro", id "709" e privado "true" 1
    When uma requisição GET for enviada para "/user/get_user_by_id/709" 1
    Then o status da resposta deve ser "200" 1
    And o JSON da resposta deve conter um objeto com nome "João Pedro", id "709" e privado "true" 1

Scenario: Mudar a privacidade do perfil de um usuário
    Given existe um usuário de nome "João Pedro", id "709" e privado "true" 2
    When uma requisição PATCH for enviada para "/user/update_user_privacy/709/False" 2
    Then o status da resposta deve ser "200" 2
    And o JSON da resposta deve retornar uma mensagem Http "User privacy updated" 2