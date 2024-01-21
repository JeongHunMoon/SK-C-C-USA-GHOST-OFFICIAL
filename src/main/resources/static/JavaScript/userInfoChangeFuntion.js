function userInfoChangeFuntion() {
    let nowUser = null;
    let userName = null;
    // span 태그를 가져옵니다.
    let changeBackground = document.createElement('div');
    changeBackground.id = 'changeBackground'; // 위 태그에 id를 부여한다.
    changeBackground.innerHTML = `
        <div id = "changeModalContainer">
            <div class = "changeModalHeader"> 회원정보 변경 </div>
            <div class = "changeModalBody"> 카카오톡 메세지 전송, 스케줄표 등록에 사용되는 이름과 공정 정보를 변경 하실 수 있습니다.</div>
            <div class = "changeModalInputContainer">
                <div class = "changeModalInputTextContainer">
                    <span class = "changeModalInputTitle"> 이름 </span>    
                    <input type = "text" placeholder = "이름 입력" id="value" class = "changeModalInputBody"></input>   
                </div>
                <div class="dropdown">
                        <button class="dropbtn"> 
                            <span class="dropbtn_icon"></span>
                            View Dropdown
                            </button>
                            <div class="dropdown-content">
                            <a href="#">AE</a>
                            <a href="#">ELEC</a>
                            <a href="#">CELL</a>
                            <a href="#">FORM</a>
                            <a href="#">PACK</a>
                            <a href="#">WMS</a>
                            <a href="#">COLL</a>
                            <a href="#">COMM</a>
                            </div>
                      </div>
            </div>
            <input type = "button" value = "Change" id = "changeModalSubmit"></input>
        </div>
    `;
    // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
    document.body.appendChild(changeBackground);
    loadingOff()

    // 클릭 이벤트에 대한 리스너를 추가합니다.
    changeBackground.getElementById('changeModalSubmit').addEventListener("changeModalSubmit", function() {
        // 클릭 시 실행될 함수를 여기에 작성합니다.
        alert("Span 태그가 클릭되었습니다!");
    })

    changeInfoBntOff()

    // Kakao.Auth.getStatusInfo(function(statusObj) {
    //     // 만약 사용자가 로그인이 되어 있는 경우
    //     if (statusObj.status === 'connected') {
    //         nowUser = statusObj.user.kakao_account.email; // 사용자 카카오 id
    //         userName = statusObj.user.properties.nickname
    //
    //         //이름 변경 후 저장 버튼 클릭시
    //         //현재 정보와 동일합니다
    //     }
    //     else {
    //         Kakao.Auth.login({
    //             // 로그인이 성공한 경우
    //             success: function (authObj) {
    //                 Kakao.Auth.setAccessToken(authObj.access_token); // 사용자 처음 로그인시 발급된 토큰으로 설정
    //
    //                 // 로그인이 성공한 경우
    //                 Kakao.Auth.getStatusInfo(function(statusObj) {
    //                     // 동의 확인을 눌렀을 때
    //                     if (statusObj.status === 'connected') {
    //                         nowUser = statusObj.user.kakao_account.email; // 사용자 카카오 id
    //                         userName = statusObj.user.properties.nickname
    //
    //                         // 기존 회원임을 검증 및
    //                         let verify_xhr = new XMLHttpRequest()
    //                         verify_xhr.open('POST', '/checkForasking', true); // REST 정의
    //                         verify_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
    //                         verify_xhr.send(JSON.stringify({"Who" : nowUser}))
    //                         verify_xhr.onload = function () {
    //                             if (verify_xhr.status === 200 && verify_xhr.responseText !== "False") {
    //                                 alert("안녕하십니까 " + userName + " manager님, " + "이미 가입이 되셨습니다!");
    //                                 btnOn()
    //                                 window.location.href = "/"
    //                             }
    //                             else if (verify_xhr.status === 200 && verify_xhr.responseText === "False") {
    //                                 emailSubmit() // 이메일 인증으로 이동.
    //                             }
    //                             else {
    //                                 alert("서버에서 매니저님을 인증하는 과정에서 오류가 발생했습니다\n재시도 부탁드리겠습니다.");
    //                                 unlinkWithKakao()
    //                                 window.location.href = "/"
    //                             }
    //                         };
    //                     }
    //                     // 동의 취소 또는 다른 이유로 로그인이 실패한 경우
    //                     else {
    //                         alert("가입을 위해 매니저님의 동의가 필요합니다!\n다시 join 부탁드립니다.")
    //                         bntOff()
    //                         unlinkWithKakao()
    //                         window.location.href = "/"
    //                     }
    //                 });
    //             },
    //             fail: function (err) { // 로그인 실패시 오류 값 반환
    //                 alert("카카오 인증과정 문제가 발생헀습니다. 재시도 부탁드립니다.")
    //                 bntOff()
    //                 loadingOff()
    //             },
    //         })
    //     }
    // });
}


function changeInfoBtnOn() {
    let changeSpan = document.getElementById("change");
    changeSpan.disabled = false
    changeSpan.opacity = 1
    loadingOff()
}

function changeInfoBntOff() {
    let changeSpan = document.getElementById("change");
    changeSpan.disabled = true
    changeSpan.opacity = 0.5
    // loadingOn()
}