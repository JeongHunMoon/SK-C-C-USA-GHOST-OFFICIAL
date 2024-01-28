function viewAllInfo() {
    vewBntOff()
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
                        viewBtnOn()
                        unlinkWithKakao()
                        alert("You are not registered in the system.\nPlease click the “Join” button to join.")
                    }

                    // 서버에 등록된 ROC 사람인 경우
                    else {
                        viewUserAllInfoFunction(nowUser)
                    }
                } else {
                    loadingOff()
                    viewBtnOn()
                    unlinkWithKakao()
                    alert("죄송합니다. 서버에서 매니저님 계정이 존재하는지 확인 중 에러가 발생했습니다.\n재시도 부탁드립니다.")
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
                                loadingOff()
                                viewBtnOn()
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
                                        viewBtnOn()
                                        unlinkWithKakao()
                                        alert("You are not registered in the system.\nPlease click the “Join” button to join.")
                                    }

                                    // 서버에 등록된 ROC 사람인 경우
                                    else {
                                        viewUserAllInfoFunction(nowUser)
                                    }
                                } else {
                                    loadingOff()
                                    viewBtnOn()
                                    unlinkWithKakao()
                                    alert("죄송합니다. 서버에서 매니저님 계정이 존재하는지 확인 중 에러가 발생했습니다.\n재시도 부탁드립니다.")
                                    window.location.href = "/"
                                }
                            }
                        })
                        .catch(error => {
                            loadingOff()
                            viewBtnOn()
                            unlinkWithKakao()
                            alert("카카오 서버 오류, 사용자 정보를 가져오는데 실패했습니다.\n재시도 부탁드립니다.")
                            window.location.href = "/"
                        });
                },
                fail: function (err) { // 로그인 실패시 오류 값 반환
                    loadingOff()
                    viewBtnOn()
                    unlinkWithKakao()
                    alert("Please agree to join!")
                    window.location.href = "/"
                },
            })
        }
    });
}

function viewUserAllInfoFunction(nowUser) {
    // 모든 사용자의 기본 정보를 가져온다.
    let getUserInfoAll_xhr = new XMLHttpRequest()
    getUserInfoAll_xhr.open('POST', '/checktypo', true); // REST 정의
    getUserInfoAll_xhr.setRequestHeader("Content-Type", "application/json"); // 해더 설정
    getUserInfoAll_xhr.send(JSON.stringify({"CheckTypo": "CheckTypo"})) // 필요 시 적절히 수정 가능.
    getUserInfoAll_xhr.onload = function () {
        let rocMembers = JSON.parse(getUserInfoAll_xhr.response)
        if (getUserInfoAll_xhr.status === 200 && rocMembers.length !== 0) {
            // 각 데이터를 배열로 변환
            const dataArray = Object.entries(rocMembers);

            // 각 요소를 ELEC > CELL > FORM > PACK > COLL > WMS > COMM 순서로 정렬
            dataArray.sort((a, b) => {
                const order = { "ELEC": 1, "CELL": 2, "FORM": 3, "PACK": 4, "COLL": 5, "WMS": 6, "COMM": 7, "AE" : 8, "PMO" : 9};
                return order[a[1]] - order[b[1]];
            });

            // 변경된 데이터를 모달에 추가
            let viewAllBackground = document.createElement('div');
            viewAllBackground.setAttribute("id", "viewAllBackground");

            let viewAllModalContainer = document.createElement('div');
            viewAllModalContainer.id = 'viewAllModalContainer'; // 위 태그에 id를 부여한다.
            viewAllModalContainer.innerHTML = `
                <div id="viewAllModalExit"></div>    
                <div id="viewAllModalHeader">미주 RoC All</div>
                <div id="viewAllModalSection"><span>스케줄 등록 아래 정보로 입력해주세요!</span></div>
                <div id="viewAllModalInputContainer">

                </div>
            `;

            // 변경된 데이터를 모달에 추가
            const viewAllModalInputContainer = viewAllModalContainer.querySelector('#viewAllModalInputContainer');
            let prevProcess = null; // 이전 공정을 저장하는 변수

            dataArray.forEach(([name, process], index) => {
                const pTag = document.createElement('p');
                pTag.textContent = `${process} / ${name}`;

                // 이전 공정이 현재 공정과 다를 때만 <br> 태그 추가
                if (prevProcess !== null && prevProcess !== process) {
                    const brTag = document.createElement('br');
                    viewAllModalInputContainer.appendChild(brTag);
                }

                viewAllModalInputContainer.appendChild(pTag);

                // 현재 공정을 이전 공정으로 업데이트
                prevProcess = process;
            });


            // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
            viewAllBackground.appendChild(viewAllModalContainer)
            document.body.appendChild(viewAllBackground);

            document.getElementById('viewAllModalExit').addEventListener('click', function() {
                document.body.removeChild(viewAllBackground);
            });

            viewBtnOn()
            loadingOff()
        }
        else if(getUserInfoAll_xhr.status === 200 && rocMembers.length === 0) {
            alert("현재 DB에 ROC 맴버가 없습니다. 관리자에게 문의해주세요.")
            window.location.href = "admin?id="+nowUser;
        }

        else {
            viewBtnOn()
            loadingOff()
            alert("불편을 끼쳐드려 죄송합니다. 시스템에서 ROC member를 찾는 중 오류가 발생했습니다.\n재시도 부탁드립니다.")
            unlinkWithKakao()
            window.location.href = "/"
        }
    };
}

function viewBtnOn() {
    let btn = document.getElementById("viewAllModalExit");

    if (btn) {
        btn.disabled = false;
        btn.style.opacity = 1;
    }
}

function vewBntOff() {
    let btn = document.getElementById("viewAllModalExit");

    if (btn) {
        btn.disabled = true;
        btn.style.opacity = 0.5;
    }
}
