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

            let cards = getDates(startDate, endDate);
            console.log(cards)

            let xhr1 = new XMLHttpRequest();
            let payloadFront = {"date": cards};
            xhr1.open('POST', '/getSchedule', true);
            xhr1.setRequestHeader("Content-Type", "application/json");
            xhr1.send(JSON.stringify(payloadFront));

            xhr1.onload = function () {
                if (xhr1.status === 200) {
                    let results = JSON.parse(xhr1.response); // 디비에서 해당 날짜의 운영자가 하나도 없는 경우 [] 반환
                    console.log(results);

                    let idx = 0
                    for (let card of cards) {
                        const dateObject = new Date(`${card}T00:00:00-05:00`);
                        const options = {weekday: 'short', timeZone: 'America/New_York'};
                        const dayOfWeek = dateObject.toLocaleDateString('en-US', options);

                        // DOM 에서 동적으로 카드르 만들어 배열에 저장. 붙이기는 정렬 후 한번에 수행하게 됨.
                        createCardStored(results[idx], dayOfWeek, card);
                        idx += 1
                    }
                    afterProcessCards();
                    loadingOff()
                    modifyOnBtn()
                }
                else {
                    alert("서버 오류.\n재시도 부탁드립니다.")
                    window.location.href = "/"
                }
            }

            xhr1.timeout = 20000;

            // 서버에서 일정시간 응답이 없을 때,
            xhr1.ontimeout = function () {
                alert("서버 처리 지연.\n재시도 부탁드립니다.")
                window.location.href = "/"
            };

            // 넷웤이 없는데 요청할때 실행
            xhr1.onerror = function () {
                alert("인터넷 접속을 확인하세요.\n재시도 부탁드립니다.")
                window.location.href = "/"
            };

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
            alert("로그인 세션이 만료되었습니다. 로그인을 다시해주세요.")
        }
    })
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