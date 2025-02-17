from pytest_bdd import given, parsers, scenarios, then, when

scenarios('../features/search-users-service.feature')

# ------------------------ first scenario ---------------------------

@given(parsers.parse('existem os usuários de nomes "{name1}" e "{name2}" e ids "{id1}" e "{id2}" 1'))
def ensure_users_exist(context, name1, name2, id1, id2):
    context["expected_users"] = [
        {"id": id1, "name": name1},
        {"id": id2, "name": name2}
    ]


@when(parsers.parse('uma requisição GET for enviada para "{endpoint}" 1'))
def send_get_request_scenario1(context, endpoint, client):
    response = client.get(endpoint)
    context["response"] = response.json()
    print(context["response"])


@then(parsers.parse('o status da resposta deve ser "{expected_status}" 1'))
def check_status_scenario1(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"]["status_code"]
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"


@then(parsers.parse('o JSON da resposta deve ser uma lista de usuários 1'))
def check_response_is_list(context):
    data = context["response"].get("data")
    assert isinstance(data, list), f"Esperava que 'data' fosse uma lista, mas foi {type(data)}"


@then(parsers.parse('o usuário com id "{expected_id1}" e nome "{expected_name1}" deve estar na lista 1'))
def check_user1_in_list(context, expected_id1, expected_name1):
    expected_id1 = int(expected_id1)
    users = context["response"].get("data", [])
    found = any(user.get("id") == expected_id1 and user.get("user_name") == expected_name1 for user in users)
    assert found, f"Usuário com id '{expected_id1}' e nome '{expected_name1}' não encontrado na lista"

@then(parsers.parse('o usuário com id "{expected_id2}" e nome "{expected_name2}" deve estar na lista 1'))
def check_user2_in_list(context, expected_id2, expected_name2):
    expected_id2 = int(expected_id2)
    users = context["response"].get("data", [])
    found = any(user.get("id") == expected_id2 and user.get("user_name") == expected_name2 for user in users)
    assert found, f"Usuário com id '{expected_id2}' e nome '{expected_name2}' não encontrado na lista"

# ------------------------ second scenario ---------------------------

@given(parsers.parse('não existe usuário com "{substring}" no nome 2'))
def ensure_no_user_with_substring(context, substring, client):
    response = client.get(f"/user/get_users_by_substring/{substring}")
    data = response.json().get("data", [])
    assert isinstance(data, list) and len(data) == 0, f"Existem usuários com '{substring}' no nome: {data}"


@when(parsers.parse('uma requisição GET for enviada para "{endpoint}" 2'))
def send_get_request_scenario2(context, endpoint, client):
    response = client.get(endpoint)
    context["response"] = response.json()


@then(parsers.parse('o status da resposta deve ser "{expected_status}" 2'))
def check_status_scenario2(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"


@then(parsers.parse('o JSON da resposta deve ser uma lista de usuários vazia 2'))
def check_empty_users_list(context):
    data = context["response"].get("data")
    assert isinstance(data, list), f"Esperava que 'data' fosse uma lista, mas foi {type(data)}"
    assert len(data) == 0, f"Esperava lista vazia, mas obteve: {data}"