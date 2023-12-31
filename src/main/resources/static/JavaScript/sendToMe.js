// 나에게 카카오톡 메시지 보내기 > 미주 ROC 단톡방에 보내질 템플릿이 만들어진다. > 나에게 전송된다. > 사용자는 복붙하여 전송한다.
function sendToMe() {
    let info = []; // 금일 담당 대응 운영자 정보를 저장하는 변수
    let messageScript = null; // 메시지 템플리

    // 현재 사용자 정보를 가져온다.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        if (statusObj.status === 'connected') {
            let xhr_friend = new XMLHttpRequest(); // 금일 담당 대응 운영자를 DB에서 조회하기 위한 RSET 를 위한 AJAX
            let friendInfor = {"shift": "not"}; // 의미 없는 전송 Json
            xhr_friend.open('POST', '/goingToWork', true); // REST 정의
            xhr_friend.setRequestHeader("Content-Type", "application/json"); // 해더 정의
            xhr_friend.send(JSON.stringify(friendInfor)) // REST Request

            // Rest Response
            xhr_friend.onload = function() {
                let shiftAdminInfo = JSON.parse(xhr_friend.responseText) // DB에서 조회된 금일 담당 대응 운영자 정보 > 1, 2차만 조회됨.

                // 1차 담당 대응자 정보만 info 에 저장.
                for (let i = 0; i < shiftAdminInfo.length; i++) {
                    if (shiftAdminInfo[i].priority === "1") {
                        info.push(shiftAdminInfo[i])
                    }
                }

                // 만약 DB에서 금일 담당 대응자가 조회되지 않는 경우
                if (info.length === 0) {
                    return;
                }

                // 플방에 보고될 카톡 내용을 나에게 보내기 위한 REST를 위한 객체.
                let xhr_me = new XMLHttpRequest();
                let xhr_me_payload = {"id": statusObj.user.kakao_account.email} // 사용자 카카오 계정 정보

                // 시스템에 등록된 사용자만 메시지를 보낼 수 있다. 이를 검증하는 REST 정의
                xhr_me.open('POST', "/getMe", true); // REST 정의
                xhr_me.setRequestHeader("Content-Type", "application/json"); // 해더 정의
                xhr_me.send(JSON.stringify(xhr_me_payload)) // REST Request

                // REST Response
                xhr_me.onload = function() {
                    let opName = xhr_me.responseText; // 출근한 OP의 이름
                    console.log(opName + "님이 출근했습니다.") // 한번 확인..

                    if (opName === "False") { // DB에 등록되지 않은 사용자이므로 경고창 후 로그인 차단
                        alert("시스템에 등록되지 않은 사람입니다." + "\nGHOST 팀에게 문의해 주세요.")
                        unlinkWithKakao() // 추후 이 코드 활성화 시켜 ROC이외 외부 인원을 차단시켜야함.
                    }

                    // 출근 보고를 요청한 사람이 정상적으로 ROC 인원인 경우
                    else {
                        let num = ""; // 1st, 2nd, 3rd 문자열 정의

                        if (info[0].shift === "N") num = "1st"
                        else if (info[0].shift === "D") num = "2nd"
                        else num = "3rd"

                        let parts = info[0].date.split("-"); //DB에는 "2023-12-11" 형식으로 금일 날짜가 저장됨
                        let formattedDate = `${parts[1]}/${parts[2]}`; // 위 값을 12/11 문자열 형태로 변경

                        messageScript = opName + " " + num + " shift OP" + "출근했습니다.\n" +
                            formattedDate + " " + info[0].shift + " 근무 연락체계입니다.\n"

                        for(let i = 0; i < info.length; i++) {
                            let temp = null;
                            if (i === info.length - 1) {
                                temp = info[i].process + " / " + "운영자" + " / " + info[i].name
                            }
                            else {
                                temp = info[i].process + " / " + "운영자" + " / " + info[i].name + "\n"
                            }
                            messageScript += temp
                        }

                        // 위에서 메시지 템플릿 정의 후 아래 코드로 나에게 템플릿 전송 > 해당 템플릿은 사용자가 직접 복붙하여 플방에 보고 해야함.
                        Kakao.API.request({
                            url: '/v2/api/talk/memo/default/send',
                            data: {
                                template_object: {
                                    object_type: 'text',
                                    text:
                                        messageScript,
                                    link: {
                                        // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
                                        mobile_web_url: 'https://www.ghostalpharetta.com', // //https://developers.kakao.com
                                        web_url: 'https://www.ghostalpharetta.com'
                                    },
                                },
                            },
                        })
                            .then(function (res) {
                                console.log('출근 보고 나에게 보내기 성공!');
                            })
                            .catch(function (err) {
                                alert("실패\n금일은 수동 출근 보고 부탁드립니다.");
                            });
                    }
                }
            }
        }
        else {
            alert("Please log in.")
            window.location.href = '/'
        }
    });
}