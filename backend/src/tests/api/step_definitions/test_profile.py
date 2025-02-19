from pytest_bdd import given, parsers, scenarios, then, when

scenarios('../features/perfil.feature')

@given(parsers.parse('existe um usuário de nome "{user_name}", id "{user_id}" 1'))
def force_user_profile(context, user_name, user_id, client):
    user_id_int = int(user_id)
    response = client.patch(f"/update_profile/{user_id_int}/{user_name}/url_da_foto.jpg/Exemplo de biografia")
    response_data = response.json()
    assert response_data["status_code"] == 200, f"Falha ao atualizar o perfil do usuário {user_id}"
    context["user_id"] = user_id_int
    context["user_name"] = user_name

@when(parsers.parse('uma requisição "GET" for enviada para "{endpoint}" 1'))
def send_get_profile_request(context, endpoint, client):
    response = client.get(endpoint)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 1'))
def check_get_profile_status(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('o JSON da resposta deve conter um objeto com nome "{expected_name}", id "{expected_id}" e com os dados do perfil 1'))
def check_get_profile_json(context, expected_name, expected_id):
    expected_id = int(expected_id)
    data = context["response"].get("data", {})

    assert data.get("user_name") == expected_name, f"Nome esperado '{expected_name}', mas obtido '{data.get('user_name')}'"
    assert data.get("id") == expected_id, f"ID esperado '{expected_id}', mas obtido '{data.get('id')}'"

    for field in ["email", "bio", "profile_img_path", "is_private"]:
        assert field in data, f"Campo '{field}' não encontrado nos dados do perfil"



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