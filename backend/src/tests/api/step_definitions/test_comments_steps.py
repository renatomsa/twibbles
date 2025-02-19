from pytest_bdd import given, when, then, parsers, scenarios

scenarios('../features/comments.feature')

# -----------------------------------------
# Scenario 1: Visualização de Comentários em uma postagem
# -----------------------------------------
@given(parsers.parse('existe um post de id {post_id:d} criado pelo usuário de nome "{user_name}" e id {user_id:d} 1'))
def given_post_1(context, post_id, user_name, user_id):
    context["post_id"] = post_id
    context["post_user_name"] = user_name
    context["post_user_id"] = user_id

@given(parsers.parse('nesse post existe um comentário de id {comment_id:d} criado pelo usuário de nome "{comment_user_name}" e id {comment_user_id:d} com conteúdo igual a "{comment_content}" 1'))
def given_comment_1(context, comment_id, comment_user_id, comment_content):
    # post_id = context["post_id"]
    # payload = {
    #     "content": comment_content,
    #     "user_id": comment_user_id,
    #     "post_id": post_id
    # }
    context["content"] = comment_content,
    context["user_id"] = comment_user_id,
    context["comment_id"] = comment_id
    # response = client.post(f"/comments/user/{comment_user_id}/post/{post_id}", json=payload)
    # response_data = response.json()
    # # Armazena os comentários criados em um dicionário no contexto
    # if "comments" not in context:
    #     context["comments"] = {}
    # context["comments"][comment_id] = response_data["data"]

@when(parsers.parse('uma requisição GET for enviada para "{endpoint}" 1'))
def send_get_request_1(context, endpoint, client):
    response = client.get(endpoint)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 1'))
def check_status_1(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('o corpo da resposta deve ser uma lista de comentários 1'))
def check_body_is_list(context):
    data = context["response"].get("data")
    assert isinstance(data, list), f"Esperava uma lista, mas obteve {type(data)}"

@then(parsers.parse('o comentário de id {comment_id:d} criado pelo usuário de nome "{comment_user_name}" e id {comment_user_id:d} com conteúdo igual a "{comment_content}" deve estar na lista 1'))
def check_comment_in_list(context, comment_id, comment_user_name, comment_user_id, comment_content):
    data = context["response"].get("data", [])
    found = any(
        comment.get("id") == comment_id and
        comment.get("user_id") == comment_user_id and
        comment.get("content") == comment_content
        for comment in data
    )
    assert found, f"Comentário com id {comment_id}, user_id {comment_user_id} e conteúdo '{comment_content}' não encontrado na lista"

# -----------------------------------------
# Scenario 2: Criação de comentário por um usuário em um post existente
# -----------------------------------------
@given(parsers.parse('existe um usuário de id {user_id:d} com nome "{user_name}" 2'))
def given_user_2(context, user_id, user_name):
    context["user_id"] = user_id
    context["user_name"] = user_name

@given(parsers.parse('existe um post de id {post_id:d} criado pelo usuário de id {user_id:d} 2'))
def given_post_2(context, post_id):
    context["post_id"] = post_id

@when(parsers.parse('uma requisição POST for enviada para "{endpoint}" com o corpo contendo o comentário "{comment_text}" 2'))
def send_post_request_2(context, endpoint, comment_text, client):
    user_id = context["user_id"]
    post_id = context["post_id"]
    payload = {"content": comment_text, "user_id": user_id, "post_id": post_id}
    response = client.post(endpoint, json=payload)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 2'))
def check_status_2(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Esperado status {expected_status}, obtido {actual_status}"

@then(parsers.parse('o corpo da resposta deve conter um comentário com conteúdo "{comment_text}" 2'))
def check_comment_content_2(context, comment_text):
    actual = context["response"]["data"][0][1]
    assert actual == comment_text, f"Esperado comentário '{comment_text}', mas obteve '{actual}'"

# -----------------------------------------
# Scenario 3: Criação de comentário em um post que não existe
# -----------------------------------------
@given(parsers.parse('existe um usuário de id {user_id:d} com nome "{user_name}" 3'))
def given_user_3(context, user_id, user_name):
    context["user_id"] = user_id
    context["user_name"] = user_name

@given(parsers.parse('não existe um post de id {post_id:d} 3'))
def given_nonexistent_post_3(context, post_id):
    context["post_id"] = post_id

@when(parsers.parse('uma requisição POST for enviada para "{endpoint}" com o corpo contendo o comentário "{comment_text}" 3'))
def send_post_request_3(context, endpoint, comment_text, client):
    user_id = context["user_id"]
    post_id = context["post_id"]
    payload = {"content": comment_text, "user_id": user_id, "post_id": post_id}
    response = client.post(endpoint, json=payload)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 3'))
def check_status_3(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Esperado status {expected_status}, obtido {actual_status}"

@then(parsers.parse('a mensagem da resposta deve ser "{expected_message}" 3'))
def check_message_3(context, expected_message):
    actual_message = context["response"].get("message")
    assert actual_message == expected_message, f"Esperado mensagem '{expected_message}', mas obteve '{actual_message}'"

# -----------------------------------------
# Scenario 4: Deleção de um comentário
# -----------------------------------------
@given(parsers.parse('existe um usuário de id {user_id:d} com nome "{user_name}" 4'))
def given_user_4(context, user_id, user_name):
    context["user_id"] = user_id
    context["user_name"] = user_name

@given(parsers.parse('existe um comentário de id {comment_id:d} criado pelo usuário de id {user_id:d} no post de id {post_id:d} com conteúdo "{comment_text}" 4'))
def given_own_comment_4(context, comment_id, user_id, post_id, comment_text, client):
    context["post_id"] = post_id
    context["comment_id"] = comment_id
    context["content"] = comment_text
    # payload = {"content": comment_text, "user_id": user_id, "post_id": post_id}
    # response = client.post(f"/comments/user/{user_id}/post/{post_id}", json=payload)
    # response_data = response.json()
    # # Armazena o id retornado para deleção
    # context["comment_id"] = response_data["data"]["id"]

@when(parsers.parse('uma requisição DELETE for enviada para "{endpoint}" 4'))
def send_delete_request_4(context, endpoint, client):
    response = client.delete(endpoint)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 4'))
def check_status_4(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Esperado status {expected_status}, obtido {actual_status}"

@then(parsers.parse('a mensagem da resposta deve ser "{expected_message}" 4'))
def check_message_4(context, expected_message):
    actual_message = context["response"].get("message")
    assert actual_message == expected_message, f"Esperado mensagem '{expected_message}', mas obteve '{actual_message}'"


# -----------------------------------------
# Scenario 5: Visualização de comentários em um post sem comentários
# -----------------------------------------
@given(parsers.parse('existe um post de id {post_id:d} criado pelo usuário de nome "{user_name}" e id {user_id:d} 5'))
def given_post_5(context, post_id, user_name, user_id):
    context["post_id"] = post_id
    context["post_user_name"] = user_name
    context["post_user_id"] = user_id

@given(parsers.parse('nesse post não existem comentários 5'))
def given_no_comments_5(context):
    context["no_comments"] = True

@when(parsers.parse('uma requisição GET for enviada para "{endpoint}" 5'))
def send_get_request_5(context, endpoint, client):
    response = client.get(endpoint)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 5'))
def check_status_5(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Esperado status {expected_status}, obtido {actual_status}"

@then(parsers.parse('a mensagem da resposta deve ser "{expected_message}" 5'))
def check_message_5(context, expected_message):
    actual_message = context["response"].get("message")
    assert actual_message == expected_message, f"Esperado mensagem '{expected_message}', mas obteve '{actual_message}'"
