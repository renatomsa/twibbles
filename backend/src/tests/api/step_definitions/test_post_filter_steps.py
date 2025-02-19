import pytest
from pytest_bdd import scenarios, given, when, then, parsers

scenarios('../features/posts_filter.feature')

@pytest.fixture
def context():
    return {}

# --- Scenario 1: Busca por Posts por localização ---

@given(parsers.parse('existe um post com localização "{location}" e texto "{text}" no banco de dados 1'))
def given_post_location():
    pass

@when(parsers.parse('uma requisição GET for enviada para "{endpoint}" 1'))
def get_posts_by_location(context, endpoint, client):
    response = client.get(endpoint)
    context["http_response"] = response
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 1'))
def check_status_location(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["http_response"].status_code
    assert actual_status == expected_status, f"Esperado status {expected_status}, obtido {actual_status}"

@then(parsers.parse('o corpo da resposta deve conter o post com texto "{expected_text}" 1'))
def check_post_text_location(context, expected_text):
    data = context["response"].get("data", [])
    found = any(post.get("text") == expected_text for post in data)
    assert found, f"Post com texto '{expected_text}' não encontrado na resposta"

# --- Scenario 2: Busca por Posts por hashtag ---

@given(parsers.parse('existe um post com hashtag "{hashtag}" e texto "{text}" no banco de dados 2'))
def given_post_hashtag():
    pass

@when(parsers.parse('uma requisição GET for enviada para "{endpoint}" 2'))
def get_posts_by_hashtag(context, endpoint, client):
    response = client.get(endpoint)
    context["http_response"] = response
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 2'))
def check_status_hashtag(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["http_response"].status_code
    assert actual_status == expected_status, f"Esperado status {expected_status}, obtido {actual_status}"

@then(parsers.parse('o corpo da resposta deve conter o post com texto "{expected_text}" 2'))
def check_post_text_hashtag(context, expected_text):
    data = context["response"].get("data", [])
    found = any(post.get("text") == expected_text for post in data)
    assert found, f"Post com texto '{expected_text}' não encontrado na resposta"
