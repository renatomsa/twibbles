Feature: Histórico de postagens do usuário

As a usuário eu quero poder acessar o meu histórico de postagens, 
visualizar as postagens ordenadas de acordo com alguns filtros e excluir
postagens

Scenario: Navegação ao histórico de postagens de outros usuários
Given O ususário está logado como "João Henrique" na página "Perfil alheio" de "Kim Kardashian"
And  "Kim Kardashian" possui as postagens “p1”, da data “22/01/2020”, “p2” da data “19/04/2021” e “p3” da data “27/08/2014”.
When O usuário acessa a página "Perfil alheio" de "Kim Kardashian"
Then “p3” é exibida abaixo de “p2”, que é exibida abaixo de “p2”.

Scenario: Acesso ao histórico de postagens de outro usuário quando não há postagens
Given O usuário está logado como "João Henrique"
And  "Kim Kardashian" possui as postagens “p1”, da data “22/01/2020”, “p2” da data “19/04/2021” e “p3” da data “27/08/2014”.
And   "Kim Kardashian" é seguida por "João Henrique" 
When O usuário acessa a página "Perfil alheio" de "Kim Kardashian"
Then A seguinte mensagem é exibida : "O usuário não possui postagens".

# Acesso ao histórico de postagens de outros usuários quando o usuário não 
Scenario: Acesso ao histórico de postagens de outro usuário
Given O usuário está logado como "João Henrique"
And  "Kim Kardashian" possui as postagens “p1”, da data “22/01/2020”, “p2” da data “19/04/2021” e “p3” da data “27/08/2014”.
And   "Kim Kardashian" é seguida por "João Henrique" 
When O usuário acessa a página "Perfil alheio" de "Kim Kardashian"
Then “p3” é exibida abaixo de “p2”, que é exibida abaixo de “p2”.



Scenario: Acesso ao histórico de postagens do usuário quando há postagens
Given O usuário está logado como "João Henrique"
And O usuário possui as postagens “p1”, da  data “22/02/2022”, “p2” da data “19/05/2024” e "p3" da data "20/11/2001".
When O usuário acessa a página "Histórico de postagens"
Then “p1” é exibida abaixo de “p2”.
And "p3" não é exibida 

Scenario: Acesso ao histórico de postagens do usuário quando não há postagens
Given O usuário está logado como "João Henrique"
And  O usuário não possui postagens
When O usuário acessa a página "Histórico de postagens"
Then A seguinte mensagem é exibida : "Você ainda não possui postagens"

Scenario: Visualização das postagens próprias ordenadas de acordo com o número de comentários
Given  O usuário está logado como "João Henrique" na página "Histórico de postagens"
And O usuário possui as postagens “p1”, com "30" comentários, “p2” com “100” comentários e “p3” com “75” comentários.
When O usuário seleciona o filtro "Mais comentadas" pra exibição das postagens.
Then A postagem "p3" é exibida abaixo da postagem "p2".

Scenario: Exclusão de uma postagem (interface)
Given  O usuário está logado como "João Henrique" na página "Histórico de postagens"
And  O usuário possui a postagem "p1"
When O usuário tenta excluir a postagem "p1"
Then A postagem "p1" não é mais exibida na página "Histórico de postagens"
And A seguinte mensagem é exibida na tela : "Postagem foi excluída com sucesso"

Scenario: Exclusão de uma postagem (serviço)
Given O sistema possui a postagem "p1" criada pelo usuário "João Henrique"
And O usuário "João Henrique" está logado
When O usuário envia uma requisição DELETE para a rota "user/João Henrique/posts/p1"
Then O sistema não possui a postagem "p1" criada pelo usuário "João Henrique"
And A seguinte resposta é enviada pelo sistema para o usuário : "Postagem foi excluída com sucesso"

Scenario: Navegação pelo histórico de postagens com scroll infinito
Given O usuário está logado como "João Henrique" na página "Histórico de postagens"
And O usuário possui a postagens "p1" com data "22/05/2028", "p2" com data "18/12/2018", "p3" com data "10/01/2013" e "p4" com data "12/12/2012".
And As postagens "p1" e "p2" são exibidas
And O filtro selecionado para a exibição das postagens é "Mais recentes".
When O usuário desliza até o final da página
Then As postagens "p3" e "p4" são exibidas
And As postagens "p1" e "p2" não são exibidas