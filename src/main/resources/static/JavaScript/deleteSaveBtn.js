function deleteSaveBtn() {
    deleteOffBtn()
    loadingOn()
    // 현재 모든 폼 nodeList로 가져와서 > 비활성 카드는(반드시 안에 데이터들어 있다고 보장할 수 있음) > /delete 호출하면 됨(페이로드는 [{}, {}, {}]

    // 최초 : 카카오 접속 확인
    Kakao.Auth.getStatusInfo(function(statusObj) {
        let nowUserId = null;
        let nowUserNiname = null;
        let tableSelect = null;
        let rocMembers = null; //Whatfor
        let flag  = true; //What for
        let noChange = true; //What for
        let deleteInfo = []; // "A" > ""
        let firstClick= 0;
        let clickFlag = -1; // 1 인경우 : 선택된 상태,  -1인 경우 : 미선택된 상태
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            console.log("연결됨");
            deleteOnBtn()
            loadingOff()
            nowUserId = statusObj.user.kakao_account.email;
            // nowUserNiname = statusObj.user.kakao_account.profile.nickname;

        }
        //로그인 되어있지 않은 경우
        else {
            window.location.href = "/"
            document.getElementById("modify_save").disabled = false;
            document.getElementById("modify_save").style.opacity = 1;
            alert("로그인 세션이 만료되었습니다. 다시 로그인 부탁드립니다. ")
        }
    });

}