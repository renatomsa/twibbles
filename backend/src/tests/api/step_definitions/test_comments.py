from pytest_bdd import given, when, then, parsers, scenarios
import json

# Carrega os cenários do arquivo de features de comentários
scenarios('../features/comments.feature')

# -----------------------------------------------------------------------------
# Cenário: Listar comentários de um post
# -----------------------------------------------------------------------------
@given(parsers.parse('existe um post com id "{post_id}" e texto "{post_text}" 1'))
def ensure_post_exists(context, post_id, post_text):
    # Aqui você deve inserir ou simular o post no banco de dados
    context["post"] = {"id": post_id, "text": post_text}
    # Exemplo: session.add(Post(id=int(post_id), text=post_text)); session.commit()

@given(parsers.parse('existe um comentário com id "{comment_id}", user_id "{user_id}", post_id "{comment_post_id}" e content "{content}" 1'))
def ensure_comment_exists(context, comment_id, user_id, comment_post_id, content):
    # Aqui você deve inserir ou simular o comentário no banco de dados
    context["comment"] = {
        "comment_id": comment_id,
        "user_id": user_id,
        "post_id": comment_post_id,
        "content": content
    }
    # Exemplo: session.add(Comment(id=int(comment_id), user_id=int(user_id), post_id=int(comment_post_id), content=content)); session.commit()

@when(parsers.parse('uma requisição GET for enviada para "{endpoint}" 1'))
def send_get_request(context, endpoint, client):
    response = client.get(endpoint)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 1'))
def check_status(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('o JSON da resposta deve ser uma lista de comentários 1'))
def check_response_is_list(context):
    data = context["response"].get("data")
    assert isinstance(data, list), f"Esperava que 'data' fosse uma lista, mas foi {type(data)}"

@then(parsers.parse('o comentário com comment_id "{expected_comment_id}" e user_id "{expected_user_id}" deve estar na lista 1'))
def check_comment_in_list(context, expected_comment_id, expected_user_id):
    expected_comment_id = int(expected_comment_id)
    expected_user_id = int(expected_user_id)
    comments = context["response"].get("data", [])
    found = any(
        int(c.get("id", -1)) == expected_comment_id and int(c.get("user_id", -1)) == expected_user_id
        for c in comments
    )
    assert found, f"Comentário com comment_id '{expected_comment_id}' e user_id '{expected_user_id}' não encontrado na lista"

# -----------------------------------------------------------------------------
# Cenário: Criar um novo comentário em um post
# -----------------------------------------------------------------------------

@given(parsers.parse('existe um post com id "{post_id}" 2'))
def ensure_post_exists_no_text(context, post_id):
    # Insere ou simula o post (sem precisar de texto, se não especificado)
    context["post"] = {"id": post_id}

@given(parsers.parse('existe um usuário com id "{user_id}" 2'))
def ensure_user_exists(context, user_id):
    # Insere ou simula o usuário no banco de dados
    context["user"] = {"id": user_id}

@when(parsers.parse('uma requisição POST for enviada para "{endpoint}" com o body "{body}" 2'))
def send_post_request(context, endpoint, body, client):
    # Converte o body (string JSON) para dicionário
    json_body = json.loads(body)
    print(f"JSON: {json_body}")
    response = client.post(endpoint, json=json_body)
    print(f"resposta: {response}")
    context["response"] = response.json()
    print(f"RESPONSEEE: {context}")

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 2'))
def check_post_status(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('o JSON da resposta deve conter os dados do novo comentário com user_id {user_id}, post_id {post_id} e content "{expected_content}" 2'))
def check_new_comment_data(context, user_id, post_id, expected_content):
    data = context["response"].get("data")
    assert isinstance(data, dict), "Esperava que os dados do novo comentário fossem um dicionário"
    assert int(data.get("user_id", -1)) == int(user_id), f"Para 'user_id' esperava {user_id}, mas obteve {data.get('user_id')}"
    assert int(data.get("post_id", -1)) == int(post_id), f"Para 'post_id' esperava {post_id}, mas obteve {data.get('post_id')}"
    assert data.get("content") == expected_content, f"Para 'content' esperava '{expected_content}', mas obteve '{data.get('content')}'"

# -----------------------------------------------------------------------------
# Cenário: Tentativa de deletar um comentário que não pertence ao usuário
# -----------------------------------------------------------------------------

@given(parsers.parse('existe um post com id "{post_id}"'))
def ensure_post_for_delete(context, post_id):
    context["post"] = {"id": post_id}

@given(parsers.parse('existe um comentário com comment_id "{comment_id}", user_id "{comment_user_id}", content "{content}"'))
def ensure_comment_for_delete(context, comment_id, comment_user_id, content):
    context["existing_comment"] = {
        "comment_id": comment_id,
        "user_id": comment_user_id,
        "content": content
    }

@given(parsers.parse('o comentário pertence ao post "{post_id}"'))
def ensure_comment_belongs_to_post(context, post_id):
    if "existing_comment" in context:
        context["existing_comment"]["post_id"] = post_id

@when(parsers.parse('uma requisição DELETE for enviada para "{endpoint}"'))
def send_delete_request(context, endpoint, client):
    response = client.delete(endpoint)
    context["response"] = response.json()

@then(parsers.parse('o JSON da resposta deve conter a mensagem "{expected_message}"'))
def check_delete_message(context, expected_message):
    actual_message = context["response"].get("message")
    assert actual_message == expected_message, f"Esperava mensagem '{expected_message}', mas obteve '{actual_message}'"

# -----------------------------------------------------------------------------
# Cenário: Usuário deleta seu próprio comentário
# -----------------------------------------------------------------------------

@given(parsers.parse('existe um comentário com comment_id "{comment_id}", user_id "{user_id}" e content "{content}"'))
def ensure_own_comment_exists(context, comment_id, user_id, content):
    context["existing_comment"] = {
        "comment_id": comment_id,
        "user_id": user_id,
        "content": content
    }

@then(parsers.parse('a mensagem "{expected_message}" deve ser retornada'))
def check_success_message(context, expected_message):
    actual_message = context["response"].get("message")
    assert actual_message == expected_message, f"Esperava mensagem '{expected_message}', mas obteve '{actual_message}'"

@then(parsers.parse('o comentário com comment_id "{comment_id}" não deve mais existir no sistema'))
def check_comment_deleted(context, comment_id, client):
    # Aqui, assumimos que existe um endpoint para buscar o comentário por ID.
    response = client.get(f"/comments/{comment_id}")
    assert response.status_code == 404 or not response.json().get("data"), f"O comentário com id {comment_id} ainda existe"
