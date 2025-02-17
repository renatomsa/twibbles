-- Feature: Cadastro

Scenario 1: Requisição para cadastro de usuário com sucesso
Given: Nenhum usuário foi cadastrado ainda
When: Uma requisição "POST" for enviada para /users com os dados:
    nome: "Alice Peruniz"
    nome de usuário: "aliceperuniz"
    email: "alice@example.com"
    senha: "senha123"
    confirmação de senha: "senha123"
Then: O status da resposta deve ser "201"
And: O usuário é cadastrado com o id = 1
And: A mensagem deve ser "Usuário registrado com sucesso!"

Scenario 2: Requisição para cadastro com email inválido
Given: Nenhum usuário foi cadastrado ainda
When: Uma requisição "POST" for enviada para /users com os dados:
    nome: "Alice Peruniz"
    nome de usuário: "alicep"
    email: "aliceexample.com"
    senha: "senha123"
    confirmação de senha: "senha123"
Then: O status da resposta deve ser "400"
And: A mensagem deve ser "Formato de e-mail inválido"

Scenario 3: Requisição para cadastro com senhas não coincidentes
Given: Nenhum usuário foi cadastrado ainda
When: Uma requisição "POST" for enviada para /users com os dados:
    nome: "Alice Peruniz"
    nome de usuário: "alicep"
    email: "alice@example.com"
    senha: "senha123"
    confirmação de senha: "senha321"
Then: O status da resposta deve ser "400"
And: A mensagem deve ser "Senhas não coincidem"

Scenario 4: Requisição para cadastro com nome de usuário já existente
Given: O usuário de id = 1 e nome de usuário = "alicep" já foi cadastrado
When: Uma requisição "POST" for enviada para /users com os dados:
    nome: "Alice Peruniz"
    nome de usuário: "alicep"
    email: "alice2@example.com"
    senha: "senha123"
    confirmação de senha: "senha123"
Then: O status da resposta deve ser "409"
And: A mensagem deve ser "Nome de usuário já existe"

Scenario 5: Requisição para cadastro com dados ausentes
Given: Nenhum usuário foi cadastrado ainda
When: Uma requisição "POST" for enviada para /users com os dados:
    nome: "Alice Peruniz"
    nome de usuário: "alicep"
    email: 
    senha: "senha123"
    confirmação de senha: "senha123"
Then: O status da resposta deve ser "400"
And: A mensagem deve ser "Email é um campo obrigatório"


_________________________________________________________________________________________



-- Feature: Login
Scenario 1: Requisição para login com sucesso usando nome de usuário

Given: O usuário de id = 1 já foi cadastrado com nome de usuário "alicep" e senha "senha123"
When: Uma requisição "GET" for enviada para /auth/login com os dados:
    nomeDeUsuario/email: "alicep"
    senha: "senha123"
Then: O status da resposta deve ser "200"
And: O servidor valida as credenciais
And: A mensagem deve ser "Login efetuado com sucesso!"
Scenario 2: Requisição para login com sucesso usando e-mail
Given: O usuário de id = 1 já foi cadastrado com email "alice@example.com" e senha "senha123"
When: Uma requisição "GET" for enviada para /auth/login com os dados:
    nomeDeUsuario/email: "alice@example.com"
    senha: "senha123"
Then: O status da resposta deve ser "200"
And: O servidor valida as credenciais
And: A mensagem deve ser "Login efetuado com sucesso!"

Scenario 3: Requisição para login com senha incorreta
Given: O usuário de id = 1 já foi cadastrado com nome de usuário "alicep" e senha "senha123"
When: Uma requisição "GET" for enviada para /auth/login com os dados:
    nomeDeUsuario/email: "alicep"
    senha: "senha321"
Then: O status da resposta deve ser "401"
And: A mensagem deve ser "Senha incorreta"

Scenario 4: Requisição para login com usuário inexistente
Given: Nenhum usuário foi cadastrado com o nome de usuário ou e-mail "alana102"
When: Uma requisição "GET" for enviada para /auth/login com os dados:
    nomeDeUsuario/email: "alana102"
    senha: "qualquersenha"
Then: O status da resposta deve ser "404"
And: A mensagem deve ser "Usuário não encontrado"

Scenario 5: Requisição para login com dados ausentes
Given: Dados obrigatórios não foram fornecidos
When: Uma requisição "GET" for enviada para /auth/login com os dados:
    nomeDeUsuario/email:
    senha: "senha123"
Then: O status da resposta deve ser "400"
And: A mensagem deve ser "Campos obrigatórios ausentes"

Scenario 6: Requisição para solicitação de redefinição de senha
Given: O usuário de id = 1 já foi cadastrado com email "alice@example.com"
And: Existe um link para redefinição de senha disponível na tela de login
When: Uma requisição "POST" for enviada para /password_reset/request com os dados:
    email: "alice@example.com"
Then: O status da resposta deve ser "200"
And: A mensagem deve ser "Link de redefinição de senha enviado para o e-mail"

Scenario 7: Requisição para redefinição de senha com sucesso
Given: O usuário de id = 1 solicitou a redefinição de senha e recebeu um token "token123"
When: Uma requisição "POST" for enviada para /password_reset/confirm com os dados:
    token: "token123"
    nova senha: "novaSenha123"
    confirmação de senha: "novaSenha123"
Then: O status da resposta deve ser "200"
And: A mensagem deve ser "Senha redefinida com sucesso"



___________________________________________________________________________________________________



-- Feature: Perfil

Scenario 1: Requisição para visualizar o perfil com sucesso
Given: O usuário de id = 1 está autenticado com o token de autenticação válido
When: Uma requisição "GET" for enviada para /user/profile/1
Then: O status da resposta deve ser "200"
And: O servidor retorna os dados do perfil do usuário
And: O JSON da resposta deve conter os dados: nome, nome de usuário, email, biografia, foto, etc.

Scenario 2: Requisição para editar o perfil com sucesso
Given: O usuário de id = 1 está autenticado com o token de autenticação válido
When: Uma requisição "PUT" for enviada para user/profile/1 com os dados:
nome: "Alice Peruniz Oliveira"
nome de usuário: "aliceperuniz"
biografia: "Exemplo de biografia"
foto: "url_da_foto.jpg"
Then: O status da resposta deve ser "200"
And: O servidor atualiza os dados do perfil do usuário de id = 1
And: A mensagem deve ser "Perfil atualizado com sucesso"

Scenario 3: Requisição para editar o perfil com dados ausentes
Given: O usuário de id = 1 está autenticado com o token de autenticação válido
When: Uma requisição "PUT" for enviada para user/profile/1 com os dados:
nome: "Alice Peruniz"
nome de usuário: "aliceperuniz"
biografia:
Then: O status da resposta deve ser "400"
And: A mensagem deve ser "Biografia é um campo obrigatório"

Scenario 4: Requisição para editar o perfil com formato de foto inválido
Given: O usuário de id = 1 está autenticado com o token de autenticação válido
When: Uma requisição "PUT" for enviada para user/profile/1 com os dados:
nome: "Alice Peruniz"
nome de usuário: "aliceperuniz"
foto: "foto_invalida.txt"
Then: O status da resposta deve ser "400"
And: A mensagem deve ser "Formato de foto inválido"

Scenario 5: Requisição para tentar visualizar o perfil sem autenticação
Given: O usuário não está autenticado
When: Uma requisição "GET" for enviada para user/profile/1
Then: O status da resposta deve ser "401"
And: A mensagem deve ser "Autenticação necessária"
