// 친구에게 메시지 보내기 함수 > 담당 대응자에게 자동으로 메시지가 전송된다.
function sendFriends() {
    let button = document.getElementById("custom-startwork-btn")
    button.disabled = true;
    button.style.opacity = 0.5; // 투명도를 0.5로 설정
    loadingOn()

    // DB에서 친구 목록 가져오기 AJAX
    let info = [] // 금일 담당 대응저 정보가 DB에서 조회 되어 저장된다.
    let xhr_friend = new XMLHttpRequest(); // DB에서 금일 담당 대응자를 조회하기 위한 REST 통신을 위한 AJXA 객체
    let friendInfor = {"shift": "not"}; // 의미 없는 POST request 객체 > 개선 필요

    xhr_friend.open('POST', '/goingToWork', true); // RSET 정의
    xhr_friend.setRequestHeader("Content-Type", "application/json"); // 해더 정의
    xhr_friend.send(JSON.stringify(friendInfor)) // REST Request

    // REST Response
    xhr_friend.onload = function() {
        let shiftAdminInfo = JSON.parse(xhr_friend.responseText) // DB에서 조회된 금일 대응 운영자 > 1차 2차만 조회 됨. 3차는 추후 고려 사항.

        // 1차 대응 운영자 정보만 저장한다.
        for(let i = 0; i < shiftAdminInfo.length; i ++) {
            if (shiftAdminInfo[i].priority === "1") {
                info.push(shiftAdminInfo[i])
            }
        }

        // DB에 금일 대응 운영자가 없으면 아래 함수가 호출됨. > 시스템 오류로 호출되면 안되는 구문이지만 > 시스템 down 방지 차 작성 됨.
        if (info.length === 0) {
            alert("DB에 오늘 운영자가 없네요?\n오늘은 수동으로 출근 보고 해주시고, GHOST 팀에게 이를 알려주세요!")
            button.disabled = false;
            button.style.opacity = 1; // 투명도를 0.5로 설정
            loadingOff()
            window.location.href = '/'; // 메인으로 redirect
        }
        console.log("이 분들께 메시지가 전송 되요! > "+ info)

        // 각 대응자 마다 모두 받아야할 메시지의 템플릿이 다르므로 전송될 만큼 메시지 REST가 호출된다.
        for(let i = 0; i < info.length; i++) {
            // 힌 운영자에게 전송될 메시지 템플릿
            let messageScript = "안녕하십니까? " + info[i].name + " 매니저님,\n" + "금일 " +info[i].date +"일 "
                + info[i].shift + " " + info[i].process + " " + info[i].priority + "차 대응자 입니다.\n\n" +
                "2차 대응자로는 " + "홍길동 매니저님 입니다.\n" + "좋은 하루 보내세요:)";

            // 메시지 전송
            Kakao.API.request({
                url: '/v1/api/talk/friends/message/default/send',
                data: {
                    //한번에 몇명까지 전송 가능한지 찾아봐야함.
                    receiver_uuids: [info[i].uuid], //Value format > ['sdfdsf123213' , 'fas213123fd']
                    template_object: {
                        object_type: 'text',
                        text:
                        messageScript,
                        link: {
                            // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
                            mobile_web_url: 'https://www.ghostalpharetta.com',
                            web_url: 'https://www.ghostalpharetta.com'
                        },
                    },
                },
                success: function (response) {
                    if (i === info.length - 1) {
                        alert("Success. Have a good day!");
                        button.disabled = false;
                        button.style.opacity = 1; // 투명도를 0.5로 설정
                        loadingOff()
                        window.location.href = '/'; // 메인으로 redirect
                    }
                },
                fail: function (error) {
                    alert("실패\n 메시지 전송 횟수가 초과 되었습니다. 금일은 수동 출근 보고 부탁드립니다.");
                    console.log(error);
                    button.disabled = false;
                    button.style.opacity = 1; // 투명도를 0.5로 설정
                    loadingOff()
                    window.location.href = '/'; // 메인으로 redirect
                },
            });
        }
    }
}