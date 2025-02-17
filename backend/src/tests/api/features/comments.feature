Feature: Comentários em um Post

# Service
Scenario: Listar comentários de um post
  Given existe um post com id "123" e texto "Post sobre FastAPI" 1
  And existe um comentário com id "10", user_id "709", post_id "123" e content "coment" 1
  When uma requisição GET for enviada para "/comments/123" 1
  Then o status da resposta deve ser "200" 1
  And o JSON da resposta deve ser uma lista de comentários 1
  And o comentário com comment_id "10" e user_id "709" deve estar na lista 1

Scenario: Criar um novo comentário em um post
  Given existe um post com id "123" 2
  And existe um usuário com id "709" 2
  When uma requisição POST for enviada para "/comments/user/709/post/123" com o body "{"content": "Ótimo post, parabéns!"}" 2
  Then o status da resposta deve ser "201" 2
  And o JSON da resposta deve conter os dados do novo comentário com user_id 709, post_id 123 e content "Ótimo post, parabéns" 2

Scenario: Tentativa de deletar um comentário que não pertence ao usuário
  Given existe um post com id "456" 3
  And existe um comentário com comment_id "10", user_id "709", content "Meu comentário" 3
  And o comentário pertence ao post "456" 3
  When uma requisição DELETE for enviada para "comments/user/024/comment/10" 3
  Then o status da resposta deve ser "403" 3
  And o JSON da resposta deve conter a mensagem "You are not authorized to delete this comment" 3

Scenario: Usuário deleta seu próprio comentário
  Given existe um post com id "456" 4
  And existe um comentário com comment_id "10", user_id "709" e content "Meu comentário" 4
  And o comentário pertence ao post "456" 4
  When uma requisição DELETE for enviada para "comments/user/709/comment/10" 4
  Then o status da resposta deve ser "200" 4
  And a mensagem "Comment deleted successfully" deve ser retornada 4
  And o comentário com comment_id "10" não deve mais existir no sistema 4
