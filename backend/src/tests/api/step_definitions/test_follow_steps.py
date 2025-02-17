from pytest_bdd import scenarios, given, when, then, parsers


scenarios('../features/follow.feature')

# ------------------------ first scenario ---------------------------


@given(parsers.parse('O usuário de id = "{follower_id:d}" não segue o usuário de id = "{followed_id:d}" 1'))
def not_following(context, follower_id, followed_id, client):
    context['follower_id'] = follower_id
    context['followed_id'] = followed_id
    # send unfollow request to the database to guarantee
    unfollow_response = client.post(f"/follow/{follower_id}/unfollow/{followed_id}").json()
    print("LOG FIRST_SCENARIO: unfollow response ", unfollow_response)
    assert unfollow_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed_id}"


@given(parsers.parse('O usuário de id = "{followed_id:d}" tem o perfil público (is_private = False) 1'))
def public_profile(context, followed_id, client):
    context['followed_id'] = followed_id

    get_user_response = client.get(f"/user/get_user_by_id/{followed_id}").json()
    assert get_user_response["data"]["is_private"] is False, f"User with id {followed_id} is not public"


@when(parsers.parse('Uma requisição "POST" for enviada para "/follow/{follower_id:d}/follow/{followed_id:d}" 1'))
def send_request(context, follower_id, followed_id, client):
    response = client.post(f"/follow/{follower_id}/follow/{followed_id}")
    context['response'] = response.json()


@then(parsers.parse('O status da resposta deve ser {expected_status:d} 1'))
def check_status(context, expected_status):
    actual_status = context['response']["status_code"]
    assert actual_status == expected_status, f"Expected status {expected_status}, but got {actual_status}"


@then(parsers.parse('a mensagem deve ser "{expected_message}" 1'))
def check_message(context, expected_message):
    data = context['response']
    actual_message = data.get("message", "")
    assert actual_message == expected_message, f"Expected message '{expected_message}', but got '{actual_message}'"


# ------------------------ second scenario ---------------------------


@given(parsers.parse('O usuário de id = "{follower_id:d}" não segue o usuário de id = "{followed_id:d}" 2'))
def not_following_second(context, follower_id, followed_id, client):
    context['follower_id'] = follower_id
    context['followed_id'] = followed_id
    # send unfollow request to the database to guarantee
    unfollow_response = client.post(f"/follow/{follower_id}/unfollow/{followed_id}").json()
    assert unfollow_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed_id}"


@given(parsers.parse('O usuário de id = "{followed_id:d}" tem o perfil privado 2'))
def private_profile(context, followed_id, client):
    context['followed_id'] = followed_id

    get_user_response = client.get(f"/user/get_user_by_id/{followed_id}").json()
    assert get_user_response["data"]["is_private"] is True, f"User with id {followed_id} is not private"


@given(parsers.parse('O usuário de id = "{follower_id:d}" não enviou a solicitação para o usuário de id = "{followed_id:d}" 2'))
def not_requested(context, follower_id, followed_id, client):
    context['follower_id'] = follower_id
    context['followed_id'] = followed_id
    # check for pending requests
    get_pending_requests = client.get(f"/follow/{followed_id}/follow_requests_as_requested").json()
    print("LOG SECOND_SCENARIO looking for requests ", get_pending_requests)
    pending_requests = get_pending_requests.get("data", [])

    print("LOG pending requests DATA", pending_requests)
    for request in pending_requests:
        if request["requester_id"] == follower_id:
            # send reject request to the database to guarantee
            print("LOG rejecting request")
            reject_response = client.post(f"/follow/{follower_id}/reject_request/{followed_id}").json()
            assert reject_response["status_code"] in (200, 400), f"Failed to reject request from user with id {follower_id}"
            break


@when(parsers.parse('Uma requisição "POST" for enviada para "/follow/{follower_id:d}/follow/{followed_id:d}" 2'))
def send_request_second(context, follower_id, followed_id, client):
    response = client.post(f"/follow/{follower_id}/follow/{followed_id}")
    print("LOG SECOND_SCENARIO: follow response ", response.json())
    context['response'] = response.json()


@then(parsers.parse('O status da resposta deve ser "{expected_status:d}" 2'))
def check_status_second(context, expected_status):
    actual_status = context['response']["status_code"]
    assert actual_status == expected_status, f"Expected status {expected_status}, but got {actual_status}"

@then(parsers.parse('A mensagem deve ser "{expected_message}" 2'))
def check_message_second(context, expected_message):
    data = context['response']
    actual_message = data.get("message", "")
    assert actual_message == expected_message, f"Expected message '{expected_message}', but got '{actual_message}'"


# ------------------------ third scenario ---------------------------


@given(parsers.parse('Usuário de id = "{follower_id:d}" segue o usuário de id = "{followed_id:d}" 3'))
def following(context, follower_id, followed_id, client):
    context['follower_id'] = follower_id
    context['followed_id'] = followed_id
    # send follow request to the database to guarantee
    follow_response = client.post(f"/follow/{follower_id}/follow/{followed_id}").json()
    assert follow_response["status_code"] in (201, 400), f"Failed to follow user with id {followed_id}"


@when(parsers.parse('Uma requisição "POST" for enviada para /follow/{follower_id:d}/unfollow/{followed_id:d} 3'))
def send_request_third(context, follower_id, followed_id, client):
    response = client.post(f"/follow/{follower_id}/unfollow/{followed_id}")
    context['response'] = response.json()


@then(parsers.parse('O status da resposta deve ser "{expected_status:d}" 3'))
def check_status_third(context, expected_status):
    actual_status = context['response']["status_code"]
    assert actual_status == expected_status, f"Expected status {expected_status}, but got {actual_status}"


@then(parsers.parse('A mensagem deve ser "{expected_message}" 3'))
def check_message_third(context, expected_message):
    data = context['response']
    actual_message = data.get("message", "")
    assert actual_message == expected_message, f"Expected message '{expected_message}', but got '{actual_message}'"


# ------------------------ fourth scenario ---------------------------


@given(parsers.parse('Usuário de id = {followed_id:d} tem o perfil privado 4'))
def private_profile_fourth(context, followed_id, client):
    context['followed_id'] = followed_id

    get_user_response = client.get(f"/user/get_user_by_id/{followed_id}").json()
    print("LOG followed user response ", get_user_response)
    assert get_user_response["data"]["is_private"] is True, f"User with id {followed_id} is not private"


@given(parsers.parse('recebeu solicitações de follow dos usuários de id = {follower1_id:d} e id = {follower2_id:d} 4'))
def requests(context, follower1_id, follower2_id, client):
    context['follower1_id'] = follower1_id
    context['follower2_id'] = follower2_id
    followed_id = context['followed_id']

    # unfollow to guarantee
    unfollow1_response = client.post(f"/follow/{follower1_id}/unfollow/{followed_id}").json()
    assert unfollow1_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed_id}"
    unfollow2_response = client.post(f"/follow/{follower2_id}/unfollow/{followed_id}").json()
    assert unfollow2_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed_id}"

    # send follow request to the database to guarantee
    follow1_response = client.post(f"/follow/{follower1_id}/follow/{followed_id}").json()
    assert follow1_response["status_code"] in (201, 400), f"Failed to follow user with id {followed_id}"

    follow2_response = client.post(f"/follow/{follower2_id}/follow/{followed_id}").json()
    assert follow2_response["status_code"] in (201, 400), f"Failed to follow user with id {followed_id}"


@when(parsers.parse('Uma requisição "GET" for enviada para follow/{followed_id:d}/follow_requests_as_requested 4'))
def send_request_fourth(context, followed_id, client):
    response = client.get(f"/follow/{followed_id}/follow_requests_as_requested")
    context['response'] = response.json()


@then(parsers.parse('O status da resposta deve ser "{expected_status:d}" 4'))
def check_status_fourth(context, expected_status):
    actual_status = context['response']["status_code"]
    assert actual_status == expected_status, f"Expected status {expected_status}, but got {actual_status}"


@then(parsers.parse('A mensagem deve ser "{expected_message}" 4'))
def check_message_fourth(context, expected_message):
    data = context['response']
    actual_message = data.get("message", "")
    assert actual_message == expected_message, f"Expected message '{expected_message}', but got '{actual_message}'"


@then(parsers.parse('O JSON da resposta deve conter a lista das solicitações dos usuários de id = {follower1_id:d} e id = {follower2_id:d} 4'))
def check_requests(context, follower1_id, follower2_id):
    data = context['response']
    requests = data.get("data", [])
    assert len(requests) >= 2, f"Expected 2 requests, but got {len(requests)}"
    requester_ids = [request["requester_id"] for request in requests]
    assert follower1_id in requester_ids, f"User with id {follower1_id} not found in requests"
    assert follower2_id in requester_ids, f"User with id {follower2_id} not found in requests"


# ------------------------ fifth scenario ---------------------------


@given(parsers.parse('Usuário de id = {followed_id:d} tem o perfil privado 5'))
def private_profile_fifth(context, followed_id, client):
    context['followed_id'] = followed_id

    get_user_response = client.get(f"/user/get_user_by_id/{followed_id}").json()
    assert get_user_response["data"]["is_private"] is True, f"User with id {followed_id} is not private"


@given(parsers.parse('o usuário de id = {followed_id:d} não é seguido pelo usuário de id = {follower_id:d} 5'))
def not_following_fifth(context, follower_id, followed_id, client):
    context['follower_id'] = follower_id
    context['followed_id'] = followed_id
    # send unfollow request to the database to guarantee
    unfollow_response = client.post(f"/follow/{follower_id}/unfollow/{followed_id}").json()
    print("LOG FIFTH_SCENARIO: unfollow response ", unfollow_response)
    assert unfollow_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed_id}"


@given(parsers.parse('Recebeu solicitação de follow do usuário de id = {follower_id:d} 5'))
def request_fifth(context, follower_id, client):
    followed_id = context['followed_id']

    # send follow request to the database to guarantee
    follow_response = client.post(f"/follow/{follower_id}/follow/{followed_id}").json()
    print("LOG FIFTH_SCENARIO: follow response ", follow_response)
    assert follow_response["status_code"] in (201, 400), f"Failed to follow user with id {followed_id}"


@when(parsers.parse('Uma requisição "POST" é enviada para follow/{follower_id:d}/accept_request/{followed_id:d} 5'))
def send_request_fifth(context, follower_id, followed_id, client):
    response = client.post(f"/follow/{follower_id}/accept_request/{followed_id}")
    print("LOG FIFTH_SCENARIO: accept request response ", response.json())
    context['response'] = response.json()


@then(parsers.parse('O status da resposta deve ser "{expected_status:d}" 5'))
def check_status_fifth(context, expected_status):
    actual_status = context['response']["status_code"]
    assert actual_status == expected_status, f"Expected status {expected_status}, but got {actual_status}"
    

@then(parsers.parse('A mensagem deve ser "{expected_message}" 5'))
def check_message_fifth(context, expected_message):
    data = context['response']
    actual_message = data.get("message", "")
    assert actual_message == expected_message, f"Expected message '{expected_message}', but got '{actual_message}'"


# ------------------------ sixth scenario ---------------------------

@given(parsers.parse('Usuário de id = {followed_id:d} tem o perfil privado 6'))
def private_profile_sixth(context, followed_id, client):
    context['followed_id'] = followed_id

    get_user_response = client.get(f"/user/get_user_by_id/{followed_id}").json()
    assert get_user_response["data"]["is_private"] is True, f"User with id {followed_id} is not private"


@given(parsers.parse('o usuário de id = {followed_id:d} não é seguido pelo usuário de id = {follower_id:d} 6'))
def not_following_sixth(context, follower_id, followed_id, client):
    context['follower_id'] = follower_id
    context['followed_id'] = followed_id
    # send unfollow request to the database to guarantee
    unfollow_response = client.post(f"/follow/{follower_id}/unfollow/{followed_id}").json()
    assert unfollow_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed_id}"


@given(parsers.parse('Recebeu solicitação de follow do usuário de id = {follower_id:d} 6'))
def request_sixth(context, follower_id, client):
    followed_id = context['followed_id']

    # send follow request to the database to guarantee
    follow_response = client.post(f"/follow/{follower_id}/follow/{followed_id}").json()
    assert follow_response["status_code"] in (201, 400), f"Failed to follow user with id {followed_id}"


@when(parsers.parse('Uma requisição "POST" é enviada para follow/{follower_id:d}/reject_request/{followed_id:d} 6'))
def send_request_sixth(context, follower_id, followed_id, client):
    response = client.post(f"/follow/{follower_id}/reject_request/{followed_id}")
    context['response'] = response.json()


@then(parsers.parse('O status da resposta deve ser "{expected_status:d}" 6'))
def check_status_sixth(context, expected_status):
    actual_status = context['response']["status_code"]
    assert actual_status == expected_status, f"Expected status {expected_status}, but got {actual_status}"


@then(parsers.parse('A mensagem deve ser "{expected_message}" 6'))
def check_message_sixth(context, expected_message):
    data = context['response']
    actual_message = data.get("message", "")
    assert actual_message == expected_message, f"Expected message '{expected_message}', but got '{actual_message}'"


# ------------------------ seventh scenario ---------------------------


@given(parsers.parse('Usuário de id = {follower_id:d} segue os usuários de id = {followed1_id:d} e id = {followed2_id:d} 7'))
def following_seventh(context, follower_id, followed1_id, followed2_id, client):
    context['follower_id'] = follower_id
    context['followed1_id'] = followed1_id
    context['followed2_id'] = followed2_id

    # send unfollow request to the database to guarantee
    unfollow1_response = client.post(f"/follow/{follower_id}/unfollow/{followed1_id}").json()
    assert unfollow1_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed1_id}"
    unfollow2_response = client.post(f"/follow/{follower_id}/unfollow/{followed2_id}").json()
    assert unfollow2_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed2_id}"

    # send follow request to the database to guarantee
    follow1_response = client.post(f"/follow/{follower_id}/follow/{followed1_id}").json()
    assert follow1_response["status_code"] == 201, f"Failed to follow user with id {followed1_id}"
    follow2_response = client.post(f"/follow/{follower_id}/follow/{followed2_id}").json()
    assert follow2_response["status_code"] == 201, f"Failed to follow user with id {followed2_id}"
    
    # assert the messages to see if they are following
    assert follow1_response["message"] == "Followed successfully", f"Failed to follow user with id {followed1_id}"
    

@when(parsers.parse('Uma requisição "GET" é enviada para follow/{follower_id:d}/following 7'))
def send_request_seventh(context, follower_id, client):
    response = client.get(f"/follow/{follower_id}/following")
    context['response'] = response.json()


@then(parsers.parse('O status da resposta deve ser "{expected_status:d}" 7'))
def check_status_seventh(context, expected_status):
    actual_status = context['response']["status_code"]
    assert actual_status == expected_status, f"Expected status {expected_status}, but got {actual_status}"


@then(parsers.parse('A mensagem deve ser "{expected_message}" 7'))
def check_message_seventh(context, expected_message):
    data = context['response']
    actual_message = data.get("message", "")
    assert actual_message == expected_message, f"Expected message '{expected_message}', but got '{actual_message}'"


@then(parsers.parse('O JSON da resposta deve conter uma lista que contém os usuários de id = {followed1_id:d} e id = {followed2_id:d} 7'))
def check_following(context, followed1_id, followed2_id):
    data = context['response']
    following = data.get("data", [])
    assert len(following) >= 2, f"Expected 2 following, but got {len(following)}"
    followed_ids = [follow["id"] for follow in following]
    assert followed1_id in followed_ids, f"User with id {followed1_id} not found in following"
    assert followed2_id in followed_ids, f"User with id {followed2_id} not found in following" 


# ------------------------ eighth scenario ---------------------------

@given(parsers.parse('Usuário de id = {followed_id:d} é seguido pelos usuários de id = {follower1_id:d} e id = {follower2_id:d} 8'))
def following_eighth(context, followed_id, follower1_id, follower2_id, client):
    context['followed_id'] = followed_id
    context['follower1_id'] = follower1_id
    context['follower2_id'] = follower2_id

    # send unfollow request to the database to guarantee
    unfollow1_response = client.post(f"/follow/{follower1_id}/unfollow/{followed_id}").json()
    assert unfollow1_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed_id}"
    unfollow2_response = client.post(f"/follow/{follower2_id}/unfollow/{followed_id}").json()
    assert unfollow2_response["status_code"] in (200, 400), f"Failed to unfollow user with id {followed_id}"

    # send follow request to the database to guarantee
    follow1_response = client.post(f"/follow/{follower1_id}/follow/{followed_id}").json()
    assert follow1_response["status_code"] == 201, f"Failed to follow user with id {followed_id}"
    follow2_response = client.post(f"/follow/{follower2_id}/follow/{followed_id}").json()
    assert follow2_response["status_code"] == 201, f"Failed to follow user with id {followed_id}"
    
    # assert the messages to see if they are following
    assert follow1_response["message"] == "Followed successfully", f"Failed to follow user with id {followed_id}"
    

@when(parsers.parse('Uma requisição "GET" é enviada para follow/{followed_id:d}/followers 8'))
def send_request_eighth(context, followed_id, client):
    response = client.get(f"/follow/{followed_id}/followers")
    context['response'] = response.json()


@then(parsers.parse('O status da resposta deve ser "{expected_status:d}" 8'))
def check_status_eighth(context, expected_status):
    actual_status = context['response']["status_code"]
    assert actual_status == expected_status, f"Expected status {expected_status}, but got {actual_status}"


@then(parsers.parse('A mensagem deve ser "{expected_message}" 8'))
def check_message_eighth(context, expected_message):
    data = context['response']
    actual_message = data.get("message", "")
    assert actual_message == expected_message, f"Expected message '{expected_message}', but got '{actual_message}'"


@then(parsers.parse('O JSON da resposta deve conter uma lista que contém os usuários de id = {follower1_id:d} e id = {follower2_id:d} 8'))
def check_followers(context, follower1_id, follower2_id):
    data = context['response']
    followers = data.get("data", [])
    assert len(followers) >= 2, f"Expected 2 followers, but got {len(followers)}"
    follower_ids = [follower["id"] for follower in followers]
    assert follower1_id in follower_ids, f"User with id {follower1_id} not found in followers"
    assert follower2_id in follower_ids, f"User with id {follower2_id} not found in followers"
