Feature: Estatísticas de desempenho

As a usuário eu quero poder ter acesso às
métricas do meu perfil(comentários, seguidores, seguindo)
em um dashboard ao longo do tempo(ano, mês, semana)

# Acesso ao dashboard pela primeira vez
Scenario: Acesso ao dashboard pela primeira vez
Given O usuário está logado como "João Henrique"
And Nenhum filtro para a exibição de postagens está selecionado
When O usuário acessa a página "Estatísticas de desempenho"
Then Uma mensagem é exibida na tela: "Selecione a métrica e o período desejados"

# Acesso ao dashboard pela primeira vez + seleção de um único filtro(categoria)
Scenario: Acesso ao dashboard pela primeira vez + seleção de um único filtro(categoria);
Given O usuário está logado como "João Henrique"
And Nenhum filtro para a exibição de postagens está selecionado
When O usuário acessa a página "Estatísticas de desempenho"
And O usuário seleciona a categoria "Seguidores" como estatística a ser exibida 
Then Um dashboard vazio é exibido para o usuário na página "Estatísticas de desempenho"

# Acesso ao dashboard pela primeira vez + seleção de um único filtro(tempo)
Scenario: Acesso ao dashboard pela primeira vez + seleção de um único filtro(tempo)
Given O usuário está logado como "João Henrique"
And Nenhum filtro para a exibição de postagens está selecionado
When O usuário acessa a página "Estatísticas de desempenho"
And O usuário seleciona a categoria "Último mês" como intervalo de tempo considerado
Then Um dashboard vazio é exibido para o usuário na página "Estatísticas de desempenho"

# Acesso ao dashboard a partir da segunda vez
Scenario: Acesso ao dashboard a partir da segunda vez
Given O usuário está logado como "João Henrique"
And O filtro selecionado para a estatística a ser exibida é "Seguindo" 
And O filtro selecionado para a categoria intervalo de tempo considerado é "Último mês"
When O usuário acessa a página "Estatísticas de desempenho"
Then Um dashboard representando a variação da quantidade de "Seguindo" ao longo do "Último mês" é exibido na página "Estatísticas de desempenho"

# Visualização do número de {seguidores, seguindo, comentários} do usuário ao longo de {semana, mês, ano}
Scenario: Visualização do número de seguidores do usuário ao longo de um mês
Given O usuário está logado como "João Henrique" na página "Estatísticas de desempenho"
When O usuário seleciona a categoria "Seguidores" como estatística a ser exibida 
And O usuário seleciona a categoria "Último mês" como intervalo de tempo considerado
Then Um dashboard representando a variação da quantidade de "Seguidores" ao longo do "Último mês" é exibido na página "Estatísticas de desempenho"

# Requisição bem-sucedida para obter dados do gráfico
Scenario: Requisição bem-sucedida para obter dados do gráfico
Given O usuário está logado como "João Henrique"
And O filtro selecionado para a estatística a ser exibida é "Seguidores" 
And O filtro selecionado para a categoria intervalo de tempo considerado é "Último mês"
And existem interações registradas nas postagens desse usuário
When o sistema recebe uma requisição GET "/user/{João Henrique}/dashboard?period=last30days&metric=followers"
Then o sistema retorna uma resposta contendo o número de "Seguidores" do usuário ao longo do "Último mês"
And o status da resposta é 200 OK










