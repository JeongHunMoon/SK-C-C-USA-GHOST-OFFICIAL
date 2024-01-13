function deleteCancelBtn() {
    let button = document.getElementById("cancel_btn") //로그인 버튼을 비활성화 하기 위한 태그 가져오기
    button.disabled = true;     // 버튼 비활성화
    button.style.opacity = 0.5; // 투명도를 0.5로 설정
    loadingOn();
    //최초 사용자(운영자) 이미 카카오 로그인이 되어있는지 판단.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUser = statusObj.user.kakao_account.email; // 사용자 카카오 id
            alert("취소되었습니다.")
            loadingOff();
            button.disabled = false;     // 버튼 활성화
            button.style.opacity = 1; // 투명도를 1로 설정
            window.location.href = "/admin?id=" + nowUser + "&first=" +  "true"; //Getmapping
        }

        // 사용자가 현재 브라우저에 카카오 로그인이 안되어 있는 경우
        else {
            alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요")
            window.location.href = "/"
        }
    });



}