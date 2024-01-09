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
            alert("welcome manager, "+ statusObj.user.kakao_account.profile.nickname)
            loadingOff();
            button.disabled = false;     // 버튼 활성화
            button.style.opacity = 1; // 투명도를 1로 설정
            window.location.href = "/admin?id=" + nowUser
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
                    let url = 'https://kapi.kakao.com/v2/user/me'
                    let xhr = new XMLHttpRequest(); // REST API 통신을 위한 객체
                    xhr.open('GET', url, true); // REST API로 url에 통신하여 내 친구 목록 Parsing.
                    xhr.setRequestHeader('Authorization', 'Bearer ' + authObj.access_token);// 헤더에 Authorization 추가
                    xhr.send();

                    xhr.onload = function () { // 로그인 시도한 사용자의 프로필 정보 가져오기
                        let payload = JSON.parse(xhr.responseText) // 서버로부터 전송 받은 페이로드를 parsing
                        nowUser = payload.kakao_account.email; // 사용자 카카오 계정
                        alert("welcome manager, "+ payload.properties.nickname)
                        loadingOff();
                        window.location.href = "/admin?id=" + nowUser

                    }
                },
                fail: async function (err) { // 로그인 실패시 오류 값 반환
                    alert("You are not registered in the system.\nContact the Ghost Team.")
                    loadingOff();

                    button.disabled = false;
                    button.style.opacity = 1; // 투명도를 0.5로 설정
                },
            })
        }
    });
}