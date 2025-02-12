Feature: Cadastro e manutenção de promoções

    Restaurantes e administradores poderão cadastrar, remover ou atualizar promoções (cupons),
    e usuários (clientes) poderão inserir e remover cupons de seus pedidos.

Scenario: inserção de cupom em pedido bem-sucedida
Given o usuário "Mileto" está na página de finalização de pedido com o valor total de "R$40,00"
And o cupom "10OFF" está ativo, possui um valor mínimo de "R$20,00" e um desconto de "0.1"
And o pedido atual não tem cupons aplicados
When o usuário "Mileto" tenta inserir o cupom "10OFF" no pedido atual
Then o cupom "10OFF" é aplicado com sucesso
And o valor do pedido atual é atualizado para "R$36,00"

Scenario: inserção de cupom em pedido que não atingiu o valor mínimo
Given o usuário "Tales" está na página de finalização de pedido com o valor total de "R$10,00"
And o cupom "10OFF" está ativo, possui um valor mínimo de "R$20,00" e um desconto de "0.1"
When o usuário "Tales" tenta inserir o cupom "10OFF" no pedido atual
Then o cupom "10OFF" é recusado
And uma mensagem de erro é exibida indicando que o valor do pedido atual não atingiu o mínimo para aplicação do cupom "10OFF"
And o valor do pedido atual se mantém "R$10,00"

Scenario: inserção de cupom inativo em um pedido
Given o usuário "Pedro" está na página de finalização de pedido com o valor total de "R$100,00"
And o cupom "PIZZAEMDOBRO" está inativo
When o usuário "Pedro" tenta inserir o cupom "PIZZAEMDOBRO" no pedido atual
Then o cupom "PIZZAEMDOBRO" é recusado
And uma mensagem de erro é exibida indicando que o cupom "PIZZAEMDOBRO" se encontra inválido
And o valor do pedido atual se mantém "R$100,00"

Scenario: remoção de cupom bem sucedida por restaurante
Given o restaurante "Mequi" está na página de listagem de cupons
And o cupom de código "2BIGMEQUIPOR1" está cadastrado
When o restaurante "Mequi" tenta excluir o cupom "2BIGMEQUIPOR1"
Then o cupom "2BIGMEQUIPOR1" é removido das promoções com sucesso
And o cupom "2BIGMEQUIPOR1" não aparece mais na página de listagem de cupons

Scenario: inserção de cupom de primeira compra já utilizado
Given o usuário "Mileto" está na página de finalização de pedido com o valor total de "R$40,00"
And o usuário "Mileto" já utilizou o cupom "PRIMEIRACOMPRA"
And o pedido atual não tem cupons aplicados
When o usuário "Mileto" tenta inserir o cupom "PRIMEIRACOMPRA" no pedido atual
Then o cupom "PRIMEIRACOMPRA" é recusado
And uma mensagem de erro é exibida indicando que o cupom "PRIMEIRACOMPRA" já foi utilizado

Scenario: atualização de cupom bem sucedida pelo restaurante
Given o restaurante "Mequi" está na página de listagem de cupons
And o cupom "2BIGMEQUIPOR1" está cadastrado com status "Inativo"
When o restaurante "Mequi" tenta atualizar o cupom "2BIGMEQUIPOR1" para ter status "Ativo"
Then o cupom "2BIGMEQUIPOR1" é atualizado

Scenario: cadastro de cupom bem-sucedido por administrador
Given o administrador "Malu" está na página de cadastro de cupom
And o cupom de código "PRIMEIRACOMPRA" não está cadastrado
When o administrador "Malu" tenta cadastrar o cupom "PRIMEIRACOMPRA" e um desconto de "0.2" com valor mínimo de "R$30,00" com status "Ativo"
Then o cupom "PRIMEIRACOMPRA" é cadastrado

Scenario: cadastro de cupom malsucedido pelo restaurante
Given o restaurante "Mequi" está na página de cadastro de cupom
And o cupom de código "2BIGMEQUIPOR1" não está cadastrado
When o restaurante "Mequi" tenta cadastrar o cupom "2BIGMEQUIPOR1" e um desconto de "1.5" com valor mínimo "R$20,00", associado ao produto "Big Méqui" com status "Inativo"
Then o cupom "2BIGMEQUIPOR1" não é cadastrado

Scenario: cadastro de cupom bem-sucedido pelo restaurante
Given o restaurante "Mequi" está na página de cadastro de cupom
And o cupom de código "2BIGMEQUIPOR1" não está cadastrado
When o restaurante "Mequi" tenta cadastrar o cupom "2BIGMEQUIPOR1" e um desconto de "0.2" com valor mínimo "R$20,00", associado ao produto "Big Méqui" com status "Inativo"
Then o cupom "2BIGMEQUIPOR1" é cadastrado

Scenario: inserção de cupom inexistente em um pedido
Given o usuário "Gabriel" está na página de finalização de pedido com o valor total de "R$100,00"
And o cupom "PIZZA20" não está cadastrado
When o usuário "Gabriel" tenta inserir o cupom "PIZZA20" no pedido atual
Then o cupom "PIZZA20" é recusado
And uma mensagem de erro é exibida indicando que o cupom "PIZZA20" não existe
And o valor do pedido atual se mantém "R$100,00"

Feature: Cadastro e manutenção de promoções

    Restaurantes e administradores poderão cadastrar, remover ou atualizar promoções (cupons),
    e usuários (clientes) poderão inserir e remover cupons de seus pedidos.

Scenario: inserção de cupom em pedido que não atingiu o valor mínimo
Given o usuário "Tales" está na página de finalização de pedido com o valor total de "R$10,00"
And o cupom "10OFF" está ativo, possui um valor mínimo de "R$20,00" e um desconto de "0.1"
When o usuário "Tales" tenta inserir o cupom "10OFF" no pedido atual
Then o cupom "10OFF" é recusado
And uma mensagem de erro é exibida indicando que o valor do pedido atual não atingiu o mínimo para aplicação do cupom "10OFF"
And o valor do pedido atual se mantém "R$10,00"
