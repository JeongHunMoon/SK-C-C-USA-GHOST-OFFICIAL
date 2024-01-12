// 현재 록인한 정보를 가져와서, 만약 로그인이 안되어 있다면 비정상인 경우이므로 > "/" 메인으로 이동시킨다.
// 메인으로 이동하는 경우는 로그인 세션이 완료된 경우임로

//최초 사용자(운영자) 이미 카카오 로그인이 되어있는지 판단.
document.getElementById('slider').disabled = true; // 비활성화
document.getElementById('startBtnModify').disabled = true; // 비활성화

document.getElementById('doneBtnModify').style.display = 'none'; // 제출 버튼 비활성화
document.getElementById('saveBtnModify').style.display = 'none'; // 제출 버튼 비활성화
document.getElementById('cancelBtnModify').style.display = 'none'; // 제출 버튼 비활성화

loadingOn();
Kakao.Auth.getStatusInfo(function(statusObj) {
    let nowUserId = null;
    let nowUserNiname = null;

    // 만약 사용자가 로그인이 되어 있는 경우
    if (statusObj.status === 'connected') {
        nowUserId = statusObj.user.kakao_account.email;
        nowUserNiname = statusObj.user.kakao_account.profile.nickname


        // 현재 날짜 얻기 함수.
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


        //이미지 컨트롤러 스크롤 이벤트
        const Container = document.getElementById("image-container");
        document.addEventListener('DOMContentLoaded', function () {
            let container = document.getElementById('image-container');

            container.addEventListener('wheel', function (e) {
                container.scrollLeft += e.deltaY;
                e.preventDefault();
            });
        });



        //디비에 저장된 마지막 날짜를 기준 + 1을 default로 출력
        let date = null;
        let dayOfWeek = null;
        let cardInfo = []

        // 이 계정이 등록되어 있는 DB 조회하여 판단.
        let xhr1 = new XMLHttpRequest(); // REST API 통신을 위한 객체
        xhr1.open('POST', '/adminShiftLastDate', true); // REST 정의
        xhr1.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
        xhr1.send(JSON.stringify({"date" : date})) // 서버로 POST 전송

        // 서버 응답
        xhr1.onload = function () {
            let results = xhr1.responseText; // 서버에서 전달 받은 payload
            if (results === "False") {
                date = getCurrentDate();
                alert("DB에 스케줄 정보가 없습니다. \n오늘 날짜를 기준으로 만드세요!")
            }
            else { date = results }

            let newYorkTimeZone = "America/New_York";

            // 주어진 날짜를 Date 객체로 변환하고 뉴욕 시간으로 설정
            let dateInNewYork = new Date(date + "T00:00:00");
            dateInNewYork.toLocaleString("en-US", { timeZone: newYorkTimeZone });

            // 날짜의 요일을 가져오기
            dayOfWeek = dateInNewYork.toLocaleDateString("en-US", { weekday: "long" });
            Container.appendChild(createCardStored([], dayOfWeek, date, true))


            //처음 페이지가 실행되면 DB에서 가장 마지막 날짜 + 1 날짜를 가져옴 + default 1개 출력
            cardInfo = []
            let dateArray = [];

            let startDate = new Date(date);
            let endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);

            // 7일 날짜 정보
            while (startDate <= endDate) {
                let formattedDate = startDate.toISOString().split('T')[0];
                dateArray.push(formattedDate);
                startDate.setDate(startDate.getDate() + 1);
            }

            // DB에서 조회된 날짜 + 7일 정보 저장.
            for(let dateVal of dateArray) {
                console.log(dateVal)
                let newYorkTimeZone = "America/New_York";

                // 주어진 날짜를 Date 객체로 변환하고 뉴욕 시간으로 설정
                let dateInNewYork = new Date(dateVal + "T00:00:00");
                dateInNewYork.toLocaleString("en-US", { timeZone: newYorkTimeZone });

                // 날짜의 요일을 가져오기
                let dayOfWeek = dateInNewYork.toLocaleDateString("en-US", { weekday: "long" });
                cardInfo.push(createCardStored([], dayOfWeek, dateVal, true))
            }
            console.log(cardInfo)
            document.getElementById('slider').disabled = false; // 활성화
            document.getElementById('startBtnModify').disabled = false; // 활성화


            // 백업 검사. 기존에 작업하던 값이 있었다면 백업한다.
            let saved_xhr = new XMLHttpRequest();
            saved_xhr.open('POST', '/getSavedData', true);
            saved_xhr.setRequestHeader("Content-Type", "application/json");

            saved_xhr.send(JSON.stringify({"id": nowUserId}));

            saved_xhr.onload = function () {
                let results = saved_xhr.responseText;

                // JSON 형식의 문자열을 배열로 파싱
                let savedDataArray = JSON.parse(results);
                console.log("아래 객체는 서버에서 전달 받은 저장된 세션 값")
                console.log(savedDataArray)

                // 저장된 데이터가 없음.
                if (savedDataArray.length !== 0) {
                    // 기존의 요소 다 지우기
                    let imageContainer = document.getElementById("image-container");
                    while (imageContainer.firstChild) {
                        imageContainer.removeChild(imageContainer.firstChild);
                    }


                    // 주어진 날짜를 Date 객체로 변환하고 뉴욕 시간으로 설정
                    // 날짜의 요일을 가져오기
                    let newYorkTimeZone = "America/New_York";

                    // 집합으로 중복 날짜 제거
                    let mySet = new Set();
                    for(let i = 0; i < savedDataArray.length; i++) {
                        mySet.add(savedDataArray[i][0])
                    }

                    let setToArray = Array.from(mySet);
                    for(let d of setToArray) {
                        let dateInNewYork = new Date(d + "T00:00:00");
                        dateInNewYork.toLocaleString("en-US", { timeZone: newYorkTimeZone });
                        let dayOfWeek = dateInNewYork.toLocaleDateString("en-US", { weekday: "long" });
                        imageContainer.appendChild(createCardStored([], dayOfWeek, d, true))
                    }


                    for(let i = 0; i < savedDataArray.length; i++) {
                        document.getElementById(savedDataArray[i][1]).value = savedDataArray[i][2];
                    }

                    // p태그 개수 변경
                    document.getElementById("slider-value").textContent = mySet.size.toString();
                    // 슬라이드, start 버튼 비활성화
                    document.getElementById('slider').style.display = 'none'; // 제출 버튼 비활성화
                    document.getElementById('startBtnModify').style.display = 'none'; // 제출 버튼 비활성화

                    // saved와 done 버튼 활성화
                    document.getElementById('saveBtnModify').style.display = 'flex'; // 제출 버튼 활성화
                    document.getElementById('doneBtnModify').style.display = 'flex'; // 제출 버튼 활성화
                    document.getElementById('cancelBtnModify').style.display = 'flex'; // 제출 버튼 활성화

                    const inputElements = document.querySelectorAll('#image-container input');

                    // 가져온 input 태그들을 순회하면서 비활성화
                    inputElements.forEach(input => {
                        input.disabled = false;
                    });

                    alert("돌아온 것을 환영합니다. 마저 등록해주세요.")
                    loadingOff();
                }

                // 이후에 savedDataArray를 활용하여 원하는 작업 수행
                console.log("백언 안함"+ savedDataArray);
                loadingOff();
            }
        }

        // 슬라이더가 이동할 때 마다 실행되는 함수
        function updateValue() {
            const slider = document.getElementById('slider');
            const sliderValue = document.getElementById('slider-value');
            const value = slider.value;

            sliderValue.textContent = value;

            //다 지우기.
            let imageContainer = document.getElementById("image-container");

            while (imageContainer.firstChild) {
                imageContainer.removeChild(imageContainer.firstChild);
            }

            // 다 찍기.
            for(let i = 0; i < value; i++) {
                Container.appendChild(cardInfo[i])
            }
        }
        document.getElementById('slider').addEventListener('input', updateValue);

        // 입력 시작 이벤트
        // submit 이벤트가 발생하면 실행되는 함수
        const dateForm = document.getElementById('startBtnModify');
        dateForm.addEventListener('click', function(event) {
            document.getElementById('startBtnModify').style.display = 'none'; // 제출 버튼 비활성화
            document.getElementById('slider').style.display = 'none';

            let start_xhr = new XMLHttpRequest();
            start_xhr.open("GET", "/uniquePage?id="+nowUserId, true);
            start_xhr.send();

            start_xhr.onload = function() {
                // 받은 문자열에 따라 원하는 동작 수행
                if (start_xhr.responseText === "true") {
                    // id > 이름 변경
                    alert(nowUserNiname + " 매니저님, 스케줄을 생성해주세요.")

                    // image-container 내부의 모든 input 태그 가져오기
                    const inputElements = document.querySelectorAll('#image-container input');

                    // 가져온 input 태그들을 순회하면서 비활성화
                    inputElements.forEach(input => {
                        input.disabled = false;
                    });
                    document.getElementById('doneBtnModify').style.display = 'flex'; // 제출 버튼 비활성화
                    document.getElementById('saveBtnModify').style.display = 'flex'; // 제출 버튼 비활성화
                    document.getElementById('cancelBtnModify').style.display = 'flex'; // 제출 버튼 활성화
                }
                // 이 코드 동작안하며 원인 파악 필요함.
                else if(start_xhr.responseText === "false") {
                    let payload = start_xhr.responseText

                    document.getElementById('slider').style.display = 'flex';
                    document.getElementById('startBtnModify').style.display = 'flex';

                    console.log("누군가 쓰고 있음." + start_xhr.responseText);
                    window.location.href = "/admin?id=" + nowUserId;
                    alert("다른 운영자님이 스케줄 생성 중입니다.\n 잠시 대기해주세요.")
                }
                else {
                    document.getElementById('slider').style.display = 'flex';
                    document.getElementById('startBtnModify').style.display = 'flex';

                    window.location.href = "/";
                    alert("잘못된 접근입니다.")
                }
            };
        })

        // submit 이벤트가 발생하면 실행되는 함수
        const doneForm2 = document.getElementById('doneBtnModify');
        doneForm2.addEventListener('click', function(event) {
            doneForm2.disabled = true; // 제출 버튼 활성화
            doneForm2.style.opacity = 0.5
            createSchedule()
        })

        // submit 이벤트가 발생하면 실행되는 함수
        const saveForm = document.getElementById('saveBtnModify');
        saveForm.addEventListener('click', function(event) {
            saveForm.disabled = true; // 제출 버튼 활성화
            saveForm.style.opacity = 0.5
            // DB 에 접속하여 해당 세션은 무조건 있음.
            // 해당 세션에 데이터를 저장하면 됨.

            //현재 DOM에서 정보들을 모두 가져온다.
            let datas = savedwithSession()
            console.log("프론트", datas)
            if (datas !== "") {
                let save_xhr = new XMLHttpRequest();
                save_xhr.open('POST', '/saveData', true);
                save_xhr.setRequestHeader("Content-Type", "application/json");

                // datas 문자열을 서버로 직접 전송
                save_xhr.send(JSON.stringify({ "datas": datas }));

                // 서버 응답
                save_xhr.onload = function () {
                    let results = save_xhr.responseText;
                    saveForm.disabled = false; // 제출 버튼 활성화
                    saveForm.style.opacity = 1;
                    alert("임시 저장 완료!")
                };
            }
            else {
                saveForm.disabled = false; // 제출 버튼 활성화
                saveForm.style.opacity = 1;
                alert("저장할 값이 없습니다.")
            }
        })


        // cancel 이벤트가 발생하면 실행되는 함수
        const cancelForm = document.getElementById('cancelBtnModify');
        cancelForm.addEventListener('click', function(event) {
            cancelForm.disabled = true; // 제출 버튼 활성화
            cancelForm.style.opacity = 0.5

            //해당 코드로 변경 필요 > window.location.href = "/remove?id="+nowUserId;
            window.location.href = "/remove";

            cancelForm.disabled = false; // 제출 버튼 활성화
            cancelForm.style.opacity = 1
            alert("취소되었습니다.")
        })
    }

    else {
        window.location.href = "/"
        alert("세션이 만료되었습니다. 로그인을 다시해주세요.")
        loadingOff();
    }
})
