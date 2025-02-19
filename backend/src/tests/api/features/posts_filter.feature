Feature: Busca de Posts

  Scenario: Busca por Posts por localização
    Given existe um post com localização "São Paulo" e texto "Post em São Paulo" no banco de dados 1
    When uma requisição GET for enviada para "/post/location?location=São+Paulo" 1
    Then o status da resposta deve ser "200" 1
    And o corpo da resposta deve conter o post com texto "Post em São Paulo" 1

  Scenario: Busca por Posts por hashtag
    Given existe um post com hashtag "#viagem" e texto "Post de viagem" no banco de dados 2
    When uma requisição GET for enviada para "/post/hashtag?hashtag=viagem" 2
    Then o status da resposta deve ser "200" 2
    And o corpo da resposta deve conter o post com texto "Post de viagem" 2
