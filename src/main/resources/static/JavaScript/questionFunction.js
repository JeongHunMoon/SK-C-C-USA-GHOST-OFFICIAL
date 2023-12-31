// 로그인을 통한 사용자 검증 > 이름 추출 후 text 파일 생성 > 정보 입력 받아 sendToFriend로 메시지 전송 (나는 우동균 에게만 보내기) > 다시 main으로 리다이랙트

function questionFunction() {
    const button = document.getElementById("question")
    button.disabled = true;
    button.style.opacity = 0.7; // 투명도를 0.5로 설정

    Kakao.Auth.getStatusInfo(function(statusObj) {
        if (statusObj.status === 'connected') {
            // 사용자가 이미 로그인한 상태입니다.
            console.log(statusObj)
            console.log(statusObj.user.kakao_account.profile.nickname)

            let userForAsking = statusObj.user.kakao_account.profile.nickname// 사용자의 프로필 설정 이름
            let userInput = prompt("Hello, manager " + userForAsking + "." + "\nAsk me!", "");

            if (userInput != null) {
                loadingOn()
                Kakao.API.request({
                    url: '/v1/api/talk/friends/message/default/send',
                    data: {
                        receiver_uuids: ['CzoJOAExCTgBLRwkEyISIhUmFzsKOgoyCjkBSA'],
                        template_object: {
                            object_type: 'text',  // 'text'로 설정하여 텍스트만 보내기
                            text: userInput,
                            link: {
                                web_url: 'http://3.145.154.90:8080',
                                mobile_web_url: 'http://3.145.154.90:8080',
                            },
                        },
                    },
                    success: function (response) {
                        alert("Thank you for question. Have a good day");
                        loadingOff()
                    },
                    fail: function (error) {
                        alert("You have exceeded the number of questions per day");
                        loadingOff()
                        console.log(error);
                    },
                });
            }
            else {
                alert("It's been canceled.");
            }
            button.disabled = false;
            button.style.opacity = 1; // 투명도를 0.5로 설정

        } else {
            loadingOn()
            Kakao.Auth.login({
                success: function (authObj) {
                    Kakao.Auth.setAccessToken(authObj.access_token); // 로그인시 발급된 토큰으로 설정

                    // 로그인한 사용자 정보 가져오는 REST
                    let url = 'https://kapi.kakao.com/v2/user/me'
                    const xhr = new XMLHttpRequest(); // REST API 통신을 위한 객체
                    xhr.open('GET', url, true); // REST API로 url에 통신하여 내 친구 목록 Parsing.
                    xhr.setRequestHeader('Authorization', 'Bearer ' + authObj.access_token);// 헤더에 Authorization 추가
                    xhr.send();
                    xhr.onload = function () { // 로그인 시도한 사용자의 프로필 정보 가져오기
                        let payload = JSON.parse(xhr.responseText) // 서버로부터 전송 받은 페이로드를 parsing
                        let nowUser = payload.kakao_account.email; // 사용자 카카오 계정

                        // 이 계정이 등록되어 있는 DB 조회하여 판단.
                        const xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
                        let infor = {"Who" : nowUser}
                        xhr_check.open('POST', '/checkForasking', true);
                        xhr_check.setRequestHeader("Content-Type", "application/json");
                        xhr_check.send(JSON.stringify(infor))

                        // 대기 시간을 설정하거나, 서버 응답에 대한 추가 로직을 작성할 수 있습니다.
                        xhr_check.onload = function () {
                            let results = xhr_check.responseText;

                            if (results === "False") { // DB에 등록되지 않은 사용자이므로 경고창 후 로그인 차단
                                alert("You are not registered in the system.\nContact the Ghost Team.")
                                loadingOff()
                                button.disabled = false;
                                button.style.opacity = 1; // 투명도를 0.5로 설정
                                unlinkWithKakao() // 추후 이 코드 활성화 시켜 ROC이외 외부 인원을 차단시켜야함.
                            }
                            else {
                                loadingOff()
                                let userForAsking = results// 사용자의 프로필 설정 이름
                                let userInput = prompt("Hello, manager " + userForAsking + "." + "\nAsk me!", "");


                                if (userInput != null) {
                                    loadingOn()
                                    Kakao.API.request({
                                        url: '/v1/api/talk/friends/message/default/send',
                                        data: {
                                            //한번에 몇명까지 전송 가능한지 찾아봐야함.
                                            receiver_uuids: ['CzoJOAExCTgBLRwkEyISIhUmFzsKOgoyCjkBSA'], //value의 format > ['sdfdsf123213' , 'fas213123fd']
                                            template_object: {
                                                object_type: 'feed',
                                                content: {
                                                    title: '질문하기 테스트',
                                                    description: userForAsking,
                                                    image_url: 'http://mud-kage.kakao.co.kr/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
                                                    link: {
                                                        web_url: 'https://developers.kakao.com',
                                                        mobile_web_url: 'https://developers.kakao.com',
                                                    },
                                                },
                                                social: {
                                                    like_count: 100,
                                                    comment_count: 200,
                                                },
                                                button_title: '바로 확인',
                                            },
                                        },
                                        success: function (response) {
                                            alert("Thank you for question. Have a good day");
                                            loadingOff()
                                            button.disabled = false;
                                            button.style.opacity = 1; // 투명도를 0.5로 설정
                                        },
                                        fail: function (error) {
                                            alert("You have exceeded the number of questions per day");
                                            loadingOff()
                                            button.disabled = false;
                                            button.style.opacity = 1; // 투명도를 0.5로 설정
                                        },
                                    });
                                }
                                else {
                                    alert("It's been canceled.");
                                    button.disabled = false;
                                    button.style.opacity = 1; // 투명도를 0.5로 설정
                                }
                            }
                        };
                    }
                },
                fail: async function (err) { // 로그인 실패시 오류 값 반환
                    alert("You are not registered in the system.\nContact the Ghost Team.")
                    loadingOff()
                    button.disabled = false;
                    button.style.opacity = 1; // 투명도를 0.5로 설정
                },
            })
        }
    });
}