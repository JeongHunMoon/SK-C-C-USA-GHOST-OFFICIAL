// ROC 사람이 아닌 사람이 로그인 시도한 경우 호출됨 > 로그아웃 처리
function unlinkWithKakao() {
    Kakao.API.request({
        url: '/v1/user/unlink',
        success: function (response) {
            alert("Goodbye :)");
        },
        fail: function (error) {
            console.log(error);
        }
    });
}