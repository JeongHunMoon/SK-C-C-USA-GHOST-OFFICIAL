function deleteSaveBtn(deleteInfo) {
    let button = document.getElementById("delete_save")
    button.disabled = true;     // 버튼 비활성화
    button.style.opacity = 0.5; // 투명도를 0.5로 설정
    loadingOn();
    // deleteOffBtn()
    loadingOn()

    // 현재 모든 폼 nodeList로 가져와서 > 비활성 카드는(반드시 안에 데이터들어 있다고 보장할 수 있음) > /delete 호출하면 됨(페이로드는 [{}, {}, {}]

    //카카오 접속 확인
    Kakao.Auth.getStatusInfo(function(statusObj) {
        let nowUserId = null;
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            deleteOnBtn()
            loadingOff()
            nowUserId = statusObj.user.kakao_account.email;

            console.log("이 값들이 디비에 삭제됨.", deleteInfo);
            // 비동기 작업 카운터 초기화
            let asyncTotalCounter = 0;
            let asyncCounter = 0; //What for?
            if (deleteInfo.length !== 0) {
                asyncTotalCounter += 1
            }
            console.log("=================", asyncTotalCounter)

            // delete 작업
            if (deleteInfo.length !== 0) {
                let confirmCheck = confirm("정말 삭제하시겠습니까?")
                if (confirmCheck === true) {
                    let delete_xhr = new XMLHttpRequest();
                    delete_xhr.open('POST', '/delete', true);
                    delete_xhr.setRequestHeader("Content-Type", "application/json");
                } else {
                    return 0;
                }
            } else if (deleteInfo.length === 0) {
                alert("선택된 데이터가 없습니다. 삭제가 필요한 카드를 선택하세요")
                return 0;
            }
        }
        //로그인 되어있지 않은 경우
        else {
            window.location.href = "/"
            deleteOffBtn();
            alert("로그인 세션이 만료되었습니다. 다시 로그인 부탁드립니다.")
        }
    });
}