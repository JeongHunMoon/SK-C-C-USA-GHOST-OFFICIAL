// 나에게 카카오톡 메시지 보내기
function sendToMe() {
    let info = [];
    let messageScript = null;

    Kakao.Auth.getStatusInfo(function(statusObj) {
        if (statusObj.status === 'connected') {
            //loginAram(statusObj.user.kakao_account.profile.profile_image_url, statusObj.user.properties.nickname)

            let xhr_friend = new XMLHttpRequest();
            let friendInfor = {"shift": "not"};
            xhr_friend.open('POST', '/goingToWork', true);
            xhr_friend.setRequestHeader("Content-Type", "application/json");
            xhr_friend.send(JSON.stringify(friendInfor))

            xhr_friend.onload = function() {
                let shiftAdminInfo = JSON.parse(xhr_friend.responseText)

                for (let i = 0; i < shiftAdminInfo.length; i++) {
                    if (shiftAdminInfo[i].priority === "1") {
                        info.push(shiftAdminInfo[i])
                    }
                }
                if (info.length === 0) {
                    return;
                }

                // id에 해당하는 사용자 이름 infor에서 가져오고,
                let xhr_me = new XMLHttpRequest();
                let xhr_me_payload = {"id": statusObj.user.kakao_account.email}

                xhr_me.open('POST', "/getMe", true);
                xhr_me.setRequestHeader("Content-Type", "application/json");
                xhr_me.send(JSON.stringify(xhr_me_payload))
                xhr_me.onload = function() {
                    let opName = xhr_me.responseText;

                    if (opName === "False") { // DB에 등록되지 않은 사용자이므로 경고창 후 로그인 차단
                        alert("시스템에 등록되지 않은 사람입니다." + "\nGHOST 팀에게 문의해 주세요.")
                        unlinkWithKakao() // 추후 이 코드 활성화 시켜 ROC이외 외부 인원을 차단시켜야함.
                    }
                    else {
                        let num = "";
                        console.log(info)
                        console.log(opName)

                        if (info[0].shift === "N") num = "1st"
                        else if (info[0].shift === "D") num = "2nd"
                        else num = "3rd"

                        const parts = info[0].date.split("-");
                        const formattedDate = `${parts[1]}/${parts[2]}`;

                        messageScript = opName + " " + num + " shift OP" + "출근했습니다.\n" +
                            formattedDate + " " + info[0].shift + " 근무 연락체계입니다.\n"

                        for(let i = 0; i < info.length; i++) {
                            temp = null;
                            if (i === info.length - 1) {
                                temp = info[i].process + " / " + "운영자" + " / " + info[i].name
                            }
                            else {
                                temp = info[i].process + " / " + "운영자" + " / " + info[i].name + "\n"
                            }
                            messageScript += temp
                        }

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
                                alert('success: ' + JSON.stringify(res));
                            })
                            .catch(function (err) {
                                alert('error: ' + JSON.stringify(err));
                            });
                    }
                }
            }
        }
        else {
            alert("로그인 해주세요.")
            window.location.href = '/'
        }
    });
}