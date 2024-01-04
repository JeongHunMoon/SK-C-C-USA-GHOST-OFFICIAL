// Ver .2 > 운영자 로그인 함수
function loginWithKakaoForAdmin() {
    Kakao.Auth.login({
        // 로그인이 성공한 경우
        success: function (authObj) {
            Kakao.Auth.setAccessToken(authObj.access_token); // 사용자 처음 로그인시 발급된 토큰으로 설정
            window.location.href = '/admin'

        },
        fail: async function (err) { // 로그인 실패시 오류 값 반환
            alert("You are not registered in the system.\nContact the Ghost Team.")
        },
    })
}