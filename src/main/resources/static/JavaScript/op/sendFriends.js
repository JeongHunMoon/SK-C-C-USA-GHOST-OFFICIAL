// 친구에게 메시지 보내기 함수 > 담당 대응자에게 자동으로 메시지가 전송된다.
async function sendFriends() {
    let button = document.getElementById("custom-startwork-btn");
    button.disabled = true;
    button.style.opacity = 0.5; // 투명도를 0.5로 설정
    loadingOn();
    let allInfo = []

    function getNextDate() {
        const today = new Date();
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + 1);

        const year = nextDate.getFullYear();
        let month = nextDate.getMonth() + 1;
        let day = nextDate.getDate();

        // 한 자리수인 경우 앞에 0을 추가
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    }

    let xhr_friend = new XMLHttpRequest(); // DB에서 금일 담당 대응자를 조회하기 위한 REST 통신을 위한 AJXA 객체
    xhr_friend.open('POST', '/goingToWork', true); // REST 정의
    xhr_friend.setRequestHeader("Content-Type", "application/json"); // 해더 정의

    if (isCurrentTimeInDayRange()) {
        let friendInfor = {"date": getCurrentDate(), "shift" : "D"};
        xhr_friend.send(JSON.stringify(friendInfor)); // REST Request
        console.log("DAY 시각")
    }
    else if (isCurrentTimeInEveningRange()) {
        let friendInfor = {"date": getCurrentDate(),  "shift" : "E"};
        xhr_friend.send(JSON.stringify(friendInfor)); // REST Request
        console.log("Evening 시각")
    }
    else if (isCurrentTimeInNightRange() === 0) {
        let friendInfor = {"date": getNextDate(),  "shift" : "N"};
        xhr_friend.send(JSON.stringify(friendInfor)); // REST Request
        console.log("Night 시각")
    }
    else if(isCurrentTimeInNightRange() === 1) {
        let friendInfor = {"date": getCurrentDate(),  "shift" : "N"};
        xhr_friend.send(JSON.stringify(friendInfor)); // REST Request
        console.log("Night 시각")
    }
    else {
        alert("AE 출근 보고 시간대가 아닙니다.\n1시간 전 후로만 가능합니다 :)")
        button.disabled = false;
        button.style.opacity = 1; // 투명도를 0.5로 설정
        loadingOff();
        window.location.href = "/"
        return;
    }

    // REST Response
    xhr_friend.onload = async function () {
        let shiftAdminInfo = JSON.parse(xhr_friend.response);

        // DB에 금일 대응 운영자가 없으면 아래 함수가 호출됨. > 시스템 오류로 호출되면 안되는 구문이지만 > 시스템 down 방지 차 작성 됨.
        if (shiftAdminInfo.length === 0) {
            button.disabled = false;
            button.style.opacity = 1; // 투명도를 0.5로 설정
            loadingOff();
            alert("DB에 오늘 운영자가 없네요?\n오늘은 수동으로 출근 보고 해주시고, GHOST 팀에게 이를 알려주세요!");
            window.location.href = '/'; // 메인으로 redirect
            return;
        }

        // 1차 대응 운영자 정보만 저장한다.
        for (let i = 0; i < shiftAdminInfo.length; i++) {
            if (shiftAdminInfo[i].priority === "1") {
                if (shiftAdminInfo[i].process === "ELEC" ) shiftAdminInfo[i]["Sort"] = 1;
                else if (shiftAdminInfo[i].process === "CELL" ) shiftAdminInfo[i]["Sort"] = 2;
                else if (shiftAdminInfo[i].process === "FORM" ) shiftAdminInfo[i]["Sort"] = 3;
                else if (shiftAdminInfo[i].process === "PACK" ) shiftAdminInfo[i]["Sort"] = 4;
                else if (shiftAdminInfo[i].process === "WMS" )  shiftAdminInfo[i]["Sort"] = 5;
                else if (shiftAdminInfo[i].process === "COLL" ) shiftAdminInfo[i]["Sort"] = 6;
                else if (shiftAdminInfo[i].process === "COMM" ) shiftAdminInfo[i]["Sort"] = 7;
                allInfo.push(shiftAdminInfo[i])
            }
        }

        // 공정별 정렬 > 전 조 화 모 W 수 공 순서로 정렬
        allInfo.sort((a, b) => a.Sort - b.Sort);

        // 각 대응자 마다 모두 받아야할 메시지의 템플릿이 다르므로 전송될 만큼 메시지 REST가 호출된다.
        for (let i = 0; i < allInfo.length; i++) {
            // 힌 운영자에게 전송될 메시지 템플릿
            let messageScript = "안녕하십니까? " + allInfo[i].name + " 매니저님,\n" + "금일 " + allInfo[i].date + "일 "
                + allInfo[i].shift + " " + allInfo[i].process + " " + allInfo[i].priority + "차 대응자 입니다.\n\n" +
                "좋은 하루 보내세요 :)";

            // 메시지 전송
            await sendKakaoMessage(allInfo[i].uuid, messageScript);
        }

        // 날짜, shift, 금일 운영자 정보 > 프로젝트 방에 보고될 나에게 메시지 전송
        sendToMe(allInfo[0].date, allInfo[0].shift, allInfo)
    }
}

// Kakao 메시지 전송 함수
async function sendKakaoMessage(uuid, messageScript) {
    return new Promise((resolve, reject) => {
        resolve()
        /*
        Kakao.API.request({
            url: '/v1/api/talk/friends/message/default/send',
            data: {
                receiver_uuids: [uuid],
                template_object: {
                    object_type: 'text',
                    text: messageScript,
                    link: {
                        mobile_web_url: 'https://www.ghostalpharetta.com',
                        web_url: 'https://www.ghostalpharetta.com'
                    },
                },
            },
            success: function (response) {
                resolve(response);
            },
            fail: function (error) { // 메시지 보내기 실패지 발생.
                loadingOff();
                alert("메시지를 보낼 수 있는 운영자님께는 성공적으로 보냈어요!\n하지만 일부 운영자님은 아직 메시지를 받을 수 없는 상태입니다.\n\n빠른 시일내 운영자님꼐 가입 요청하겠습니다.\n이를 GHOST팀에게 알려주세요!\n\n감사합니다 :)");
                window.location.href = "/"
                reject(error);
            },
        }); */
    });
}