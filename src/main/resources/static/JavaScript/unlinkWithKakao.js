// ROC 사람이 아닌 사람이 로그인 시도한 경우 호출됨 > 로그아웃 처리
function unlinkWithKakao() {
    Kakao.Auth.logout(function() {
        console.log('Successfully logged out');
    }, function(error) {
        console.log('Logout failed, reason: ' + error);
    });

}