function deleteSession(id) {
    let del_session_xhr = new XMLHttpRequest();
    del_session_xhr.open("GET", "/removeModify?id=" + id, true);
    del_session_xhr.send();

    del_session_xhr.onload = function () {
        if (del_session_xhr.status === 200) {
            if (del_session_xhr.responseText === "true") {
                window.location.href = "admin?id="+id;
            }
            else {
                alert("취소에 실패했습니다.\n삭제 페이지에서 cancel버튼을 다시 눌러주세요!")
                window.location.href = "/";
            }

        } else {
            alert("취소에 실패했습니다.\n삭제 페이지에서 cancel버튼을 다시 눌러주세요!")
            window.location.href = "/";
        }
    };

    // Timeout 설정 (예: 5초)
    del_session_xhr.timeout = 5000;

    // 서버에서 일정시간 응답이 없을 때,
    del_session_xhr.ontimeout = function () {
        alert("서버 응답 시간이 느립니다.\n삭제 페이지에서 cancel버튼을 다시 눌러주세요!")
        window.location.href = "/";
    };

    // 넷웤이 없는데 요청할때 실행
    del_session_xhr.onerror = function () {
        alert("네트워크가 끊겨있습니다.\n삭제 페이지에서 cancel버튼을 다시 눌러주세요!")
        window.location.href = "/";
    };
}