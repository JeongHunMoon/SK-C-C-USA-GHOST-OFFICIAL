function sendFriends() {
    const button = document.getElementById("custom-startwork-btn")
    button.disabled = true;
    button.style.opacity = 0.7; // 투명도를 0.5로 설정
    loadingOn()

    // DB에서 친구 목록 가져오기 AJAX
    let info = [] //"CzoJOAExCTgBLRwkEyISIhUmFzsKOgoyCjkBSA"; // DB 요청 예정
    let xhr_friend = new XMLHttpRequest();
    let friendInfor = {"shift": "not"};

    xhr_friend.open('POST', '/goingToWork', true);
    xhr_friend.setRequestHeader("Content-Type", "application/json");
    xhr_friend.send(JSON.stringify(friendInfor))

    xhr_friend.onload = function() {
        let shiftAdminInfo = JSON.parse(xhr_friend.responseText)

        for(let i = 0; i < shiftAdminInfo.length; i ++) {
            if (shiftAdminInfo[i].priority === "1") {
                info.push(shiftAdminInfo[i])
            }
        }
        if (info.length === 0) {
            alert("DB에 오늘 운영자가 없네요?\n오늘은 수동으로 출근 보고 해주시고, GHOST 팀에게 이를 알려주세요!")
            button.disabled = false;
            button.style.opacity = 1; // 투명도를 0.5로 설정
            loadingOff()
            window.location.href = '/'; // 메인으로 redirect
        }
        console.log(info)

        for(let i = 0; i < info.length; i++) {
            let messageScript = "안녕하십니까? " + info[i].name + " 매니저님,\n" + "금일 " +info[i].date +"일 "
                + info[i].shift + " " + info[i].process + " " + info[i].priority + "차 대응자 입니다.\n\n" +
                "2차 대응자로는 " + "홍길동 매니저님 입니다.\n" + "좋은 하루 보내세요:)";

            Kakao.API.request({
                url: '/v1/api/talk/friends/message/default/send',
                data: {
                    //한번에 몇명까지 전송 가능한지 찾아봐야함.
                    receiver_uuids: [info[i].uuid], //value의 format > ['sdfdsf123213' , 'fas213123fd']
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
                success: function (response) {
                    if (i === info.length - 1) {
                        alert("친구에게 보내기 성공");
                        button.disabled = false;
                        button.style.opacity = 1; // 투명도를 0.5로 설정
                        loadingOff()
                        window.location.href = '/'; // 메인으로 redirect
                    }
                },
                fail: function (error) {
                    alert("친구에게 보내기 실패");
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