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
            loadingOff();
            button.disabled = false;     // 버튼 활성화
            button.style.opacity = 1; // 투명도를 1로 설정
            window.location.href = "/admin?id=" + nowUser + "&first=" +  "true";
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
                            alert("Welcome manager, "+ payload.properties.nickname)
                            loadingOff();
                            button.disabled = false;     // 버튼 활성화
                            button.style.opacity = 1; // 투명도를 1로 설정
                            window.location.href = "/admin?id=" + nowUser + "&first=" +  "true";
                        })
                        .catch(error => {
                            alert("카카오 서버 오류, 사용자 정보를 가져오는데 실패했습니다.\n재시도 부탁드립니다.")
                            window.location.href = "/"
                        });
                },
                fail: function (err) { // 로그인 실패시 오류 값 반환
                    alert("You are not registered in the system.\nContact the Ghost Team.")
                    loadingOff();
                    button.disabled = false;
                    button.style.opacity = 1; // 투명도를 0.5로 설정
                    window.location.href = "/"
                },
            })
        }
    });
}