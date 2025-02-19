Feature: Estatísticas de desempenho

  Scenario: O usuário visualiza o número de comentários ao longo dos últimos 30 dias
    Given Existe um usuário de ID "7"
    And O filtro selecionado para a categoria intervalo de tempo considerado é "30" dias
    And existem comentários registrados nas postagens desse usuário ao longo dos últimos "30" dias
    When o sistema recebe uma requisição GET "/post/7/dashboard" com parameto de período igual a "30" dias
    Then o sistema retorna uma mensagem contendo o número de comentários do usuário ao longo dos últimos "30" dias
    And o status da resposta é 200 OK

  Scenario: O usuário requisita o número de comentários e a média desse número ao longo dos últimos 30 dias sem possuir posts
    Given Existe um usuário de ID "7"
    And O filtro selecionado para a categoria intervalo de tempo considerado é "30" dias
    And Não existem comentários registrados nas postagens desse usuário ao longo dos últimos "30" dias
    When o sistema recebe uma requisição GET "/post/7/dashboard" com parâmeto de período igual a "30" dias
    Then o sistema retorna uma mensagem informando que o usuário não possui comentários ao longo dos últimos "30" dias
    And o status da resposta é 404 NOT FOUND
