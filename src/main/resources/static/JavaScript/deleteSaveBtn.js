function deleteSaveBtn() {
    let button = document.getElementById("delete_save")
    let tableSelect = null;
    let tableDate=null;
    let unClicked = 0;
    let deleteInfo = [];
    button.disabled = true;     // 버튼 비활성화
    button.style.opacity = 0.5; // 투명도를 0.5로 설정
    loadingOn();
    deleteOffBtn()

    // 현재 모든 폼 nodeList로 가져와서 > 비활성 카드는(반드시 안에 데이터들어 있다고 보장할 수 있음) > /delete 호출하면 됨(페이로드는 [{}, {}, {}]

    //카카오 접속 확인
    Kakao.Auth.getStatusInfo(function(statusObj) {
        let nowUserId = null;
        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            deleteOnBtn()
            loadingOff()
            nowUserId = statusObj.user.kakao_account.email;
            tableSelect=document.querySelectorAll("table") //테이블 가져오기
            console.log("TABLE SELECT" + tableSelect.length)
            //테이블 클릭 이벤트 시작 추가 - 셀의 값 불러오기 및 삭제 배열에 추가
            // 클릭시 색상변화 -> 수정 : 클릭이 아니라 DOM으로 생성된 테이블 전체를 돌면서 회색인 테이블에 대해서만 값을 불러와서 리스트에 누적. (이 함수 끝나고 DB 호출)
            for(let i=0; i<tableSelect.length; i++){
                if(tableSelect[i].style.backgroundColor === "darkgrey" && tableSelect[i].style.color === "white"){
                    tableDate = tableSelect[i].querySelector("#dateInfo").textContent; //현재 테이블 날짜 가져오기
                    // 전극 1,2 차 정보
                    let elecInfo = []
                    elecInfo.push(document.getElementById(tableDate + "ELEC1").textContent)
                    elecInfo.push(document.getElementById(tableDate + "ELEC2").textContent)
                    elecInfo.push(document.getElementById(tableDate + "ELEC3").textContent)
                    elecInfo.push(document.getElementById(tableDate + "ELEC4").textContent)
                    elecInfo.push(document.getElementById(tableDate + "ELEC5").textContent)
                    elecInfo.push(document.getElementById(tableDate + "ELEC6").textContent)
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
                        if (elecinf !== "") {
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
                        if (cellinf !== "" ) {
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
                        if (forminf !== "" ) {
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
                        if (packinf !== "" ) {
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
                        if (wmsinf !== "" ) {
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
                        if (collinf !== "" ) {
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
                        if (comminf !== "" ) {
                            deleteInfo.push({
                                // "name": beforeCards[idInf],
                                "name": comminf,
                                "date": tableDate,
                                "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                "priority": i < 4 ? '1' : '2',
                            });
                        }
                    }
                }
                else if (tableSelect[i].style.backgroundColor !== "darkgrey" && tableSelect[i].style.color !== "white"){
                    unClicked+=1;
                    console.log(unClicked)
                }
                if(i === tableSelect.length-1 && unClicked === tableSelect.length){
                    alert("선택된 테이블이 없습니다. 삭제를 원하는 테이블을 클릭 해주세요")
                    return;
                }
            }

            console.log("이 값들이 디비에 삭제됨.", deleteInfo);
            // 비동기 작업 카운터 초기화
            let asyncTotalCounter = 0;
            let asyncCounter = 0; //What for?
            if (deleteInfo.length !== 0) {
                asyncTotalCounter += 1
            }
            console.log("=================", asyncTotalCounter)

            // // delete 작업
            // if (deleteInfo.length !== 0) {
            //     let confirmCheck = confirm("정말 삭제하시겠습니까?")
            //     if (confirmCheck === true) {
            //         let delete_xhr = new XMLHttpRequest();
            //         delete_xhr.open('POST', '/delete', true);
            //         delete_xhr.setRequestHeader("Content-Type", "application/json");
            //     } else {
            //         return 0;
            //     }
            // } else if (deleteInfo.length === 0) {
            //     alert("선택된 데이터가 없습니다. 삭제가 필요한 카드를 선택하세요")
            //     return 0;
            // }
        }
        //로그인 되어있지 않은 경우
        else {
            window.location.href = "/"
            deleteOffBtn();
            alert("로그인 세션이 만료되었습니다. 다시 로그인 부탁드립니다.")
        }
    });
}