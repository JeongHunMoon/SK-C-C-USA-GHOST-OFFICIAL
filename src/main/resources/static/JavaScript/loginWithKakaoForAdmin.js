// Ver .2 > 운영자 로그인 함수
function loginWithKakaoForAdmin() {
    let button = document.getElementById("admin_login") //로그인 버튼을 비활성화 하기 위한 태그 가져오기
    button.disabled = true;     // 버튼 비활성화
    button.style.opacity = 0.5; // 투명도를 0.5로 설정
    loadingOn();
    let nowUser = null;
    let userRefreshToken = null;

    //최초 사용자(운영자) 이미 카카오 로그인이 되어있는지 판단.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUser = statusObj.user.kakao_account.email; // 사용자 카카오 id
            alert("Welcome manager, "+ statusObj.user.kakao_account.profile.nickname)

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
                        loadingOff();
                        button.disabled = false;     // 버튼 활성화
                        button.style.opacity = 1; // 투명도를 1로 설정
                        window.location.href = "/admin?id=" + nowUser + "&first=" +  "true";
                    }
                }

                else {
                    unlinkWithKakao() // 추후 이 코드 활성화 시켜 ROC이외 외부 인원을 차단시켜야함.
                    loadingOff();
                    button.disabled = false;     // 버튼 활성화
                    button.style.opacity = 1; // 투명도를 1로 설정
                    alert("카카오 서버 오류, 사용자 정보를 가져오는데 실패했습니다.\n재시도 부탁드립니다.")
                    window.location.href = "/"
                }
            }
        }

        // 사용자가 현재 브라우저에 카카오 로그인이 안되어 있는 경우
        else {
            // 사용자 카카오 로그인을 진행한다.
            Kakao.Auth.login({
                // 로그인이 성공한 경우
                success: function (authObj) {
                    Kakao.Auth.setAccessToken(authObj.access_token); // 사용자 처음 로그인시 발급된 토큰으로 설정
                    userRefreshToken = authObj.refresh_token // refresh token 값 저장.
                    //refreshAccessToken(userRefreshToken) // > 삭제 필요

                    console.log("처음 로그인 시 설정된 토큰" + Kakao.Auth.getAccessToken());
                    console.log("처음 로그인 시 발급 받은 리프레시 토큰" + userRefreshToken);

                    // 로그인한 사용자 정보 가져오는 REST
                    let url = 'https://kapi.kakao.com/v2/user/me';

                    // Authorization 헤더 설정
                    let headers = new Headers({
                        'Authorization': 'Bearer ' + authObj.access_token
                    });

                    // fetch 요청
                    fetch(url, { method: 'GET', headers: headers })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(payload => {
                            nowUser = payload.kakao_account.email; // 사용자 카카오 계정

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
                                        loadingOff();
                                        button.disabled = false;     // 버튼 활성화
                                        button.style.opacity = 1; // 투명도를 1로 설정
                                        alert("Welcome manager, "+ payload.properties.nickname)
                                        window.location.href = "/admin?id=" + nowUser + "&first=" +  "true";
                                    }
                                }
                                else {
                                    unlinkWithKakao() // 추후 이 코드 활성화 시켜 ROC이외 외부 인원을 차단시켜야함.
                                    window.location.href = "/"
                                }
                            }
                        })
                        .catch(error => {
                            alert("카카오 서버 오류, 사용자 정보를 가져오는데 실패했습니다.\n재시도 부탁드립니다.")
                            unlinkWithKakao()
                            window.location.href = "/"
                        });
                },
                fail: function (err) { // 로그인 실패시 오류 값 반환
                    loadingOff();
                    button.disabled = false;
                    button.style.opacity = 1; // 투명도를 0.5로 설정
                    unlinkWithKakao()
                    alert("You are not registered in the system.\nContact the Ghost Team.")
                    window.location.href = "/"
                },
            })
        }
    });
}