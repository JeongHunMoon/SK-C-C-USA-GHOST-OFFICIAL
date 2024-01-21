function modifyBtn(start, end ) {
    document.getElementById("modify_schedule").disabled = true;     // 버튼 비활성화
    document.getElementById("modify_schedule").style.opacity = 0.5;     // 버튼 비활성화

    Kakao.Auth.getStatusInfo(function(statusObj) {
        let nowUserId = null;
        let nowUserNicname = null;

        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUserId = statusObj.user.kakao_account.email;
            nowUserNicname = statusObj.user.kakao_account.profile.nickname

            document.getElementById("modify_schedule").disabled = false;
            document.getElementById("modify_schedule").style.opacity = 1;
            window.location.href = '/modifySchedule?id=' + nowUserId + "&start=" + start + "&end=" + end;
        }
        else {
            document.getElementById("modify_schedule").disabled = false;
            document.getElementById("modify_schedule").style.opacity = 1;
            alert("로그인 세션이 만료되었습니다. 다시 로그인 부탁드립니다. ")
            window.location.href = "/"
        }
    })
}