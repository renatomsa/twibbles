from pytest_bdd import given, parsers, scenarios, then, when

scenarios('../features/login.feature')

# ------------------------ Cenário 1: Redefinição de senha com sucesso ---------------------------
@given(parsers.parse('existe um usuário de id "{user_id}" 1'))
def force_existing_user(context, user_id, client):
    user_id = int(user_id)
    
    response = client.get(f"/get_user_by_id/{user_id}")
    response_data = response.json()
    assert response_data["status_code"] == 200, f"Usuário {user_id} não encontrado"
    
    context["user_id"] = user_id

@when(parsers.parse('uma requisição PATCH for enviada para "{endpoint}" 1'))
def send_patch_request(context, endpoint, client):
    response = client.patch(endpoint)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 1'))
def check_status(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"]["status_code"]
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('o JSON da resposta deve retornar uma mensagem Http "{expected_message}" 1'))
def check_http_message(context, expected_message):
    actual_message = context["response"].get("message", "")
    assert actual_message == expected_message, f"Mensagem esperada '{expected_message}', mas obtida '{actual_message}'"