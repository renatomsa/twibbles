Feature: Privacidade do perfil

# Service
Scenario: Buscar um usuário com base em uma substring
    Given existem os usuários de nomes "João Pedro" e "Jonato Serrano" e ids "709" e "024" 1
    When uma requisição GET for enviada para "/user/get_users_by_substring/Jo" 1
    Then o status da resposta deve ser "200" 1
    And o JSON da resposta deve ser uma lista de usuários 1
    And o usuário com id "709" e nome "João Pedro" deve estar na lista 1
    And o usuário com id "024" e nome "Jonato Serrano" deve estar na lista 1

Scenario: Nenhum usuário é encontrado na busca por substring
    Given não existe usuário com "Teste" no nome 2
    When uma requisição GET for enviada para "/user/get_users_by_substring/Teste" 2
    Then o status da resposta deve ser "200" 2
    And o JSON da resposta deve ser uma lista de usuários vazia 2