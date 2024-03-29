// 나에게 카카오톡 메시지 보내기 > 미주 ROC 단톡방에 보내질 템플릿이 만들어진다. > 나에게 전송된다. > 사용자는 복붙하여 전송한다.
function sendToMe(nowDate, nowShift, info) {
    let messageScript = null;

    // 현재 사용자 정보를 가져온다.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        if (statusObj.status === 'connected') {
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
                if (xhr_me.status === 200) {
                    let opName = xhr_me.responseText; // 출근한 OP의 이름
                    console.log(opName + "님이 출근했습니다.") // 확인..

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

                        messageScript = opName + " " + num + " shift AE " + "출근했습니다.\n" +
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
                                let button = document.getElementById("custom-startwork-btn");
                                loadingOff();
                                alert("출근 보고 성공.")
                                window.location.href = '/'; // 메인으로 redirect
                            })
                            .catch(function (err) {
                                loadingOff();
                                alert("실패\n금일은 수동 출근 보고 부탁드립니다.");
                                window.location.href = '/'; // 메인으로 redirect
                            });
                    }
                }
                else {
                    loadingOff();
                    alert("죄송합니다. 서버 일시적 오류로 나에게 메시지 보내기가 실패했습니다.\n프로젝트 방에는 수동 보고 부탁드립니다.")
                    window.location.href = "/"
                }
            }

            xhr_me.timeout = 10000;

            // 서버에서 일정시간 응답이 없을 때,
            xhr_me.ontimeout = function () {
                loadingOff();
                alert("죄송합니다. 서버 처리 지연으로 나에게 메시지 보내기가 실패했습니다.\n프로젝트 방에는 수동 보고 부탁드립니다.")
                window.location.href = "/"
            };

            // 넷웤이 없는데 요청할때 실행
            xhr_me.onerror = function () {
                loadingOff();
                alert("와이파이가 끊겨있습니다. 이에 에게 메시지 보내기가 실패했습니다.\n프로젝트 방에는 수동 보고 부탁드립니다.")
                window.location.href = "/"
            };
        }
        else {
            loadingOff();
            alert("로그인 세션이 만료되었습니다.\n프로젝트 방에는 수동 보고 부탁드립니다..")
            window.location.href = '/'
        }
    });
}