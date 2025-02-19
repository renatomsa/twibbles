Feature: Histórico de postagens

    Scenario: Exclusão de uma postagem (serviço)
        Given O sistema possui a postagem com ID "1" criada pelo usuário com ID "7" 
        When O usuário envia uma requisição DELETE para a rota "/post/7/posts/1" 
        Then O sistema não possui a postagem "1" criada pelo usuário com ID "7" 
        And A seguinte resposta é enviada pelo sistema para o usuário : Post deleted 

     Scenario: Visualização das postagens próprias ordenadas de forma decrescente acordo com a data
         Given Existe o usuário com ID "7"
         And O usuário com ID "7" possui as postagens "2", com data "23/07/2025", "3" com data "23/07/2020" e "4" com data "10/01/2013"
         When O usuário com ID "7" solicita a primeira página de postagens com limite de "2" itens, ordenadas por mais recentes
         Then A resposta contém a postagem "2" com data "23/07/2025", seguida da postagem "3" com data "23/07/2020"

    Scenario: Visualização das postagens próprias ordenadas de forma decrescente de acordo com o número de comentários
         Given Existe o usuário com ID "7"
         And O usuário com ID "7" possui as postagens "1", com "10" comentários, "2" com "20" comentários e "3" com "15" comentários
         When O usuário com ID "7" solicita a primeira página de postagens com limite de "2" itens, ordenadas por mais comentados
         Then A resposta contém a postagem "2" com "20" comentários, seguida da postagem "3" com "15" comentários
    

    
