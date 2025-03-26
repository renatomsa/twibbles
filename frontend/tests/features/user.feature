# language: pt

    Funcionalidade: Feed do Usuário
        Como um usuário do sistema
        Quero visualizar e interagir com meu feed de posts
        Para me manter conectado com outros usuários

    Contexto:
        Dado que estou logado no sistema
        E estou na página do feed

    Cenário: Visualizar feed vazio
        Dado que não existem posts no meu feed
        Quando a página carregar
        Então devo ver a mensagem "No posts in your feed. Follow users to see their posts!"

    Cenário: Visualizar posts no feed
        Dado que existem posts no meu feed
        Quando a página carregar
        Então devo ver a lista de posts
        E cada post deve conter o nome do usuário
        E cada post deve conter o texto do post

    Cenário: Criar novo post
        Dado que estou no feed
        Quando clico no botão de criar post
        E o formulário de criação é exibido
        E preencho o texto do post "Meu novo post de teste"
        E clico em publicar
        Então o novo post deve aparecer no topo do feed
        E o formulário de criação deve ser fechado

    Cenário: Erro ao carregar feed
        Dado que ocorreu um erro ao carregar o feed
        Quando a página carregar
        Então devo ver a mensagem de erro "Failed to load feed. Please try again."

    Cenário: Erro ao criar post
        Dado que estou com o formulário de criação aberto
        Quando preencho o texto do post "Post com erro"
        E ocorre um erro ao tentar publicar
        Então devo ver a mensagem de erro "Failed to create post. Please try again."

    Cenário: Carregar dados do usuário
        Dado que estou logado com o ID "709"
        Quando a página carregar
        Então devo ver meu nome de usuário no cabeçalho
        E meus dados de perfil devem ser carregados corretamente