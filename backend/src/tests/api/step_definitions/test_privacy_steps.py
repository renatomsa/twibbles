from pytest_bdd import given, parsers, scenarios, then, when

scenarios('../features/privacy-service.feature')

# ------------------------ first scenario ---------------------------
@given(parsers.parse('existe um usuário de nome "{user_name}", id "{user_id}" e privado "{privacy}" 1'))
def force_user_privacy(context, user_name, user_id, privacy, client):
    user_id = int(user_id)
    is_private_bool = bool(privacy)
    
    response = client.patch(f"/user/update_user_privacy/{user_id}/{is_private_bool}")
    response_data = response.json()
    assert response_data["status_code"] == 200, f"Falha ao atualizar a privacidade do usuário {user_id}"
    
    context["user_id"] = user_id
    context["user_name"] = user_name
    context["is_private"] = is_private_bool

@when(parsers.parse('uma requisição GET for enviada para "{endpoint}" 1'))
def send_get_request(context, endpoint, client):
    response = client.get(endpoint)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 1'))
def check_status(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"]["status_code"]
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('o JSON da resposta deve conter um objeto com nome "{expected_name}", id "{expected_id}" e privado "{privacy}" 1'))
def check_response_json(context, expected_name, expected_id, privacy):
    expected_id = int(expected_id)
    expected_privado_bool = bool(privacy)
    data = context["response"].get("data", {})

    assert data.get("user_name") == expected_name, f"Nome esperado '{expected_name}', mas obtido '{data.get('name')}'"
    assert data.get("id") == expected_id, f"ID esperado '{expected_id}', mas obtido '{data.get('id')}'"
    assert data.get("is_private") == expected_privado_bool, f"Privacidade esperada '{expected_privado_bool}', mas obtido '{data.get('is_private')}'"

# ------------------------ second scenario ---------------------------
@given(parsers.parse('existe um usuário de nome "{user_name}", id "{user_id}" e privado "{privacy}" 2'))
def force_user_privacy(context, user_name, user_id, privacy, client):
    user_id = int(user_id)
    is_private_bool = bool(privacy)

    response = client.patch(f"/user/update_user_privacy/{user_id}/{is_private_bool}")
    response_data = response.json()
    assert response_data["status_code"] == 200, f"Falha ao atualizar a privacidade do usuário {user_id}"

    context["user_id"] = user_id
    context["user_name"] = user_name
    context["is_private"] = is_private_bool

@when(parsers.parse('uma requisição PATCH for enviada para "{endpoint}" 2'))
def send_patch_request(context, endpoint, client):
    response = client.patch(endpoint)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 2'))
def check_status(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('o JSON da resposta deve retornar uma mensagem Http "{expected_message}" 2'))
def check_http_message(context, expected_message):
    actual_message = context["response"].get("message", "")
    assert actual_message == expected_message, f"Mensagem esperada '{expected_message}', mas obtida '{actual_message}'"