from locust import HttpUser, task, tag, events
import random, string, json

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("A new test is starting")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    print("A new test is ending")

# Using Get all Users API, Create User API
# Test Number of users / Response times / Requests per second (RPS)

global_prefix = "/api"

class TestUser(HttpUser):
    @tag('get')
    @task
    def get_all_users(self):
        response = self.client.get(f"{global_prefix}/users")
        if response.status_code >= 400:
            print(response.status_code)
            print(response.text)

    @tag('post')
    @task
    def create_user(self):
        letters = string.ascii_lowercase
        random_name = ''.join(random.choice(letters) for i in range(10))

        payload = {
            "name": random_name,
            "age": 20
        }
        headers = {'content-type': 'application/json'}

        response = self.client.post(f"{global_prefix}/users", data=json.dumps(payload), headers=headers)
        if response.status_code >= 400:
            print(response.status_code)
            print(response.text)