// 사용자 카카오 소셜 로그인
function loginOPWithKakao() {
    let userRefreshToken = null; // 로그인 시 사용자로부터 refreshtoken을 받아옴.
    let nowUser = null           // authObj.user_id // 현재 로그인을 시도한 사람의 카카오 id를 받아오기.
    let button = document.getElementById("user_login") //로그인 버튼을 비활성화 하기 위한 태그 가져오기
    button.disabled = true;     // 버튼 비활성화
    button.style.opacity = 0.5; // 투명도를 0.5로 설정
    loadingOn() // 로딩창 함수 호출

    //최초 사용자가 이미 카카오 로그인이 되어있는지 판단.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUser = statusObj.user.kakao_account.email; // 사용자 카카오 id

            // 이 계정이 등록되어 있는 DB 조회하여 판단.
            let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
            let infor = {"Who" : nowUser} // 서버로 해당 페이로드를 실어 REST POST
            xhr_check.open('POST', '/check', true); // REST 정의
            xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
            xhr_check.send(JSON.stringify(infor)) // 서버로 POST 전송

            // 서버 응답
            xhr_check.onload = function () {
                let results = xhr_check.responseText; // 서버에서 전달 받은 payload

                if (results === "False") { // DB에 등록되지 않은 사용자이므로 경고창 후 로그인 차단
                    alert("You are not registered in the system.\nContact the Ghost Team.")
                    loadingOff() // 로딩창 종료
                    button.disabled = false; // 버튼 활성화
                    button.style.opacity = 1; // 투명도 1
                    unlinkWithKakao() // 로그아웃 시켜 로그인을 차단시킨다.
                }

                // DB에 등록된 올바른 ROC 사람인 경우
                else {
                    let checkedName = results.split(" ")[0]; // 사용자의 프로필 설정 이름
                    let hashValue = results.split(" ")[1]; // 서버에서 발급 받아 전달 받은 랜덤 uuid 값이며 이 값을 다시 서버에 요청하여 정상적으로 OP 페이지에 접속하도록 요청
                    alert("Welcome, Manager " + checkedName);
                    loadingOff() // 로딩창 종료
                    button.disabled = false; // 버튼 활성화
                    button.style.opacity = 1; // 투명도 1 설정

                    // 서버에서 1회성 해쉬 값이 생성되며 이 값을 다시 GET 호출하여 OP 페이지로 이동을 요청한다.
                    // 아래 해쉬 값은 서버에서 생성된 랜덤 해쉬 이므로 외부에서 이 uuid를 찾을 수 없다. > 외부로 100% 차단
                    window.location.href = '/OP'+'?uuid=' + hashValue; // OP 페이지로 이동하기 위한 get 요청
                }
            };

        }

        // 사용자가 현재 브라우저에 카카오 로그인이 안되어 있는 경우
        else {
            // 사용자 카카오 로그인을 진행한다.
            Kakao.Auth.login({
                // 로그인이 성공한 경우
                success: function (authObj) {
                    // 로그인 시도 한 사용자의 전화번호(고유값)를 parsing해서 -> 서버로 데이터 전송(AJAX) -> 서버에서 DB 쿼리로 접근해서 DB 있는지 없는지 판단
                    // -> 서버에서 판단 값을 가진 payload를 AJAX의 onload로 전송 -> True이면 redirect로 출근 보고 페이지로 이동 / 만약 false이면 알람창으로 로그인 실패 알림.
                    // false에서 unlink로 외부 서비스 연결 막아 로그인 차단.
                    // alert(authObj.id)
                    // alert("login :" + JSON.stringify(authObj));
                    console.log("처음 로그인 시 설정된 토큰" + Kakao.Auth.getAccessToken());
                    console.log("처음 로그인 시 발급 받은 리프레시 토큰" + userRefreshToken);

                    Kakao.Auth.setAccessToken(authObj.access_token); // 사용자 처음 로그인시 발급된 토큰으로 설정
                    userRefreshToken = authObj.refresh_token // refresh token 값 저장.
                    //refreshAccessToken(userRefreshToken) // > 삭제 필요

                    // 로그인한 사용자 정보 가져오는 REST
                    let url = 'https://kapi.kakao.com/v2/user/me'
                    let xhr = new XMLHttpRequest(); // REST API 통신을 위한 객체
                    xhr.open('GET', url, true); // REST API로 url에 통신하여 내 친구 목록 Parsing.
                    xhr.setRequestHeader('Authorization', 'Bearer ' + authObj.access_token);// 헤더에 Authorization 추가
                    xhr.send();

                    xhr.onload = function () { // 로그인 시도한 사용자의 프로필 정보 가져오기
                        let payload = JSON.parse(xhr.responseText) // 서버로부터 전송 받은 페이로드를 parsing
                        nowUser = payload.kakao_account.email; // 사용자 카카오 계정

                        // 이 계정이 등록 되어 있는지 DB를 조회하여 판단.
                        let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
                        let infor = {"Who" : nowUser} // 서버에 전송될 Json 데이터 > 사용자 카카오 계정을 전달
                        xhr_check.open('POST', '/check', true); // REST 정의
                        xhr_check.setRequestHeader("Content-Type", "application/json"); // 해더 설정
                        xhr_check.send(JSON.stringify(infor)) // REST 요청

                        // 대기 시간을 설정하거나, 서버 응답에 대한 추가 로직을 작성할 수 있습니다.
                        xhr_check.onload = function () {
                            let results = xhr_check.responseText; // 서버에서 응답 받은 payload

                            // DB에 등록되지 않은 사용자이므로 경고창 후 로그인 차단
                            if (results === "False") {
                                alert("You are not registered in the system.\nContact the Ghost Team.")
                                loadingOff()
                                button.disabled = false;
                                button.style.opacity = 1; // 투명도를 1로 설정
                                unlinkWithKakao() // 로그아웃 진행 > ROC이외 외부 인원을 차단
                            }

                            // DB에 정상적으로 등록되어 있는 사용자 == ROC 사람.
                            else {
                                let checkedName = results.split(" ")[0]; // 사용자의 프로필 설정 이름
                                let hashValue = results.split(" ")[1]; // 서버에서 발급 받아 전달 받은 랜덤 uuid 값이며 이 값을 다시 서버에 요청하여 정상적으로 OP 페이지에 접속하도록 요청
                                alert("Welcome, Manager " + checkedName);
                                loadingOff()
                                button.disabled = false;
                                button.style.opacity = 1;
                                window.location.href = '/OP'+'?uuid=' + hashValue; // OP 페이지로 이동하기 위한 GET
                            }
                        };
                    }

                    /* 로그인한 사용자의 친구 목록 불러오는 코드, 이제 필요 없으니 일단 주석문 할게용
                    let url = 'https://kapi.kakao.com/v1/api/talk/friends';
                    const xhr = new XMLHttpRequest(); // REST API 통신을 위한 객체
                    xhr.open('GET', url, true); // REST API로 url에 통신하여 내 친구 목록 Parsing.
                    xhr.setRequestHeader('Authorization', 'Bearer ' + authObj.access_token);// 헤더에 Authorization 추가
                    xhr.send();
                    xhr.onload = function () { // 비동기 함수로 XHMHttp 이벤트가 발생하면 실행되는 함수.
                        console.log(xhr.responseText);
                        let payload = JSON.parse(xhr.responseText) // 서버로부터 전송 받은 페이로드 저장
                        console.log("---------------------")
                        console.log(payload)
                        friendUuid = payload.elements[0].uuid; // 친구목록 배열의 첫 번 째 친구 값을 저장.
                        console.log("내친구 uuid", friendUuid)
                    }*/

                },
                fail: async function (err) { // 로그인 실패시 오류 값 반환
                    alert("You are not registered in the system.\nContact the Ghost Team.")
                    loadingOff()
                    button.disabled = false;
                    button.style.opacity = 1; // 투명도를 0.5로 설정
                },
            })
        }
    });
}

