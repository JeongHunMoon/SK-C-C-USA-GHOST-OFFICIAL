// 질문하기 함수
function questionFunction() {
    let button = document.getElementById("question")
    button.disabled = true; // 질문하기 버튼을 (Main 에서 3번째 버튼) 누르면 해당 태그가 비활성화 > 더블 클릭을 막기 위함.
    button.style.opacity = 0.5; // 투명도를 0.5로 설정

    // 사용자가 카카오 로그인이 되어 있는지 판단한다.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        // 사용자가 이미 로그인한 상태입니다.
        if (statusObj.status === 'connected') {
            let userForAsking = statusObj.user.kakao_account.profile.nickname// 사용자의 프로필 설정 이름
            // 사용지로 부터 질문을 입력 받는다.
            let userInput = prompt("Hello, manager " + userForAsking + "." + "\nAsk me!", "");

            // 만약 질문한 내용이 있는 경우
            if (userInput != null) {
                loadingOn() // 로딩 창 on

                // 관리자 (문정훈, 우동균)에게 메시지가 전송된다.
                Kakao.API.request({
                    url: '/v1/api/talk/friends/message/default/send',
                    data: {
                        receiver_uuids: ['CzoJOAExCTgBLRwkEyISIhUmFzsKOgoyCjkBSA'], // 우동균 uuid CzoJOAExCTgBLRwkEyISIhUmFzsKOgoyCjkBSA
                        template_object: {
                            object_type: 'text',  // 'text'로 설정하여 텍스트만 보내기
                            text: userInput,
                            link: {
                                web_url: 'https://www.ghostalpharetta.com',
                                mobile_web_url: 'https://www.ghostalpharetta.com',
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
                    },
                });
            }

            // 사용자가 취소 버튼을 누른 경우
            else {
                alert("It's been canceled.");
            }
            button.disabled = false; // 버튼 활성화
            button.style.opacity = 1; // 투명도를 1로 설정
        }

        // 사용자가 로그인이 안되어 있던 경우 > 로그인을 먼저 시킨다.
        else {
            loadingOn() // 로그인을 처리되는 동안 로딩창 on

            // 카카오 로그인 함수 호출
            Kakao.Auth.login({
                success: function (authObj) {
                    Kakao.Auth.setAccessToken(authObj.access_token); // 로그인시 발급된 토큰으로 설정

                    // 로그인한 사용자 정보 가져오는 REST
                    let url = 'https://kapi.kakao.com/v2/user/me'
                    const xhr = new XMLHttpRequest(); // REST API 통신을 위한 객체
                    xhr.open('GET', url, true); // REST API로 url에 통신하여 내 친구 목록 Parsing.
                    xhr.setRequestHeader('Authorization', 'Bearer ' + authObj.access_token);// 헤더에 Authorization 추가
                    xhr.send();

                    // 로그인 시도한 사용자의 프로필 정보 가져오기
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            let payload = JSON.parse(xhr.responseText) // 서버로부터 전송 받은 페이로드를 parsing
                            let nowUser = payload.kakao_account.email; // 사용자 카카오 계정

                            // 이 계정이 등록되어 있는 DB 조회하여 판단.
                            let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
                            let infor = {"Who" : nowUser} // 서버로 사용자의 카카오 id를 요청하여 DB에 등록되어 있는지 검증한다.
                            xhr_check.open('POST', '/checkForasking', true); // REST 정의
                            xhr_check.setRequestHeader("Content-Type", "application/json"); // 헤더 설정
                            xhr_check.send(JSON.stringify(infor)) // REST 요청

                            // REST 응답
                            xhr_check.onload = function () {
                                if (xhr_check.status === 200) {
                                    let results = xhr_check.responseText; // 서버의 payload

                                    // DB에 등록되지 않은 사용자이므로 경고창 후 로그인 차단
                                    if (results === "False") {
                                        loadingOff()
                                        button.disabled = false;
                                        button.style.opacity = 1; // 투명도를 0.5로 설정
                                        unlinkWithKakao() // 추후 이 코드 활성화 시켜 ROC이외 외부 인원을 차단시켜야함.
                                        alert("You are not registered in the system.\nContact the Ghost Team.")
                                    }

                                    // 서버에 등록된 ROC 사람인 경우
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
                                                                web_url: 'https://www.ghostalpharetta.com',
                                                                mobile_web_url: 'https://www.ghostalpharetta.com',
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
                                                    loadingOff()
                                                    button.disabled = false;
                                                    button.style.opacity = 1; // 투명도를 0.5로 설정
                                                    alert("Thank you for question. Have a good day");
                                                },
                                                fail: function (error) {
                                                    loadingOff()
                                                    button.disabled = false;
                                                    button.style.opacity = 1; // 투명도를 0.5로 설정
                                                    alert("You have exceeded the number of questions per day");
                                                },
                                            });
                                        }
                                        else {
                                            button.disabled = false;
                                            button.style.opacity = 1; // 투명도를 1로 설정
                                            alert("It's been canceled.");
                                        }
                                    }
                                }
                                else {
                                    alert("사용자 정보를 불러오는데 실패했습니다. \n재시도 부탁드립니다.")
                                    window.location.href = "/"
                                }
                            };
                        }
                        else {
                            alert("사용자 정보를 불러오는데 실패했습니다. \n재시도 부탁드립니다.")
                            window.location.href = "/"
                        }
                    }
                },
                fail: async function (err) { // 로그인 실패시 오류 값 반환
                    loadingOff()
                    button.disabled = false;
                    button.style.opacity = 1; // 투명도를 0.5로 설정
                    alert("You are not registered in the system.\nContact the Ghost Team.")
                },
            })
        }
    });
}