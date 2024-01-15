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
                    console.log("카드생성완료")
                    //테이블 클릭 이벤트 추가
                    tableSelect=document.querySelectorAll("table") //테이블 가져오기
                    console.log(tableSelect)


                    // 테이블 클릭시 이벤트 추가 - 셀의 값 불러오기 및 삭제 배열에 추가
                    // 1. 이름이 없으면 배열에 추가 X 2. 재클릭시 색깔만 바꾸고 배열에 넣지 말기 3. 해제시 삭제
                    tableSelect.forEach(function (table) {
                        table.addEventListener('click', function () {
                            console.log("클릭됨")
                            console.log("table.rows.length() : " + table.rows.length) //테스트

                            console.log("123");
                            // 두 번째 이후 클릭시 작동
                            if (clickFlag === 1 && firstClick !== 0) { // 선택된 상태에서 클릭하면 스타일 원복 및 삭제후보배열에서 삭제
                                clickFlag *= -1;
                                table.style.backgroundColor = "white";
                                table.style.color = "black";
                                //기존 배열에서 삭제   **
                                console.log("기존배열에서 삭제기능 추가")
                                return;
                            } else if (clickFlag === -1 && firstClick !== 0) { // 미선택된 상태에서 클릭하면 스타일만 적용
                                table.style.backgroundColor = "darkgrey";
                                table.style.color = "white";
                                clickFlag *= -1;
                                return;
                            }

                            // 첫 번째 클릭시 작동
                            // 스타일 적용, 테이블 셀 별 텍스트 가져 오며 삭제 후보 배열에 추가
                            table.style.backgroundColor = "darkgrey";
                            table.style.color = "white";

                            let tableDate = table.querySelector("#dateInfo").textContent; //현재 테이블 날짜 가져오기
                            console.log("ELEC 1 ==>  "+document.getElementById(tableDate + "ELEC1").textContent) //span안에는 아무것도 없고 이름은 그밖에있는데

                            // 전극 1,2 차 정보
                            let elecInfo = []
                            elecInfo.push(document.getElementById(tableDate + "ELEC1").textContent)
                            elecInfo.push(document.getElementById(tableDate + "ELEC2").textContent)
                            elecInfo.push(document.getElementById(tableDate + "ELEC3").textContent)
                            elecInfo.push(document.getElementById(tableDate + "ELEC4").textContent)
                            elecInfo.push(document.getElementById(tableDate + "ELEC5").textContent)
                            elecInfo.push(document.getElementById(tableDate + "ELEC6").textContent)
                            console.log("전극정보 : "+elecInfo)
                            // 조립 1,2 차 정보
                            let cellInfo = []
                            cellInfo.push(document.getElementById(tableDate + "CELL1").textContent)
                            cellInfo.push(document.getElementById(tableDate + "CELL2").textContent)
                            cellInfo.push(document.getElementById(tableDate + "CELL3").textContent)
                            cellInfo.push(document.getElementById(tableDate + "CELL4").textContent)
                            cellInfo.push(document.getElementById(tableDate + "CELL5").textContent)
                            cellInfo.push(document.getElementById(tableDate + "CELL6").textContent)
                            // 화성 1,2 차 정보
                            let formInfo = []
                            formInfo.push(document.getElementById(tableDate + "FORM1").textContent)
                            formInfo.push(document.getElementById(tableDate + "FORM2").textContent)
                            formInfo.push(document.getElementById(tableDate + "FORM3").textContent)
                            formInfo.push(document.getElementById(tableDate + "FORM4").textContent)
                            formInfo.push(document.getElementById(tableDate + "FORM5").textContent)
                            formInfo.push(document.getElementById(tableDate + "FORM6").textContent)
                            // 모듈 1,2 차 정보
                            let packInfo = []
                            packInfo.push(document.getElementById(tableDate + "PACK1").textContent)
                            packInfo.push(document.getElementById(tableDate + "PACK2").textContent)
                            packInfo.push(document.getElementById(tableDate + "PACK3").textContent)
                            packInfo.push(document.getElementById(tableDate + "PACK4").textContent)
                            packInfo.push(document.getElementById(tableDate + "PACK5").textContent)
                            packInfo.push(document.getElementById(tableDate + "PACK6").textContent)
                            // wms 1,2 차 정보
                            let wmsInfo = []
                            wmsInfo.push(document.getElementById(tableDate + "WMS1").textContent)
                            wmsInfo.push(document.getElementById(tableDate + "WMS2").textContent)
                            wmsInfo.push(document.getElementById(tableDate + "WMS3").textContent)
                            wmsInfo.push(document.getElementById(tableDate + "WMS4").textContent)
                            wmsInfo.push(document.getElementById(tableDate + "WMS5").textContent)
                            wmsInfo.push(document.getElementById(tableDate + "WMS6").textContent)
                            // 수집 1,2 차 정보
                            let collInfo = []
                            collInfo.push(document.getElementById(tableDate + "COLL1").textContent)
                            collInfo.push(document.getElementById(tableDate + "COLL2").textContent)
                            collInfo.push(document.getElementById(tableDate + "COLL3").textContent)
                            collInfo.push(document.getElementById(tableDate + "COLL4").textContent)
                            collInfo.push(document.getElementById(tableDate + "COLL5").textContent)
                            collInfo.push(document.getElementById(tableDate + "COLL6").textContent)
                            // 공통 1,2 차 정보
                            let commInfo = []
                            commInfo.push(document.getElementById(tableDate + "COMM1").textContent)
                            commInfo.push(document.getElementById(tableDate + "COMM2").textContent)
                            commInfo.push(document.getElementById(tableDate + "COMM3").textContent)
                            commInfo.push(document.getElementById(tableDate + "COMM4").textContent)
                            commInfo.push(document.getElementById(tableDate + "COMM5").textContent)
                            commInfo.push(document.getElementById(tableDate + "COMM6").textContent)

                            // 불러온 셀 정보가 공백이 아니고 첫번째 클릭인 경우에 삭제후보배열에 추가한다
                            // 전극
                            for (let i = 1; i < 7; i++) {
                                let elecinf = elecInfo[i - 1].trim(); // 문자열 좌우 공백 제거
                                if (elecinf !== "" && firstClick === 0) {
                                    deleteInfo.push({
                                        "name": elecinf,
                                        "date": tableDate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                    });
                                    console.log("전극들어감")
                                }
                            }

                            // 조립
                            for (let i = 1; i < 7; i++) {
                                let cellinf = cellInfo[i - 1].trim(); // 하나의 값
                                //let idInf = `${tableDate}CELL${i}`;
                                //공백이 아니고 첫번째 클린 경우 삭제후보배열에 추가
                                if (cellinf !== "" && firstClick === 0) {
                                    deleteInfo.push({
                                        // "name": beforeCards[idInf],
                                        "name": cellinf,
                                        "date": tableDate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                    });
                                }
                            }

                            // 화성
                            for (let i = 1; i < 7; i++) {
                                let forminf = formInfo[i - 1].trim();
                                //공백이 아니고 첫번째 클린 경우 삭제후보배열에 추가
                                if (forminf !== "" && firstClick === 0) {
                                    deleteInfo.push({
                                        // "name": beforeCards[idInf],
                                        "name": forminf,
                                        "date": tableDate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                    });
                                }
                            }

                            // 모듈
                            for (let i = 1; i < 7; i++) {
                                let packinf = packInfo[i - 1].trim();
                                //공백이 아니고 첫번째 클린 경우 삭제후보배열에 추가
                                if (packinf !== "" && firstClick === 0) {
                                    deleteInfo.push({
                                        // "name": beforeCards[idInf],
                                        "name": packinf,
                                        "date": tableDate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                    });
                                }
                            }

                            //wms
                            for (let i = 1; i < 7; i++) {
                                let wmsinf = wmsInfo[i - 1].trim();
                                //공백이 아니고 첫번째 클린 경우 삭제후보배열에 추가
                                if (wmsinf !== "" && firstClick === 0) {
                                    deleteInfo.push({
                                        // "name": beforeCards[idInf],
                                        "name": wmsinf,
                                        "date": tableDate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                    });
                                }
                            }

                            //수집
                            for (let i = 1; i < 7; i++) {
                                let collinf = collInfo[i - 1].trim();
                                //공백이 아니고 첫번째 클린 경우 삭제후보배열에 추가
                                if (collinf !== "" && firstClick === 0) {
                                    deleteInfo.push({
                                        // "name": beforeCards[idInf],
                                        "name": collinf,
                                        "date": tableDate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                    });
                                }
                            }

                            //공통
                            for (let i = 1; i < 7; i++) {
                                let comminf = commInfo[i - 1].trim();
                                //공백이 아니고 첫번째 클린 경우 삭제후보배열에 추가
                                if (comminf !== "" && firstClick === 0) {
                                    deleteInfo.push({
                                        // "name": beforeCards[idInf],
                                        "name": comminf,
                                        "date": tableDate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                    });
                                }
                            }
                            firstClick++; //firstClick 값 증가. (두번째 클릭시 배열에 넣지 않기 위함)
                        })
                        return deleteInfo; //테이블 클릭할때마다 새로운 삭제후보 배열을 반환해준다
                    })
                    //테이블 클릭 이벤트 끝
                }
                else {
                    alert("삭제할 카드가 없습니다.")
                    loadingOff()
                    deleteOnBtn()
                    window.location.href = "/admin?id=" + userId
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