Feature: Explorar posts por localização ou hashtag

Scenario: Buscar posts por localização
  Given existe um post com id "101", user_id "10", location "São Paulo" e hashtags "#python #fastapi" 1
  When uma requisição GET for enviada para "/explore/location/São%20Paulo" 1
  Then o status da resposta deve ser "200" 1
  And o JSON da resposta deve ser uma lista de posts 1
  And o post com post_id "101" e location "São Paulo" deve estar na lista 1

Scenario: Buscar posts por hashtag
  Given existe um post com id "103", user_id "12", location "Brasília" e hashtags "#python #flask" 3
  When uma requisição GET for enviada para "/explore/hashtag/python" 3
  Then o status da resposta deve ser "200" 3
  And o JSON da resposta deve ser uma lista de posts 3
  And o post com post_id "103" deve estar na lista 3
