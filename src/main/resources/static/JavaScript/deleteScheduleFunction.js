function deleteScheduleFunction() {
    deleteOffBtn()
    let userId;
    let userImage;
    let userName
    let noFlag = false; // 수정할 페이지가 하나도 없다면 false

    // 사용자가 OP 페이지에 들어오면 카카오톡 프로필, 이름을 애니메이션으로 보여준다.
    Kakao.Auth.getStatusInfo(function(statusObj) {
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

            // 순차적으로 비동기 작업을 수행하는 함수
            async function processCards() {
                for (let card of cards) {
                    await processCard(card);
                }

                if (!noFlag) {
                    window.location.href ='/admin?id='+userId
                    deleteOnBtn()
                    alert("현재 날짜 범위는 스케줄이 없습니다.")
                }
                else {
                    afterProcessCards() //카드 DOM 으로 생성 후 작업
                }
                deleteOnBtn()
            }

            // 각 날짜에 대한 비동기 작업을 수행하는 함수
            function processCard(card) {
                return new Promise(resolve => {
                    let xhr1 = new XMLHttpRequest();
                    let payloadFront = {"date": card};
                    xhr1.open('POST', '/getSchedule', true); // 날짜에 맞는 스케줄 정보 (이름, 날짜, shift, 우선순위, 공정)
                    xhr1.setRequestHeader("Content-Type", "application/json");
                    xhr1.send(JSON.stringify(payloadFront));

                    xhr1.onload = function () {
                        let results = JSON.parse(xhr1.response);
                        console.log(results);

                        // 요일 생성 부분, card는 날짜임
                        const dateObject = new Date(`${card}T00:00:00-05:00`);
                        const options = {weekday: 'short', timeZone: 'America/New_York'};
                        const dayOfWeek = dateObject.toLocaleDateString('en-US', options);

                        if (results.length !== 0) { //해당 날짜에 대한 값이 없으면 카드 생성하지 않음
                            noFlag = true //
                            deleteScheduleCard(results, dayOfWeek, card); // DOM 에서 동적으로 카드를 생성하여 부모 컨테이너에 삽입
                        }

                        resolve();
                    }
                });
            }

            // 비동기 작업을 순차적으로 실행 > 모든 카드가 DOM에 생성됨
            processCards();

            function afterProcessCards() {
                // 버튼 요소 가져오기
                let button1 = document.getElementById('delete_save');

                // 클릭 이벤트에 리스너 등록
                button1.addEventListener('click', function() {
                    deleteSaveBtn() // 자체 개발 필요, 개발2
                });

                // 버튼 요소 가져오기
                let button2 = document.getElementById('delete_cancel');

                // 클릭 이벤트에 리스너 등록
                button2.addEventListener('click', function() {
                    deleteCancelBtn() // 그대로 쓰면 됨. id만 바꾸기
                });

            }
        }
        else {
            deleteOnBtn()
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