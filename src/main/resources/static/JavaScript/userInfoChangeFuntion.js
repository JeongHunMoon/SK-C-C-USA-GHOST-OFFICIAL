function userInfoChangeFuntion() {
    editBntOff()
    loadingOn()
    let nowUser = null;

    //최초 사용자(운영자) 이미 카카오 로그인이 되어있는지 판단.
    Kakao.Auth.getStatusInfo(function (statusObj) {
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUser = statusObj.user.kakao_account.email; // 사용자 카카오 id

            // 이 계정이 등록되어 있는 DB 조회하여 판단.
            let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
            let infor = {"Who": nowUser} // 서버로 사용자의 카카오 id를 요청하여 DB에 등록되어 있는지 검증한다.
            xhr_check.open('POST', '/checkForasking', true); // REST 정의
            xhr_check.setRequestHeader("Content-Type", "application/json"); // 헤더 설정
            xhr_check.send(JSON.stringify(infor)) // REST 요청

            // REST 응답
            xhr_check.onload = function () {
                if (xhr_check.status === 200) {
                    let results = xhr_check.responseText; // 서버의 payload

                    // DB에 등록되지 않은 사용자이므로 경고창 후 로그인 차단
                    if (results === "False") {
                        loadingOff()
                        editBtnOn()
                        unlinkWithKakao()
                        alert("You are not registered in the system.\nContact the Ghost Team.")
                    }

                    // 서버에 등록된 ROC 사람인 경우
                    else {
                        loadingOff()
                        editBtnOn()
                        changeUserInfoFunction(nowUser)
                    }
                } else {
                    loadingOff()
                    editBtnOn()
                    unlinkWithKakao()
                    window.location.href = "/"
                }
            }
        }

        // 사용자가 현재 브라우저에 카카오 로그인이 안되어 있는 경우
        else {
            // 사용자 카카오 로그인을 진행한다.
            Kakao.Auth.login({
                // 로그인이 성공한 경우
                success: function (authObj) {
                    Kakao.Auth.setAccessToken(authObj.access_token); // 사용자 처음 로그인시 발급된 토큰으로 설정

                    // 로그인한 사용자 정보 가져오는 REST
                    let url = 'https://kapi.kakao.com/v2/user/me';

                    // Authorization 헤더 설정
                    let headers = new Headers({
                        'Authorization': 'Bearer ' + authObj.access_token
                    });

                    // fetch 요청
                    fetch(url, {method: 'GET', headers: headers})
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(payload => {
                            nowUser = payload.kakao_account.email; // 사용자 카카오 계정

                            // 이 계정이 등록되어 있는 DB 조회하여 판단.
                            let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
                            let infor = {"Who": nowUser} // 서버로 사용자의 카카오 id를 요청하여 DB에 등록되어 있는지 검증한다.
                            xhr_check.open('POST', '/checkForasking', true); // REST 정의
                            xhr_check.setRequestHeader("Content-Type", "application/json"); // 헤더 설정
                            xhr_check.send(JSON.stringify(infor)) // REST 요청

                            // REST 응답
                            xhr_check.onload = function () {
                                if (xhr_check.status === 200) {
                                    let results = xhr_check.responseText; // 서버의 payload

                                    // DB에 등록되지 않은 사용자이므로 경고창 후 로그인 차단
                                    if (results === "False") {
                                        loadingOff()
                                        editBtnOn()
                                        unlinkWithKakao()
                                        alert("You are not registered in the system.\nContact the Ghost Team.")
                                    }

                                    // 서버에 등록된 ROC 사람인 경우
                                    else {
                                        loadingOff()
                                        editBtnOn()
                                        changeUserInfoFunction(nowUser)
                                    }
                                } else {
                                    loadingOff()
                                    editBtnOn()
                                    unlinkWithKakao()
                                    window.location.href = "/"
                                }
                            }
                        })
                        .catch(error => {
                            loadingOff()
                            editBtnOn()
                            unlinkWithKakao()
                            alert("카카오 서버 오류, 사용자 정보를 가져오는데 실패했습니다.\n재시도 부탁드립니다.")
                            window.location.href = "/"
                        });
                },
                fail: function (err) { // 로그인 실패시 오류 값 반환
                    loadingOff()
                    editBtnOn()
                    unlinkWithKakao()
                    alert("You are not registered in the system.\nContact the Ghost Team.")
                    window.location.href = "/"
                },
            })
        }
    });
}

function changeUserInfoFunction(nowUser) {
    let changeBackground = document.createElement('div');
    changeBackground.setAttribute("id", "changeBackground")

    let changeModalContainer = document.createElement('div');
    changeModalContainer.id = 'changeModalContainer'; // 위 태그에 id를 부여한다.
    changeModalContainer.innerHTML = `
        <div id = "changeModalHeader">회원 정보 변경</div>
        <div id = "changeModalSection"><span>카카오톡 메세지 전송, 스케줄표 등록에 사용되는 이름과 공정 정보를 변경 하실 수 있습니다.</span></div>
        <div id = "changeModalInputContainer">
            <label class="signUpLabel" for="value1">Name</label>
                <input type="text" class="signUpInput" id="changeInput1">
                
                <label class="signUpLabel" for="value2">Process</label>
                <select id="changeInput2" class="signUpInput">
                    <option value="AE">AE</option>
                    <option value="ELEC">Electrode</option>
                    <option value="CELL">Assembly</option>
                    <option value="FORM">Formation</option>
                    <option value="PACK">Module</option>
                    <option value="WMS">WMS</option>
                    <option value="COLL">Collection</option>
                    <option value="COMM">Common</option>
                </select>   
                <input type = "button" value = "DONE" id = "changeModalSubmit">
        </div>
       
    `;
    // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
    changeBackground.appendChild(changeModalContainer)
    document.body.appendChild(changeBackground);

    document.getElementById('changeModalSubmit').addEventListener('click', function() {
        editBntOff()
        changeUserInfoBtn(nowUser);
    });
}

function changeUserInfoBtn(nowUser) {
    // 사용자 아이디 검증할 필요 x 무조건 디비에 사용자 정보 있다고 보장할 수 있음.
    // 기존에 저장된 정보(이름, 공정)이 달라진게 하나도 없다면 그냥 그대로둘까?
}

function editBtnOn() {
    let btn = document.getElementById("changeModalSubmit");
    let btn2 = document.getElementById("change");

    if (btn) {
        btn.disabled = false;
        btn.style.opacity = 1;
    }

    if (btn2) {
        btn2.disabled = false;
        btn2.style.opacity = 1;
    }
}

function editBntOff() {
    let btn = document.getElementById("changeModalSubmit");
    let btn2 = document.getElementById("change");

    if (btn) {
        btn.disabled = true;
        btn.style.opacity = 0.5;
    }

    if (btn2) {
        btn2.disabled = true;
        btn2.style.opacity = 0.5;
    }
}
