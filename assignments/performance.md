# locust

**EC2 POST**

<img width="50%" src="https://user-images.githubusercontent.com/76513385/175467759-5cf582ec-eec0-412e-9739-cb17bb324683.png">

**EC2 GET**

<img width="50%" src="https://user-images.githubusercontent.com/76513385/175467764-f82a046e-86a5-4bef-a523-c25ec7efa079.png">

**ECS POST**

<img width="50%" src="https://user-images.githubusercontent.com/76513385/175467769-e95ec971-e78c-482f-80be-8e47f1536968.png">

**ECS GET**

<img width="50%" src="https://user-images.githubusercontent.com/76513385/175467773-cc0c6805-f8d0-4ba2-b0c4-081ea7333074.png">


- 최대 동시 접속자 수는 전반적으로 약 100명 정도
- 응답 시간은 GET 요청을 보냈을 때가 POST 요청보다 50배 가량 높게 측정 됐으며, ECS가 POST/GET 요청 모두 조금 더 높았다.
- RPS는 POST요청을 보냈을 때가 GET 요청보다 100배 가량 높게 측정 됐으며, EC2가 POST/GET 요청 모두 더 높았다.

- GET 요청 테스트를 POST 요청 이후에 진행했기 때문에 읽어올 data가 많아서 응답 시간 및 RPS가 좋지 않았을 것 같다.
- ECS는 Fargate 0.25 vCPU 사용 중이고, EC2 인스턴스는 t2.micro로 1 vCPU 사용 중이었기 때문에 EC2가 더 성능을 좋게 보인 것 같다.
