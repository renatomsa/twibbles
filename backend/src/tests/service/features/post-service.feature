# Cenário 1
Scenario: Usuário não segue ninguém
    Given O usuário "João Silva" existe na plataforma Twibbles
    And João Silva não segue ninguém
    When João Silva acessa seu feed
    Then O sistema retorna status 200 com a mensagem "User does not follow anyone"
    And O feed de João Silva está vazio

# Cenário 2
Scenario: Nenhuma postagem encontrada para os usuários seguidos
    Given O usuário "Maria Oliveira" existe na plataforma Twibbles
    And Maria Oliveira segue os usuários "Carlos Souza" e "Ana Pereira"
    And Nenhum dos usuários seguidos possui postagens publicadas
    When Maria Oliveira acessa seu feed
    Then O sistema retorna status 404 com a mensagem "No posts were found"
    And O feed de Maria Oliveira está vazio

# Cenário 3
Scenario: Postagens encontradas para os usuários seguidos
    Given O usuário "Carlos Souza" existe na plataforma Twibbles
    And Carlos Souza segue os usuários "João Silva" e "Ana Pereira"
    And João Silva tem 3 postagens publicadas e Ana Pereira tem 2 postagens publicadas
    When Carlos Souza acessa seu feed
    Then O sistema retorna status 200 com a mensagem "Posts found"
    And O feed de Carlos Souza contém 5 postagens de João Silva e Ana Pereira, ordenadas por data

# Cenário 4
Scenario: Recarregar o feed após novo post de alguém que o usuário segue
    Given O usuário "Juliana Almeida" existe na plataforma Twibbles
    And Juliana Almeida segue os usuários "Lucas Silva" e "Patrícia Costa"
    And Lucas Silva tem 2 postagens publicadas e Patrícia Costa tem 1 postagem publicada
    When Juliana Almeida acessa seu feed pela primeira vez
    Then O sistema retorna status 200 com a mensagem "Posts found"
    And O feed de Juliana Almeida contém 3 postagens (2 de Lucas Silva e 1 de Patrícia Costa)
    When Lucas Silva publica uma nova postagem com o texto "Novo post!"
    And Juliana Almeida recarrega seu feed
    Then O sistema retorna status 200 com a mensagem "Posts found"
    And O feed de Juliana Almeida agora contém 4 postagens (3 de Lucas Silva e 1 de Patrícia Costa)

# Cenário 5
Scenario: Recarregar o feed após um usuário deletar uma postagem
    Given O usuário "Marcos Pereira" existe na plataforma Twibbles
    And Marcos Pereira segue os usuários "Joana Silva" e "Ricardo Lima"
    And Joana Silva tem 3 postagens publicadas e Ricardo Lima tem 2 postagens publicadas
    When Marcos Pereira acessa seu feed pela primeira vez
    Then O sistema retorna status 200 com a mensagem "Posts found"
    And O feed de Marcos Pereira contém 5 postagens (3 de Joana Silva e 2 de Ricardo Lima)
    When Joana Silva deleta uma de suas postagens
    And Marcos Pereira recarrega seu feed
    Then O sistema retorna status 200 com a mensagem "Posts found"
    And O feed de Marcos Pereira agora contém 4 postagens (2 de Joana Silva e 2 de Ricardo Lima)

# Cenário 6
Scenario: Postagem criada com sucesso com texto válido dentro do limite de 280 caracteres
    Given O usuário "João Silva" existe na plataforma Twibbles
    And João Silva tem o ID 1
    When João Silva cria uma postagem com o texto "Este é um texto válido dentro do limite de 280 caracteres."
    Then O sistema retorna status 201 com a mensagem "Post created"
    And A postagem "Este é um texto válido dentro do limite de 280 caracteres." é salva no banco de dados

# Cenário 7
Scenario: Usuário não existe
    Given O usuário com ID 5 não existe na plataforma Twibbles
    When Maria Oliveira cria uma postagem com o texto válido "Hello!"
    Then O sistema retorna status 404 com a mensagem "User not found"
    And Nenhuma postagem é salva no banco de dados

# Cenário 8
Scenario: Falha ao criar postagem com texto excedendo 280 caracteres
    Given O usuário "Carlos Souza" existe na plataforma Twibbles
    And Carlos Souza tem o ID 3
    When Carlos Souza cria uma postagem com o texto "A" repetido 281 vezes
    Then O sistema retorna status 400 com a mensagem "Post text cannot exceed 280 characters"
    And Nenhuma postagem é salva no banco de dados

# Cenário 9
Scenario: Postagem criada com sucesso com texto contendo espaços em branco no início e no fim
    Given O usuário "Ana Pereira" existe na plataforma Twibbles
    And Ana Pereira tem o ID 4
    When Ana Pereira cria uma postagem com o texto "   Este é um texto com espaços antes e depois   "
    Then O sistema retorna status 201 com a mensagem "Post created"
    And A postagem "Este é um texto com espaços antes e depois" é salva no banco de dados

# Cenário 10
Scenario: Falha ao criar postagem com texto composto apenas por espaços
    Given O usuário "Fernando Lima" existe na plataforma Twibbles
    And Fernando Lima tem o ID 5
    When Fernando Lima cria uma postagem com o texto "        " (somente espaços)
    Then O sistema retorna status 400 com a mensagem "Post text cannot be empty"
    And Nenhuma postagem é salva no banco de dados

