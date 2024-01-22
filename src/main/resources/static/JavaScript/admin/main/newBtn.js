function newBtn() {
    document.getElementById("new_schedule").disabled = true;     // 버튼 비활성화
    document.getElementById("new_schedule").style.opacity = 0.5;     // 버튼 비활성화

    Kakao.Auth.getStatusInfo(function(statusObj) {
        let nowUserId = null;
        let nowUserNiname = null;

        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUserId = statusObj.user.kakao_account.email;
            nowUserNiname = statusObj.user.kakao_account.profile.nickname

            document.getElementById("new_schedule").disabled = false;     // 버튼 비활성화
            document.getElementById("new_schedule").style.opacity = 1;     // 버튼 비활성화
            window.location.href = '/newSchedule?id=' + nowUserId;
        }
        else {
            document.getElementById("new_schedule").disabled = false;     // 버튼 비활성화
            document.getElementById("new_schedule").style.opacity = 1;     // 버튼 비활성화
            alert("로그인 세션이 만료되었습니다. 다시 로그인 부탁드립니다. ")
            window.location.href = "/"
        }
    })
}