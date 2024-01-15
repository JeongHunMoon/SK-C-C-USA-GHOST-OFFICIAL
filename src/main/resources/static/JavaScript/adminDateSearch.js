function adminDateSearch() {
    // 폼 요소를 가져옴

    // 시작일과 종료일의 input 요소를 가져옴
    const startDateInput = document.getElementById('date-range-start');
    const endDateInput = document.getElementById('date-range-end');

    // submit 이벤트가 발생하면 실행되는 함수
    dateForm.addEventListener('submit', function(event) {
        // 폼의 기본 동작을 막음 (페이지 새로고침 방지)
        event.preventDefault();
        btnOff()
        loadingOn()

        // 시작일과 종료일의 값을 가져옴
        const startDateString = startDateInput.value;
        const endDateString = endDateInput.value;

        // 시작일과 종료일이 모두 입력되었고, 시작일이 종료일보다 작은 경우
        if (startDateString && endDateString && startDateString <= endDateString) {
            // 기존의 카드 값 초기화.
            // "image-container" id를 가진 div 요소 가져오기
            const imageContainer = document.getElementById('image-container');

            // "schedule_div" 클래스를 가진 모든 div 요소 가져오기
            const scheduleDivs = imageContainer.getElementsByClassName('schedule_div');

            // 모든 "schedule_div"를 순회하며 제거
            while (scheduleDivs.length > 0) {
                scheduleDivs[0].remove();
            }

            // 값을 console에 출력
            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);
            console.log('시작일:', startDateString);
            console.log('종료일:', endDateString);
            //console.log(getDates(startDate, endDate));
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
                        scheduleCard(results[idx], dayOfWeek, card);
                        idx += 1
                    }
                    btnOn()
                    loadingOff()
                }
                else {
                    alert("서버 오류.\n재시도 부탁드립니다.")
                    window.location.href = "/"
                }
            }

            xhr1.timeout = 20000;

            // 서버에서 일정시간 응답이 없을 때,
            xhr1.ontimeout = function () {
                alert("네트워크 문제로 조회 실패\n재시도 부탁드립니다.")
                window.location.href = "/"
            };

            // 넷웤이 없는데 요청할때 실행
            xhr1.onerror = function () {
                alert("네트워크 문제로 조회 실패\n재시도 부탁드립니다.")
                window.location.href = "/"
            };
        }

        else {
            startDateInput.value = getCurrentDate();
            endDateInput.value = getCurrEndDate();
            btnOn()
            alert('시작일은 종료일보다 작아야 합니다. 다시 입력해주세요.');
            loadingOff()
        }
    });
}

// 오늘 날짜를 가져오는 함수
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // 한 자리수인 경우 앞에 0을 추가
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
}

// 끝 날짜를 가져오는 함수
function getCurrEndDate() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    return endDate.toISOString().split('T')[0];
}

// 날짜 범위에 해당하는 날짜들을 배열로 생성하는 함수
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

function btnOff() {
    const dateForm = document.getElementById('dateForm');
    const searchBtn = document.getElementById('date_submit')
    searchBtn.disabled = true;
    searchBtn.style.opacity = 0.5;
}

function btnOn() {
    const dateForm = document.getElementById('dateForm');
    const searchBtn = document.getElementById('date_submit')
    searchBtn.disabled = false;
    searchBtn.style.opacity = 1;
}

