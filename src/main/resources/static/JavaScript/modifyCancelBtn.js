function modifyCancelBtn() {
    bntOff()

    Kakao.Auth.getStatusInfo(function(statusObj) {
        let nowUserId = null;
        let nowUserNiname = null;

        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUserId = statusObj.user.kakao_account.email;
            nowUserNiname = statusObj.user.kakao_account.profile.nickname


            let xhr = new XMLHttpRequest();
            xhr.open("GET", "/removeModify?id="+nowUserId, true);

            // Timeout 설정 (예: 5초)
            xhr.timeout = 5000;

            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (xhr.responseText === "true") {
                        bntON()
                        alert("취소되었습니다.")
                        window.location.href = "admin?id="+nowUserId;
                    }
                    else {
                        bntON()
                        alert("잘못된 접근입니다.")
                        window.location.href = "/";
                    }

                } else {
                    bntON()
                    alert("취소 실패. 다시 취소 부탁드립니다.")
                }
            };

            // 서버에서 일정시간 응답이 없을 때,
            xhr.ontimeout = function () {
                bntON()
                alert("Request timed out. Please try again.");
            };

            // 넷웤이 없는데 요청할때 실행
            xhr.onerror = function () {
                bntON()
                alert("Network error occurred. Please check your connection and try again.");
            };

            // 프론트에서 네트워크가 있는 경우에 전송
            if (navigator.onLine) {
                xhr.send();
            } else {
                bntON()
                location.reload();
                alert("No internet connection. Please check your connection and try again.");
            }
        }
        else {
            window.location.href = "/"
            bntON()
            alert("세션이 만료되었습니다. 로그인을 다시해주세요.")
        }
    })
}


function bntON() {
    document.getElementById("modify_cancel").disabled = false;
    document.getElementById("modify_cancel").style.opacity = 1;
}

function bntOff() {
    document.getElementById("modify_cancel").disabled = true;     // 버튼 비활성화
    document.getElementById("modify_cancel").style.opacity = 0.5;     // 버튼 비활성화
}