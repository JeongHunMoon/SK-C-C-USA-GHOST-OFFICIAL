// 카카오톡 => 계정 => 외부 서비에서 GHOST 등록을 해제 하는 코드(관리자 운영)
function unlinkWithKakao() {
    Kakao.API.request({
        url: '/v1/user/unlink',
        success: function (response) {
            alert("unlink :" + JSON.stringify(response));
        },
        fail: function (error) {
            console.log(error);
        }
    });
}