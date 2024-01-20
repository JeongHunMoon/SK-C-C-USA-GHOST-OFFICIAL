function joinFunction() {
    bntOff()
    let nowUser = null;
    let userName = null;

    Kakao.Auth.getStatusInfo(function(statusObj) {
        // 만약 사용자가 로그인이 되어 있는 경우
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
                    alert("안녕하십니까 " + userName + " manager님, " + "이미 가입이 되셨습니다!");
                    btnOn()
                    window.location.href = "/"
                }
                // 가입이 안된 경우 > 가입 페이지로
                else if (verify_xhr.status === 200 && verify_xhr.responseText === "False") {
                    emailSubmit();
                }
                // 서버 비정상 응답
                else {
                    unlinkWithKakao()
                    window.location.href = "/"
                }
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
                                    alert("안녕하십니까 " + userName + " manager님, " + "이미 가입이 되셨습니다!");
                                    btnOn()
                                    window.location.href = "/"
                                }
                                else if (verify_xhr.status === 200 && verify_xhr.responseText === "False") {
                                    emailSubmit() // 이메일 인증으로 이동.
                                }
                                else {
                                    alert("서버에서 매니저님을 인증하는 과정에서 오류가 발생했습니다\n재시도 부탁드리겠습니다.");
                                    unlinkWithKakao()
                                    window.location.href = "/"
                                }
                            };
                        }
                        // 동의 취소 또는 다른 이유로 로그인이 실패한 경우
                        else {
                            alert("가입을 위해 매니저님의 동의가 필요합니다!\n다시 join 부탁드립니다.")
                            bntOff()
                            unlinkWithKakao()
                            window.location.href = "/"
                        }
                    });
                },
                fail: function (err) { // 로그인 실패시 오류 값 반환
                    alert("카카오 인증과정 문제가 발생헀습니다. 재시도 부탁드립니다.")
                    bntOff()
                    loadingOff()
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