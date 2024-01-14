function modifyScheduleFunction() {
    loadingOn()
    modifyOffBtn()
    let userId;
    let userImage;
    let userName

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

            // 값을 console에 출력
            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);
            console.log('시작일:', startDateString);
            console.log('종료일:', endDateString);
            //console.log(getDates(startDate, endDate));
            let cards = getDates(startDate, endDate);
            console.log(cards)

            // 순차적으로 비동기 작업을 수행하는 함수
            async function processCards() {
                for (let card of cards) {
                    await processCard(card);
                }

                afterProcessCards();
                loadingOff()
                modifyOnBtn()
            }

            // 각 날짜에 대한 비동기 작업을 수행하는 함수
            function processCard(card) {
                return new Promise(resolve => {
                    let xhr1 = new XMLHttpRequest();
                    let payloadFront = {"date": card};
                    xhr1.open('POST', '/getSchedule', true);
                    xhr1.setRequestHeader("Content-Type", "application/json");
                    xhr1.send(JSON.stringify(payloadFront));

                    xhr1.onload = function () {
                        let results = JSON.parse(xhr1.response);
                        console.log(results);

                        const dateObject = new Date(`${card}T00:00:00-05:00`);
                        const options = {weekday: 'short', timeZone: 'America/New_York'};
                        const dayOfWeek = dateObject.toLocaleDateString('en-US', options);

                        createCardStored(results, dayOfWeek, card, false);

                        resolve();
                    }
                });
            }

            // 비동기 작업을 순차적으로 실행 > 모든 카드가 DOM에 생성됨
            processCards();

            function afterProcessCards() {
                // 처음 로딩되었을 때 카드들의 정보를 저장.
                let asIsForm = document.querySelectorAll("#createForm");
                let asIsAllInfos = {};

                // 기존의 저장된 값을 hashMap 형태로 저장.
                for (let j = 0; j < asIsForm.length; j++) {
                    // form 아래 모든 input 태그 선택
                    let inputs = asIsForm[j].querySelectorAll("input");
                    let formdate = asIsForm[j].querySelector("#dateInfo").textContent;

                    // 각 input 태그에 대해 반복
                    for (let i = 0; i < inputs.length; i++) {
                        // 현재 반복중인 input 태그
                        asIsAllInfos[inputs[i].id] = inputs[i].value;
                    }
                }
                console.log(asIsAllInfos)


                // 버튼 요소 가져오기
                let button1 = document.getElementById('modify_save');

                // 클릭 이벤트에 리스너 등록
                button1.addEventListener('click', function() {
                    modifySaveBtn(asIsAllInfos)
                });

                // 버튼 요소 가져오기
                let button2 = document.getElementById('modify_cancel');

                // 클릭 이벤트에 리스너 등록
                button2.addEventListener('click', function() {
                    modifyCancelBtn()
                });

            }

        }
        else {
            loadingOff()
            modifyOnBtn()
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
    return dateArray;
}

document.addEventListener('DOMContentLoaded', function () {
    let container = document.getElementById('image-container');

    container.addEventListener('wheel', function (e) {
        container.scrollLeft += e.deltaY;
        e.preventDefault();
    });
});


function modifyOnBtn() {
    document.getElementById("modify_cancel").disabled = false;     // 버튼 비활성화
    document.getElementById("modify_cancel").style.opacity = 1;     // 버튼 비활성화
    document.getElementById("modify_save").disabled = false;     // 버튼 비활성화
    document.getElementById("modify_save").style.opacity = 1;     // 버튼 비활성화
}

function modifyOffBtn() {
    document.getElementById("modify_cancel").disabled = true;     // 버튼 비활성화
    document.getElementById("modify_cancel").style.opacity = 0.5;     // 버튼 비활성화
    document.getElementById("modify_save").disabled = true;     // 버튼 비활성화
    document.getElementById("modify_save").style.opacity = 0.5;     // 버튼 비활성화
}