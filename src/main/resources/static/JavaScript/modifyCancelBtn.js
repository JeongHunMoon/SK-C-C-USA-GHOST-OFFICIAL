function modifyCancelBtn() {
    document.getElementById("modify_cancel").disabled = true;     // 버튼 비활성화
    document.getElementById("modify_cancel").style.opacity = 0.5;     // 버튼 비활성화

    Kakao.Auth.getStatusInfo(function(statusObj) {
        let nowUserId = null;
        let nowUserNiname = null;

        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUserId = statusObj.user.kakao_account.email;
            nowUserNiname = statusObj.user.kakao_account.profile.nickname

            window.location.href = "/removeModify?id=" + nowUserId;
            document.getElementById("modify_cancel").disabled = false;
            document.getElementById("modify_cancel").style.opacity = 1;
            alert("취소되었습니다.")
        }
        else {
            window.location.href = "/"
            document.getElementById("modify_cancel").disabled = false;
            document.getElementById("modify_cancel").style.opacity = 1;
            alert("세션이 만료되었습니다. 로그인을 다시해주세요.")
        }
    })
}