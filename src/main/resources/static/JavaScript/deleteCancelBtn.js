function deleteCancelBtn() {
    let button = document.getElementById("delete_cancel") //로그인 버튼을 비활성화 하기 위한 태그 가져오기
    let nowUser = null;
    button.disabled = true;     // 버튼 비활성화
    button.style.opacity = 0.5; // 투명도를 0.5로 설정
    loadingOn();

    //최초 사용자(운영자) 이미 카카오 로그인이 되어있는지 판단.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUser = statusObj.user.kakao_account.email; // 사용자 카카오 id

            let delete_xhr = new XMLHttpRequest();
            delete_xhr.open("GET", "/removeModify?id=" + nowUser, true);
            delete_xhr.send();

            // Timeout 설정 (예: 5초)
            delete_xhr.timeout = 5000;

            delete_xhr.onload = function () {
                if (delete_xhr.status === 200) {
                    if (delete_xhr.responseText === "true") {
                        alert("취소되었습니다.")
                        loadingOff();
                        button.disabled = false;     // 버튼 활성화
                        button.style.opacity = 1; // 투명도를 1로 설정
                        window.location.href = "admin?id="+nowUser;
                    }
                    else {
                        alert("취소에 실패했습니다.\n삭제 페이지에서 cancel버튼을 다시 눌러주세요!")
                        loadingOff();
                        button.disabled = false;     // 버튼 활성화
                        button.style.opacity = 1; // 투명도를 1로 설정
                        window.location.href = "/";
                    }

                } else {
                    alert("취소에 실패했습니다.\n삭제 페이지에서 cancel버튼을 다시 눌러주세요!")
                    loadingOff();
                    button.disabled = false;     // 버튼 활성화
                    button.style.opacity = 1; // 투명도를 1로 설정
                    window.location.href = "/";
                }
            };

            // 서버에서 일정시간 응답이 없을 때,
            delete_xhr.ontimeout = function () {
                alert("서버 응답 시간이 느립니다.\n삭제 페이지에서 cancel버튼을 다시 눌러주세요!")
                loadingOff();
                button.disabled = false;     // 버튼 활성화
                button.style.opacity = 1; // 투명도를 1로 설정
                window.location.href = "/";
            };

            // 넷웤이 없는데 요청할때 실행
            delete_xhr.onerror = function () {
                alert("네트워크가 끊겨있습니다.\n삭제 페이지에서 cancel버튼을 다시 눌러주세요!")
                loadingOff();
                button.disabled = false;     // 버튼 활성화
                button.style.opacity = 1; // 투명도를 1로 설정
                window.location.href = "/";
            };

        }

        // 사용자가 현재 브라우저에 카카오 로그인이 안되어 있는 경우
        else {
            alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요")
            loadingOff();
            button.disabled = false;     // 버튼 활성화
            button.style.opacity = 1; // 투명도를 1로 설정
            window.location.href = "/"
        }
    });
}