from pytest_bdd import given, parsers, scenarios, then, when


# Cenários carregados do arquivo `posts.feature`
scenarios("../features/post.feature")

# ------------------------ Cenário 1: Postagem válida ---------------------------
@given(parsers.parse('O usuário "{user_name}" existe na plataforma Twibbles'))
def user_exists(context, user_name):
    # Criar ou garantir que o usuário existe no banco de dados
    context["user_name"] = user_name
    context["user_id"] = 1  # Exemplo de ID de usuário

@given(parsers.parse('João Silva tem o ID {user_id}'))
def user_id(context, user_id):
    context["user_id"] = int(user_id)

@when(parsers.parse('João Silva cria uma postagem com o texto "{post_text}"'))
def create_post(context, post_text, user_id, client):
    response = client.post(f"post/{user_id}/posts/{post_text}")
    context["response"] = response.json()

@then(parsers.parse('O sistema retorna status {expected_status} com a mensagem "{expected_message}"'))
def check_status(context, expected_status, expected_message):
    print(context["response"])
    assert context["response"].get("status_code") == int(expected_status)


# ------------------------ Cenário 2: Postagem com texto excedendo 280 caracteres ---------------------------
@given(parsers.parse('O usuário "{user_name}" existe na plataforma Twibbles'))
def user_exists_invalid(context, user_name):
    # Criar ou garantir que o usuário existe no banco de dados
    context["user_name"] = user_name
    context["user_id"] = 3  # Exemplo de ID de usuário

@given(parsers.parse('Carlos Souza tem o ID {user_id}'))
def user_id_invalid(context, user_id):
    context["user_id"] = int(user_id)

@when(parsers.parse('Carlos Souza cria uma postagem com o texto "{post_text}"'))
def create_invalid_post(context, post_text, client):
    response = client.post(f"/3/posts", json={"text": post_text})
    context["response"] = response

@then(parsers.parse('O sistema retorna status {expected_status} com a mensagem "{expected_message}"'))
def check_invalid_post_status(context, expected_status, expected_message):
    assert context["response"].status_code == int(expected_status)
    assert context["response"].json().get("message") == expected_message


# ------------------------ Cenário 3: Postagem com texto composto apenas por espaços ---------------------------
@given(parsers.parse('O usuário "{user_name}" existe na plataforma Twibbles'))
def user_exists_empty(context, user_name):
    # Criar ou garantir que o usuário existe no banco de dados
    context["user_name"] = user_name
    context["user_id"] = 5  # Exemplo de ID de usuário

@given(parsers.parse('Fernando Lima tem o ID {user_id}'))
def user_id_empty(context, user_id):
    context["user_id"] = int(user_id)

@when(parsers.parse('Fernando Lima cria uma postagem com o texto "{post_text}"'))
def create_empty_post(context, post_text, client):
    response = client.post(f"/5/posts", json={"text": post_text})
    context["response"] = response

@then(parsers.parse('O sistema retorna status {expected_status} com a mensagem "{expected_message}"'))
def check_empty_post_status(context, expected_status, expected_message):
    assert context["response"].status_code == int(expected_status)
    assert context["response"].json().get("message") == expected_message


