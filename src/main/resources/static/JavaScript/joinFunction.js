// 회원가입 버튼을 클릭했을 때 최초 실행되는 함수
function joinFunction() {
    // 이중 실행을 막기 위한 버튼 비활성화
    bntOff()

    // 사용자 카카오 이름과, id
    let nowUser = null;
    let userName = null;

    // 현재 시스템에 카카오 access token이 살아 있는지 확인
    Kakao.Auth.getStatusInfo(function(statusObj) {
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUser = statusObj.user.kakao_account.email; // 사용자 카카오 id
            userName = statusObj.user.properties.nickname

            // 해당 카카오 id가 디비에 기존에 있는지 검사한다.
            let verify_xhr = new XMLHttpRequest()
            verify_xhr.open('POST', '/checkForasking', true); // REST 정의
            verify_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
            verify_xhr.send(JSON.stringify({"Who" : nowUser}))
            verify_xhr.onload = function () {
                if (verify_xhr.status === 200 && verify_xhr.responseText !== "False") {
                    alert("안녕하십니까 " + userName + " manager님, " + "이미 가입이 되셨습니다!");
                    btnOn()
                    window.location.href = "/"
                }
                // 가입이 안된 경우 > 가입 페이지로
                else if (verify_xhr.status === 200 && verify_xhr.responseText === "False") {
                    btnOn()
                    emailSubmit();
                }
                // 서버 비정상 응답
                else {
                    unlinkWithKakao()
                    btnOn()
                    alert("서버 처리 지연\n재시도 부탁드립니다.");
                    window.location.href = "/"
                }
            };

            verify_xhr.timeout = 5000;

            // 서버에서 일정시간 응답이 없을 때,
            verify_xhr.ontimeout = function () {
                unlinkWithKakao()
                btnOn()
                alert("서버 처리 지연.\n재시도 부탁드립니다.")
                window.location.href = "/"
            };

            // 넷웤이 없는데 요청할때 실행
            verify_xhr.onerror = function () {
                unlinkWithKakao()
                btnOn()
                alert("인터넷 접속을 확인하세요.\n재시도 부탁드립니다.")
                window.location.href = "/"
            };
        }
        else {
            Kakao.Auth.login({
                // 로그인이 성공한 경우
                success: function (authObj) {
                    Kakao.Auth.setAccessToken(authObj.access_token); // 사용자 처음 로그인시 발급된 토큰으로 설정

                    // 로그인이 성공한 경우
                    Kakao.Auth.getStatusInfo(function(statusObj) {
                        // 동의 확인을 눌렀을 때
                        if (statusObj.status === 'connected') {
                            nowUser = statusObj.user.kakao_account.email; // 사용자 카카오 id
                            userName = statusObj.user.properties.nickname

                            // 기존 회원임을 검증 및
                            let verify_xhr = new XMLHttpRequest()
                            verify_xhr.open('POST', '/checkForasking', true); // REST 정의
                            verify_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
                            verify_xhr.send(JSON.stringify({"Who" : nowUser}))
                            verify_xhr.onload = function () {
                                if (verify_xhr.status === 200 && verify_xhr.responseText !== "False") {
                                    btnOn()
                                    window.location.href = "/"
                                    alert("안녕하십니까 " + userName + " manager님, " + "이미 가입이 되셨습니다!");
                                }
                                else if (verify_xhr.status === 200 && verify_xhr.responseText === "False") {
                                    btnOn()
                                    emailSubmit() // 이메일 인증으로 이동.
                                }
                                else {
                                    unlinkWithKakao()
                                    alert("서버에서 매니저님을 인증하는 과정에서 오류가 발생했습니다\n재시도 부탁드리겠습니다.");
                                    window.location.href = "/"
                                }
                            };

                            verify_xhr.timeout = 5000;

                            // 서버에서 일정시간 응답이 없을 때,
                            verify_xhr.ontimeout = function () {
                                unlinkWithKakao()
                                btnOn()
                                alert("서버 처리 지연.\n재시도 부탁드립니다.")
                                window.location.href = "/"
                            };

                            // 넷웤이 없는데 요청할때 실행
                            verify_xhr.onerror = function () {
                                unlinkWithKakao()
                                btnOn()
                                alert("인터넷 접속을 확인하세요.\n재시도 부탁드립니다.")
                                window.location.href = "/"
                            };
                        }
                        // 동의 취소 또는 다른 이유로 로그인이 실패한 경우
                        else {
                            btnOn()
                            unlinkWithKakao()
                            alert("가입을 위해 매니저님의 동의가 필요합니다!\n다시 join 부탁드립니다.")
                            window.location.href = "/"
                        }
                    });
                },
                fail: function (err) { // 로그인 실패시 오류 값 반환
                    btnOn()
                    loadingOff()
                    unlinkWithKakao()
                    alert("카카오 인증과정 문제가 발생헀습니다. 재시도 부탁드립니다.")
                    window.location.href = "/"
                },
            })
        }
    });
}

function btnOn() {
    let joinSpan = document.getElementById("join");
    joinSpan.disabled = false
    joinSpan.opacity = 1
    loadingOff()
}

function bntOff() {
    let joinSpan = document.getElementById("join");
    joinSpan.disabled = true
    joinSpan.opacity = 0.5
    loadingOn()
}