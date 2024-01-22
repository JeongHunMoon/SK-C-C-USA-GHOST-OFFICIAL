function deleteScheduleFunction() {
    loadingOn()
    deleteOffBtn()
    let userId;
    let userImage;
    let userName
    let noFlag = true; // 수정할 페이지가 하나도 없다면 false
    let tableSelect = null;
    let clickFlags = []; // 1 인경우 : 선택된 상태,  -1인 경우 : 미선택된 상태

    // 사용자가 OP 페이지에 들어오면 카카오톡 프로필, 이름을 애니메이션으로 보여준다.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        //로그인 성공 시
        if (statusObj.status === 'connected') {
            userId = statusObj.user.kakao_account.email;
            userName = statusObj.user.properties.nickname
            userImage = statusObj.user.kakao_account.profile.profile_image_url

            // 하단 버튼 이벤트 등록
            let button1 = document.getElementById('delete_cancel');
            button1.addEventListener('click', function() {
                deleteCancelBtn()
            });
            let button2 = document.getElementById('delete_save');
            button2.addEventListener('click', function() {
                deleteSaveBtn()
            });

            // 시작일과 종료일의 input 요소를 가져옴
            const startDay = document.getElementById('startDate');
            const endDay = document.getElementById('endDate');

            // 시작일과 종료일의 값을 가져옴
            const startDateString = startDay.innerText;
            const endDateString = endDay.innerText;
            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);
            let cards = getDates(startDate, endDate); // ['2023-01-01', ... '2024-01-07']

            let xhr1 = new XMLHttpRequest();
            let payloadFront = {"date": cards};
            xhr1.open('POST', '/getSchedule', true);
            xhr1.setRequestHeader("Content-Type", "application/json");
            xhr1.send(JSON.stringify(payloadFront));

            xhr1.onload = function () {
                if (xhr1.status === 200) {
                    let results = JSON.parse(xhr1.response); // 디비에서 해당 날짜의 운영자가 하나도 없는 경우 [] 반환

                    for(let i = 0; i < results.length; i++) {
                        if (results[i].length !== 0) {
                            noFlag = false;
                            break;
                        }
                    }

                    if (!noFlag) {
                        let idx = 0
                        for (let card of cards) {
                            const dateObject = new Date(`${card}T00:00:00-05:00`);
                            const options = {weekday: 'short', timeZone: 'America/New_York'};
                            const dayOfWeek = dateObject.toLocaleDateString('en-US', options);

                            if (results[idx].length !== 0) {
                                // DOM 에서 동적으로 카드르 만들어 배열에 저장. 붙이기는 정렬 후 한번에 수행하게 됨.
                                deleteScheduleCard(results[idx], dayOfWeek, card);
                            }
                            idx += 1
                        } //카드 생성 완료
                        loadingOff()
                        deleteOnBtn()

                        // 테이블 클릭 시 색상변화
                        tableSelect = document.querySelectorAll("table") //테이블 가져오기
                        for (let i= 0; i < tableSelect.length; i++) {
                            clickFlags[i] = -1
                        }

                        // let tableDate = table.querySelector("#dateInfo").textContent; //현재 테이블 날짜 가져오기
                        tableSelect.forEach(function (table) {
                            table.addEventListener('click', function (event) {
                                // 클릭된 테이블 요소
                                let clickedTable = event.currentTarget;
                                // 클릭된 테이블의 인덱스
                                let tableIndex = Array.from(tableSelect).indexOf(clickedTable);
                                // 두 번째 이후 클릭시 작동
                                if (clickFlags[tableIndex] === -1) { // 선택된 상태에서 클릭하면 스타일 적용
                                    table.style.backgroundColor = "darkgrey";
                                    table.style.color = "white";
                                    clickFlags[tableIndex] *= -1;
                                } else if (clickFlags[tableIndex] === 1) { // 선택된 상태에서 클릭하면 스타일 원복
                                    table.style.backgroundColor = "white";
                                    table.style.color = "black";
                                    clickFlags[tableIndex] *= -1;
                                }
                            })
                        })
                    }
                    else {
                        loadingOff()
                        deleteOnBtn()
                        deleteSession(userId)
                        alert("삭제할 카드가 없습니다.")
                    }
                }
                else {
                    alert("스케줄을 불러오던 중 서버에 오류가 있습니다. \n재시도 부탁드립니다.")
                    loadingOff()
                    deleteOnBtn()
                    deleteSession(userId)
                }
            }

            xhr1.timeout = 20000;

            // 서버에서 일정시간 응답이 없을 때,
            xhr1.ontimeout = function () {
                deleteSession(userId)
                alert("서버 처리 지연.\n재시도 부탁드립니다.")
            };

            // 넷웤이 없는데 요청할때 실행
            xhr1.onerror = function () {
                deleteSession(userId)
                alert("인터넷 접속을 확인하세요.\n재시도 부탁드립니다.")
            };
        }
        // 로그인 실패 시
        else {
            deleteOnBtn()
            loadingOff()
            window.location.href = "/"
            alert("로그인 세션이 만료되었습니다. 로그인 후 삭제 페이지에서 cancel을 눌러주세요!")
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
