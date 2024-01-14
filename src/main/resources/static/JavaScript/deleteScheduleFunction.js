function deleteScheduleFunction() {
    loadingOn()
    deleteOffBtn()
    let userId;
    let userImage;
    let userName
    let noFlag = true; // 수정할 페이지가 하나도 없다면 false

    let nowUserId = null;
    let nowUserNiname = null;
    let tableSelect = null;
    let rocMembers = null; //Whatfor
    let flag  = true; //What for
    let noChange = true; //What for
    let deleteInfo = []; // "A" > ""
    let firstClick= 0;
    let clickFlag = -1; // 1 인경우 : 선택된 상태,  -1인 경우 : 미선택된 상태

    // 사용자가 OP 페이지에 들어오면 카카오톡 프로필, 이름을 애니메이션으로 보여준다.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        //로그인 성공 시
        if (statusObj.status === 'connected') {
            userId = statusObj.user.kakao_account.email;
            userName = statusObj.user.properties.nickname
            userImage = statusObj.user.kakao_account.profile.profile_image_url

            // 시작일과 종료일의 input 요소를 가져옴
            const startDay = document.getElementById('startDate');
            const endDay = document.getElementById('endDate');

            // 시작일과 종료일의 값을 가져옴
            const startDateString = startDay.innerText;
            const endDateString = endDay.innerText;
            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);

            // 값을 console에 출력
            console.log('시작일:', startDateString);
            console.log('종료일:', endDateString);
            //console.log(getDates(startDate, endDate));
            let cards = getDates(startDate, endDate); // ['2023-01-01', ... '2024-01-07']
            console.log(cards)

            let xhr1 = new XMLHttpRequest();
            let payloadFront = {"date": cards};
            xhr1.open('POST', '/getSchedule', true);
            xhr1.setRequestHeader("Content-Type", "application/json");
            xhr1.send(JSON.stringify(payloadFront));

            xhr1.onload = function () {
                let results = JSON.parse(xhr1.response); // 디비에서 해당 날짜의 운영자가 하나도 없는 경우 [] 반환
                console.log(results);

                for(let i = 0; i < results.length; i++) {
                    if (results[i].length !== 0) {
                        noFlag = false;
                        break;
                    }
                }

                if (noFlag) {
                    let idx = 0
                    for (let card of cards) {
                        const dateObject = new Date(`${card}T00:00:00-05:00`);
                        const options = {weekday: 'short', timeZone: 'America/New_York'};
                        const dayOfWeek = dateObject.toLocaleDateString('en-US', options);

                        // DOM 에서 동적으로 카드르 만들어 배열에 저장. 붙이기는 정렬 후 한번에 수행하게 됨.
                        deleteScheduleCard(results[idx], dayOfWeek, card);
                        idx += 1
                    }
                    loadingOff()
                    deleteOnBtn()
                    // 여기서 카드 생성 끝

                }
                else {
                    alert("삭제할 카드가 없습니다.")
                    loadingOff()
                    deleteOnBtn()
                    window.location.href = "/admin?id=" + nowUserId

                }
            }
        }
        // 로그인 실패 시
        else {
            deleteOnBtn()
            loadingOff()
            window.location.href = "/"
            alert("세션이 만료되었습니다. 로그인을 다시해주세요.")
        }
    })
}


function getDates(startDate, endDate) {
    const dateArray = [];
    let currentDate = startDate;

    // 날짜 간의 범위를 계산하며 배열에 추가
    while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray; //리스트 반환
}

document.addEventListener('DOMContentLoaded', function () {
    let container = document.getElementById('image-container');

    container.addEventListener('wheel', function (e) {
        container.scrollLeft += e.deltaY;
        e.preventDefault();
    });
});


function deleteOnBtn() {
    document.getElementById("delete_cancel").disabled = false;     // 버튼 활성화
    document.getElementById("delete_cancel").style.opacity = 1;     // 버튼 활성화
    document.getElementById("delete_save").disabled = false;     // 버튼 활성화
    document.getElementById("delete_save").style.opacity = 1;     // 버튼 활성화
}

function deleteOffBtn() {
    document.getElementById("delete_cancel").disabled = true;     // 버튼 비활성화
    document.getElementById("delete_cancel").style.opacity = 0.5;     // 버튼 비활성화 표시 위한 투명도
    document.getElementById("delete_save").disabled = true;     // 버튼 비활성화
    document.getElementById("delete_save").style.opacity = 0.5;     // 버튼 비활성화 표시 위한 투명도
}