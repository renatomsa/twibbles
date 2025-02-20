Feature: Histórico de postagens

    Scenario: Exclusão de uma postagem
        Given O sistema possui a postagem com ID "2001" criada pelo usuário com ID "2007" 
        When O usuário envia uma requisição DELETE para a rota "/post/2007/posts/2001" 
        Then O sistema não possui a postagem "2001" criada pelo usuário com ID "2007" 
        And A seguinte resposta é enviada pelo sistema para o usuário : Post deleted 

     Scenario: Visualização das postagens próprias ordenadas de forma decrescente acordo com a data
         Given Existe o usuário com ID "2007"
         And O usuário com ID "2007" possui as postagens "2002", com data "23/07/2025", "2003" com data "23/07/2020" e "2004" com data "10/01/2013"
         When O usuário com ID "2007" solicita a primeira página de postagens com limite de "2002" itens, ordenadas por mais recentes
         Then A resposta contém a postagem "2002" com data "23/07/2025", seguida da postagem "2003" com data "23/07/2020"

    Scenario: Visualização das postagens próprias ordenadas de forma decrescente de acordo com o número de comentários
         Given Existe o usuário com ID "2007"
         And O usuário com ID "2007" possui as postagens "2001", com "10" comentários, "2002" com "20" comentários e "2003" com "15" comentários
         When O usuário com ID "2007" solicita a primeira página de postagens com limite de "2" itens, ordenadas por mais comentados
         Then A resposta contém a postagem "2002" com "20" comentários, seguida da postagem "2003" com "15" comentários
    

    
