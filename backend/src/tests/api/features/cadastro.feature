Feature: Cadastro

    Scenario: Requisição para cadastro de usuário com sucesso
    Given: Nenhum usuário foi cadastrado ainda
    When: Uma requisição "POST" for enviada para /users com os dados:
        nome de usuário: "aliceperuniz"
        email: "alice@example.com"
        senha: "senha123"
    Then: O status da resposta deve ser "201"
    And: O usuário é cadastrado com o id = "1"
    And: A mensagem deve ser "User created"

    Scenario: Requisição para cadastro com email inválido
    Given: Nenhum usuário foi cadastrado ainda
    When: Uma requisição "POST" for enviada para /users com os dados:
        nome de usuário: "alicep"
        email: "aliceexample.com"
        senha: "senha123"
    Then: O status da resposta deve ser "400"
    And: A mensagem deve ser "Formato de e-mail inválido"

    Scenario: Requisição para cadastro com nome de usuário já existente
    Given: O usuário de id = 1 e nome de usuário = "alicep" já foi cadastrado
    When: Uma requisição "POST" for enviada para /users com os dados:
        nome de usuário: "alicep"
        email: "alice2@example.com"
        senha: "senha123"
    Then: O status da resposta deve ser "409"
    And: A mensagem deve ser "Nome de usuário já existe"