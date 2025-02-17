from pytest_bdd import given, when, then, parsers, scenarios

# Carrega todos os cenários do arquivo de feature unificado
scenarios('../features/filter-posts.feature')

# --- GIVEN ---
@given(parsers.parse('existe um post com id "{post_id}", user_id "{user_id}", location "{location}" e hashtags "{hashtags}" {scenario_number}'))
def given_post(context, post_id, user_id, location, hashtags, scenario_number, db_session):
    """
    Insere um post no banco de testes com os atributos fornecidos.
    Exemplo:
      Given existe um post com id "101", user_id "10", location "São Paulo" e hashtags "#python #fastapi" 1
    """
    from model.sqlalchemy.post import Post  # Ajuste conforme a estrutura do seu projeto

    post_obj = Post(
        id=int(post_id),
        user_id=int(user_id),
        location=location,
        hashtags=hashtags
    )
    db_session.add(post_obj)
    db_session.commit()
    context["post"] = {"id": post_id, "location": location, "hashtags": hashtags}

# --- WHEN ---
@when(parsers.parse('uma requisição GET for enviada para "{endpoint}" {scenario_number}'))
def when_get_request(context, endpoint, scenario_number, client):
    response = client.get(endpoint)
    context["response"] = response.json()

# --- THEN ---
@then(parsers.parse('o status da resposta deve ser "{expected_status}" {scenario_number}'))
def then_check_status(context, expected_status, scenario_number):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('o JSON da resposta deve ser uma lista de posts {scenario_number}'))
def then_check_posts_list(context, scenario_number):
    data = context["response"].get("data")
    assert isinstance(data, list), f"Esperava que 'data' fosse uma lista, mas foi {type(data)}"

@then(parsers.parse('o post com post_id "{post_id}" e location "{location}" deve estar na lista {scenario_number}'))
def then_post_in_list_location(context, post_id, location, scenario_number):
    post_id = int(post_id)
    data = context["response"].get("data", [])
    found = any(int(d.get("id", -1)) == post_id and d.get("location") == location for d in data)
    assert found, f"Post com post_id '{post_id}' e location '{location}' não encontrado na lista"

@then(parsers.parse('o post com post_id "{post_id}" deve estar na lista {scenario_number}'))
def then_post_in_list(context, post_id, scenario_number):
    post_id = int(post_id)
    data = context["response"].get("data", [])
    found = any(int(d.get("id", -1)) == post_id for d in data)
    assert found, f"Post com post_id '{post_id}' não encontrado na lista"

@then(parsers.parse('o JSON da resposta deve conter a mensagem "{expected_message}" {scenario_number}'))
def then_check_error_message(context, expected_message, scenario_number):
    actual_message = context["response"].get("message")
    assert actual_message == expected_message, f"Esperava mensagem '{expected_message}', mas obteve '{actual_message}'"
