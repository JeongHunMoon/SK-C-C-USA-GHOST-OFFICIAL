// 회원 정보 입력.
function signUp(emailBackgroundDiv){
    let nowUserId = null;
    let nowUserNickName = null;

    Kakao.Auth.getStatusInfo(function(statusObj) {
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUserId = statusObj.user.kakao_account.email;
            nowUserNickName = statusObj.user.kakao_account.profile.nickname
            // 동적 DOM 트리로써 이메일 입력을 위한 HTML 생성

            let modalContainer = document.createElement('div');
            modalContainer.id = 'signUpModalContainer'; // 위 태그에 id를 부여한다.
            modalContainer.innerHTML = `
                <div class = "signUpModalHeader"><span>정보 입력</span></div>
                <div class = "signUpModalSection"><span>입력 하시는 성함은 추후 스케줄 관리에 사용 되실 이름 입니다.<br>가입 이후 성함과 공정은 언제 든지 변경 가능 합니다.<br><br>ex) 김길동, 이길동, 박길동</span></div>
                <div class = "signUpModalInputContainer">
                    <label class="signUpLabel" for="value1">Name</label>
                    <input type="text" class="signUpInput" id="signUpInput1">
                    
                    <label class="signUpLabel" for="value2">Process</label>
                    <select id="signUpInput2" class="signUpInput">
                        <option value="AE">AE</option>
                        <option value="ELEC">Electrode</option>
                        <option value="CELL">Assembly</option>
                        <option value="FORM">Formation</option>
                        <option value="PACK">Module</option>
                        <option value="WMS">WMS</option>
                        <option value="COLL">Collection</option>
                        <option value="COMM">Common</option>
                        <option value="PMO">PMO</option>
                    </select>   
                    <input type = "button" value = "DONE" id = "signUpModalSubmit">
                </div>
            `;

            emailBackgroundDiv.appendChild(modalContainer);
            document.getElementById('signUpModalSubmit').addEventListener('click', function() {
                signBtnOff()
                loadingOn()
                memberSubmitBtn(nowUserId, emailBackgroundDiv);
            });
        }
        else {
            alert("죄송합니다. 로그인 세션이 만료되었습니다.\n회원가입 재시도 부탁드립니다.")
            window.location.href = "/"
        }
    })
}

function memberSubmitBtn(nowUserId, emailBackgroundDiv) {
    // Name 입력 필드의 값을 가져옴
    let nameInputValue = document.getElementById("signUpInput1").value;

    // Process 선택 박스의 선택된 값을 가져옴
    let processSelect = document.getElementById("signUpInput2");
    let processSelectedValue = processSelect.options[processSelect.selectedIndex].value;

    // Name이 비어있으면 알림창을 띄움
    nameInputValue = nameInputValue.trim()
    nameInputValue = nameInputValue.trim()
    console.log(nameInputValue);

    if (nameInputValue === "") {
        loadingOff()
        signBtnOn()
        alert("이름을 입력하세요.");
    }
    else {
        // 이름이 이미 있는지 검증 하는 REST
        let verifyName_xhr = new XMLHttpRequest()
        verifyName_xhr.open('POST', '/judgeName', true); // REST 정의
        verifyName_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
        verifyName_xhr.send(JSON.stringify({"name" : nameInputValue}))

        verifyName_xhr.onload = function () {
            if (verifyName_xhr.status === 200 && verifyName_xhr.responseText === "True") {

                console.log("사용자 카카오 아이디:", nowUserId)
                console.log("이름 입력 완료:"+ nameInputValue+"///");
                console.log("Process 선택:"+processSelectedValue);

                let confirmed = confirm("입력하신 정보로 완료 하시겠습니까?");
                if (confirmed) {
                    console.log("최종저장이름."+nameInputValue)
                    // 입력된 정보를 삽입하기 위한 RSET
                    let new_xhr = new XMLHttpRequest()
                    new_xhr.open('POST', '/insertJoinInfo', true); // REST 정의
                    new_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
                    new_xhr.send(JSON.stringify({"id" : nowUserId, "name" : nameInputValue, "process" : processSelectedValue}))
                    new_xhr.onload = function () {
                        if (new_xhr.status === 200 && new_xhr.responseText === "True") {
                            loadingOff()
                            signBtnOn()
                            document.body.removeChild(emailBackgroundDiv);
                            alert("안녕하십니까 " + nameInputValue + " manager 님, " + "가입이 완료되었습니다!");
                            window.location.href = "/"
                        }
                        else {
                            unlinkWithKakao()
                            alert("죄송합니다. 서버에서 매니저님을 생성하는 과정에서 오류가 발생했습니다\n이미 카카오 아이디가 사용 중 인 것 같습니다.\n카카오 계정 변경 후 재시도 부탁드리겠습니다.");
                            window.location.href = "/"
                        }
                    };
                }
                else {
                    loadingOff()
                    signBtnOn()
                    alert("취소되었습니다.")
                }
            }
            else if (verifyName_xhr.status === 200 && verifyName_xhr.responseText === "False") {
                loadingOff()
                signBtnOn()
                alert("매니저님 성함은 이미 사용 중입니다.\n"+nameInputValue+"2 와같이 구별 하시는 것을 추천드립니다!");
                nameInputValue.value = "";
            }
            else {
                loadingOff()
                signBtnOn()
                alert("서버에서 매니저님을 인증하는 과정에서 오류가 발생했습니다\n재시도 부탁드리겠습니다.");
                unlinkWithKakao()
                window.location.href = "/"
            }
        };

        verifyName_xhr.timeout = 15000;

        // 서버에서 일정시간 응답이 없을 때,
        verifyName_xhr.ontimeout = function () {
            loadingOff()
            signBtnOn()
            alert("서버 처리 지연.\n가입 재시도 부탁드립니다.")
            window.location.href = "/"
        };

        // 넷웤이 없는데 요청할때 실행
        verifyName_xhr.onerror = function () {
            loadingOff()
            signBtnOn()
            alert("인터넷 접속을 확인하세요.\n가입 재시도 부탁드립니다.")
            window.location.href = "/"
        };
    }
}

function signBtnOn() {
    let btn = document.getElementById('signUpModalSubmit');
    btn.disabled = false;     // 버튼 활성화
    btn.style.opacity = 1;

}

function signBtnOff() {
    let btn = document.getElementById('signUpModalSubmit');
    btn.disabled = true;     // 비활성화
    btn.style.opacity = 0.5;
}