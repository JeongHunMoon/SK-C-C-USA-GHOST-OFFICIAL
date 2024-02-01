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
            let infor = {"id": nowUser} // 서버로 사용자의 카카오 id를 요청하여 DB에 등록되어 있는지 검증한다.
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
                        alert("You are not registered in the system.\nPlease click the “Join” button to join.")
                        window.location.href = "/"
                    }

                    // 서버에 등록된 ROC 사람인 경우
                    else {
                        changeUserInfoFunction(nowUser)
                    }
                } else {
                    loadingOff()
                    editBtnOn()
                    unlinkWithKakao()
                    alert("죄송합니다. 서버에서 매니저님 계정이 존재하는지 확인 중 에러가 발생했습니다.\n재시도 부탁드립니다.")
                    window.location.href = "/"
                }
            }

            xhr_check.timeout = 10000;

            // 서버에서 일정시간 응답이 없을 때,
            xhr_check.ontimeout = function () {
                loadingOff()
                viewBtnOn()
                alert("서버 처리 지연.\n가입 재시도 부탁드립니다.")
                window.location.href = "/"
            };

            // 넷웤이 없는데 요청할때 실행
            xhr_check.onerror = function () {
                loadingOff()
                viewBtnOn()
                alert("인터넷 접속을 확인하세요.\n가입 재시도 부탁드립니다.")
                window.location.href = "/"
            };
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
                                loadingOff()
                                editBtnOn()
                                unlinkWithKakao()
                                alert("죄송합니다. 서버에서 매니저님 계정이 존재하는지 확인 중 에러가 발생했습니다.\n재시도 부탁드립니다.")
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(payload => {
                            nowUser = payload.kakao_account.email; // 사용자 카카오 계정

                            // 이 계정이 등록되어 있는 DB 조회하여 판단.
                            let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
                            let infor = {"id": nowUser} // 서버로 사용자의 카카오 id를 요청하여 DB에 등록되어 있는지 검증한다.
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
                                        alert("You are not registered in the system.\nPlease click the “Join” button to join.")
                                        window.location.href = "/"
                                    }

                                    // 서버에 등록된 ROC 사람인 경우
                                    else {
                                        changeUserInfoFunction(nowUser)
                                    }
                                } else {
                                    loadingOff()
                                    editBtnOn()
                                    unlinkWithKakao()
                                    alert("죄송합니다. 서버에서 매니저님 계정이 존재하는지 확인 중 에러가 발생했습니다.\n재시도 부탁드립니다.")
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
                    alert("Please agree to join!")
                    window.location.href = "/"
                },
            })
        }
    });
}

function changeUserInfoFunction(nowUser) {
    // 사용자의 기본 정보를 가져온다.
    let getUserInfo_xhr = new XMLHttpRequest()
    getUserInfo_xhr.open('POST', '/getUserInfoFromId', true); // REST 정의
    getUserInfo_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
    getUserInfo_xhr.send(JSON.stringify({"id": nowUser}))
    getUserInfo_xhr.onload = function () {
        let res = JSON.parse(getUserInfo_xhr.response)
        if (getUserInfo_xhr.status === 200 && Object.keys(res).length !== 0) {
            let asIsName = res.name;
            let asIsProcess = res.process;

            let changeBackground = document.createElement('div');
            changeBackground.setAttribute("id", "changeBackground")

            let changeModalContainer = document.createElement('div');
            changeModalContainer.id = 'changeModalContainer'; // 위 태그에 id를 부여한다.
            changeModalContainer.innerHTML = `
                <div id = "changeModalExit"></div>    
                <div id = "changeModalHeader">회원 정보 변경</div>
                <div id = "changeModalSection"><span>카카오톡 메세지 전송, 스케줄표 등록에 사용되는 이름과 공정 정보를 변경 하실 수 있습니다.
                        <br><br><span style="text-decoration: underline;">기존 정보 : "${asIsName}" / ${asIsProcess}</span></span></div>
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
                            <option value="PMO">PMO</option>
                        </select>   
                        <input type = "button" value = "DONE" id = "changeModalSubmit">
                </div>
            `;

            // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
            changeBackground.appendChild(changeModalContainer)
            document.body.appendChild(changeBackground);

            document.getElementById('changeModalSubmit').addEventListener('click', function() {
                editBntOff()
                loadingOn()
                changeUserInfoBtn(nowUser, changeBackground);
            });

            document.getElementById('changeModalExit').addEventListener('click', function() {
                document.body.removeChild(changeBackground);
            });

            editBtnOn()
            loadingOff()
        }
        else if (getUserInfo_xhr.status === 200 && Object.keys(res).length === 0) {
            editBtnOn()
            loadingOff()
            alert("불편을 끼쳐드려 죄송합니다. 시스템에서 매니저님의 카카오 ID가 등록되어 있지 않습니다.\nGHOST팀에게 문의 부탁드립니다.")
            unlinkWithKakao()
            window.location.href = "/"
        }

        else {
            editBtnOn()
            loadingOff()
            alert("불편을 끼쳐드려 죄송합니다. 시스템에서 매니저님의 카카오 ID를 찾는 중 오류가 발생했습니다.\n재시도 부탁드립니다.")
            unlinkWithKakao()
            window.location.href = "/"
        }
    };
}

function changeUserInfoBtn(nowUser, changeBackground) {
    // 사용자 아이디 검증할 필요 x 무조건 디비에 사용자 정보 있다고 보장할 수 있음.
    let newName = document.getElementById("changeInput1").value;
    let newProcess = document.getElementById("changeInput2").value;
    newName = newName.trim();
    newName = newName.trim();

    if (newName === "") {
        loadingOff()
        editBtnOn()
        alert("이름을 입력하세요.");
    }
    else {
        // 변경될 이름이 본인 이름이랑 같은 경우
        let getUserName_xhr = new XMLHttpRequest()
        getUserName_xhr.open('POST', '/getUserNameFromId', true); // REST 정의
        getUserName_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
        getUserName_xhr.send(JSON.stringify({"id": nowUser}))
        getUserName_xhr.onload = function () {
            if (getUserName_xhr.status === 200 && getUserName_xhr.responseText !== "False") {
                // 요청자의 이름 변경이 없는 경우
                if (getUserName_xhr.responseText === newName) {
                    let confirmed = confirm("입력하신 정보로 완료 하시겠습니까?");
                    if (confirmed) {
                        console.log("최종저장이름." + newName)
                        // 입력된 정보를 삽입하기 위한 RSET
                        let new_xhr = new XMLHttpRequest()
                        new_xhr.open('POST', '/updateJoinInfo', true); // REST 정의
                        new_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
                        new_xhr.send(JSON.stringify({"id": nowUser, "name": newName, "process": newProcess}))
                        new_xhr.onload = function () {
                            if (new_xhr.status === 200 && new_xhr.responseText === "True") {
                                loadingOff()
                                editBtnOn()
                                document.body.removeChild(changeBackground);
                                alert("변경이 완료되었습니다!");
                                window.location.href = "/"
                            } else {
                                alert("죄송합니다. 서버에서 정보를 변경하는 과정에서 오류가 발생했습니다\n해당 이름 또한 사용 중인 것 같습니다\n다른 이름으로 변경 후 재시도 부탁드리겠습니다.");
                                unlinkWithKakao()
                                window.location.href = "/"
                            }
                        };
                    } else {
                        loadingOff()
                        editBtnOn()
                        alert("취소되었습니다.")
                    }
                }
                // 요청자의 이름이 수정된 경우.
                else {
                    // 이름이 이미 있는지 검증 하는 REST
                    let verifyNameByID_xhr = new XMLHttpRequest()
                    verifyNameByID_xhr.open('POST', '/judgeName', true); // REST 정의
                    verifyNameByID_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
                    verifyNameByID_xhr.send(JSON.stringify({"name": newName}))
                    verifyNameByID_xhr.onload = function () {
                        if (verifyNameByID_xhr.status === 200 && verifyNameByID_xhr.responseText === "False") {
                            console.log("사용자 카카오 아이디:", nowUser)
                            loadingOff()
                            editBtnOn()
                            alert("매니저님 성함은 이미 사용 중입니다.\n" + newName + "2 와같이 구별 하시는 것을 추천드립니다!")
                        } else if (verifyNameByID_xhr.status === 200 && verifyNameByID_xhr.responseText === "True") {
                            let confirmed = confirm("입력하신 정보로 완료 하시겠습니까?");
                            if (confirmed) {
                                console.log("최종저장이름." + newName)
                                // 입력된 정보를 삽입하기 위한 RSET
                                let new_xhr = new XMLHttpRequest()
                                new_xhr.open('POST', '/updateJoinInfo', true); // REST 정의
                                new_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
                                new_xhr.send(JSON.stringify({"id": nowUser, "name": newName, "process": newProcess}))
                                new_xhr.onload = function () {
                                    if (new_xhr.status === 200 && new_xhr.responseText === "True") {
                                        loadingOff()
                                        editBtnOn()
                                        document.body.removeChild(changeBackground);
                                        alert("변경이 완료되었습니다!");
                                        window.location.href = "/"
                                    } else {
                                        alert("죄송합니다. 서버에서 정보를 변경하는 과정에서 오류가 발생했습니다\n해당 이름 또한 사용 중인 것 같습니다\n다른 이름으로 변경 후 재시도 부탁드리겠습니다.");
                                        unlinkWithKakao()
                                        window.location.href = "/"
                                    }
                                };
                            } else {
                                loadingOff()
                                editBtnOn()
                                alert("취소되었습니다.")
                            }
                        } else {
                            loadingOff()
                            editBtnOn()
                            alert("서버에서 매니저님을 인증하는 과정에서 오류가 발생했습니다\n재시도 부탁드리겠습니다.");
                            unlinkWithKakao()
                            window.location.href = "/"
                        }
                    };

                    verifyNameByID_xhr.timeout = 15000;

                    // 서버에서 일정시간 응답이 없을 때,
                    verifyNameByID_xhr.ontimeout = function () {
                        loadingOff()
                        editBtnOn()
                        unlinkWithKakao()
                        alert("서버 처리 지연.\n가입 재시도 부탁드립니다.")
                        window.location.href = "/"
                    };

                    // 넷웤이 없는데 요청할때 실행
                    verifyNameByID_xhr.onerror = function () {
                        loadingOff()
                        editBtnOn()
                        unlinkWithKakao()
                        alert("인터넷 접속을 확인하세요.\n가입 재시도 부탁드립니다.")
                        window.location.href = "/"
                    };
                }
            }
            else if (getUserName_xhr.status === 200 && getUserName_xhr.responseText === "False") {
                loadingOff()
                editBtnOn()
                alert("디비에 매니저님 성함이 없습니다.\n오류로 보이며, GHOST 팀에게 문의 부탁드립니다.");
                window.location.href = "/"
            }
            else {
                loadingOff()
                editBtnOn()
                alert("디비에 매니저님 성함이 없습니다.\n오류로 보이며, GHOST 팀에게 문의 부탁드립니다.");
                window.location.href = "/"
            }
        }

        getUserName_xhr.timeout = 10000;

        // 서버에서 일정시간 응답이 없을 때,
        getUserName_xhr.ontimeout = function () {
            loadingOff()
            viewBtnOn()
            alert("서버 처리 지연.\n가입 재시도 부탁드립니다.")
            window.location.href = "/"
        };

        // 넷웤이 없는데 요청할때 실행
        getUserName_xhr.onerror = function () {
            loadingOff()
            viewBtnOn()
            alert("인터넷 접속을 확인하세요.\n가입 재시도 부탁드립니다.")
            window.location.href = "/"
        };
    }
}

function editBtnOn() {
    let btn = document.getElementById("changeModalSubmit");
    let btn2 = document.getElementById("change");
    let btn3 = document.getElementById("changeModalExit");

    if (btn) {
        btn.disabled = false;
        btn.style.opacity = 1;
    }

    if (btn2) {
        btn2.disabled = false;
        btn2.style.opacity = 1;
    }

    if (btn3) {
        btn3.disabled = false;
        btn3.style.opacity = 1;
    }
}

function editBntOff() {
    let btn = document.getElementById("changeModalSubmit");
    let btn2 = document.getElementById("change");
    let btn3 = document.getElementById("changeModalExit");

    if (btn) {
        btn.disabled = true;
        btn.style.opacity = 0.5;
    }

    if (btn2) {
        btn2.disabled = true;
        btn2.style.opacity = 0.5;
    }

    if (btn3) {
        btn3.disabled = true;
        btn3.style.opacity = 0.5;
    }
}
