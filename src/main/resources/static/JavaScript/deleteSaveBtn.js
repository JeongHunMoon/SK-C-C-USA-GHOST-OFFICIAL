function deleteSaveBtn() {
    //선수 작업
    // 카카오 접속 확인
    // 로딩 부분.
    // 버튼 비활성.
    loadingOn()
    // 현재 모든 폼 nodeList로 가져와서 > 비활성 카드는(반드시 안에 데이터들어 있다고 보장할 수 있음) > /delete 호출하면 됨(페이로드는 [{}, {}, {}]
    // 사용자가 OP 페이지에 들어오면 카카오톡 프로필, 이름을 애니메이션으로 보여준다.
    Kakao.Auth.getStatusInfo(function(statusObj) {
        let nowUserId = null;
        let nowUserNiname = null;
        let allInfos = {}
        let form = null;
        let rocMembers = null;
        let flag  = true;
        let noChange = true;

        let deleteInfo = [] // "A" > ""
        let updateInfo = [] // "A" > "B"
        let insertInfo = [] // "" > "A"

        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUserId = statusObj.user.kakao_account.email;
            nowUserNiname = statusObj.user.kakao_account.profile.nickname

            let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
            xhr_check.open('POST', '/checktypo', true); // REST 정의
            xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
            xhr_check.send(JSON.stringify({"CheckTypo": 'typoPostSample'}));

            xhr_check.onload = function () {
                rocMembers = JSON.parse(xhr_check.responseText);
                console.log("ROC MEMBERS : " + rocMembers); // 전체 ROC인원을 문자열로 가지는 배열.
                form = document.querySelectorAll("#createForm");

                //DB에서 이름을 불러오지 못했을 때
                if (rocMembers.length === 0) {
                    window.location.href = '/remove';
                    document.getElementById("modify_save").disabled = false;
                    document.getElementById("modify_save").style.opacity = 1;
                    alert("현재 DB ROC 맴버가 없습니다.. 관리자에게 문의해주세요??")
                }
                else {
                    form = document.querySelectorAll("#createForm");

                    // 전체 카드 반복(1~7)
                    for (let j = 0; j < form.length; j++) {
                        let formdate = form[j].querySelector("#dateInfo").textContent;

                        // 전극 1,2 차 정보
                        let elecInfo = []
                        elecInfo.push(document.getElementById(formdate + "ELEC1").value)
                        elecInfo.push(document.getElementById(formdate + "ELEC2").value)
                        elecInfo.push(document.getElementById(formdate + "ELEC3").value)
                        elecInfo.push(document.getElementById(formdate + "ELEC4").value)
                        elecInfo.push(document.getElementById(formdate + "ELEC5").value)
                        elecInfo.push(document.getElementById(formdate + "ELEC6").value)
                        // 조립 1,2 차 정보
                        let cellInfo = []
                        cellInfo.push(document.getElementById(formdate + "CELL1").value)
                        cellInfo.push(document.getElementById(formdate + "CELL2").value)
                        cellInfo.push(document.getElementById(formdate + "CELL3").value)
                        cellInfo.push(document.getElementById(formdate + "CELL4").value)
                        cellInfo.push(document.getElementById(formdate + "CELL5").value)
                        cellInfo.push(document.getElementById(formdate + "CELL6").value)
                        // 화성 1,2 차 정보
                        let formInfo = []
                        formInfo.push(document.getElementById(formdate + "FORM1").value)
                        formInfo.push(document.getElementById(formdate + "FORM2").value)
                        formInfo.push(document.getElementById(formdate + "FORM3").value)
                        formInfo.push(document.getElementById(formdate + "FORM4").value)
                        formInfo.push(document.getElementById(formdate + "FORM5").value)
                        formInfo.push(document.getElementById(formdate + "FORM6").value)
                        // 모듈 1,2 차 정보
                        let packInfo = []
                        packInfo.push(document.getElementById(formdate + "PACK1").value)
                        packInfo.push(document.getElementById(formdate + "PACK2").value)
                        packInfo.push(document.getElementById(formdate + "PACK3").value)
                        packInfo.push(document.getElementById(formdate + "PACK4").value)
                        packInfo.push(document.getElementById(formdate + "PACK5").value)
                        packInfo.push(document.getElementById(formdate + "PACK6").value)
                        // wms 1,2 차 정보
                        let wmsInfo = []
                        wmsInfo.push(document.getElementById(formdate + "WMS1").value)
                        wmsInfo.push(document.getElementById(formdate + "WMS2").value)
                        wmsInfo.push(document.getElementById(formdate + "WMS3").value)
                        wmsInfo.push(document.getElementById(formdate + "WMS4").value)
                        wmsInfo.push(document.getElementById(formdate + "WMS5").value)
                        wmsInfo.push(document.getElementById(formdate + "WMS6").value)
                        // 수집 1,2 차 정보
                        let collInfo = []
                        collInfo.push(document.getElementById(formdate + "COLL1").value)
                        collInfo.push(document.getElementById(formdate + "COLL2").value)
                        collInfo.push(document.getElementById(formdate + "COLL3").value)
                        collInfo.push(document.getElementById(formdate + "COLL4").value)
                        collInfo.push(document.getElementById(formdate + "COLL5").value)
                        collInfo.push(document.getElementById(formdate + "COLL6").value)
                        // 공통 1,2 차 정보
                        let commInfo = []
                        commInfo.push(document.getElementById(formdate + "COMM1").value)
                        commInfo.push(document.getElementById(formdate + "COMM2").value)
                        commInfo.push(document.getElementById(formdate + "COMM3").value)
                        commInfo.push(document.getElementById(formdate + "COMM4").value)
                        commInfo.push(document.getElementById(formdate + "COMM5").value)
                        commInfo.push(document.getElementById(formdate + "COMM6").value)

                        for (let i = 1; i < 7; i++) {
                            let elecinf = elecInfo[i - 1].trim(); // 하나의 값
                            let idInf = `${formdate}ELEC${i}`;
                            document.getElementById(idInf).style.color = "black";

                            if (beforeCards[idInf] !== elecinf) {noChange = false;}
                            // 입력 공백 또는 변경 사항이 없을시 continue
                            if ((beforeCards[idInf] === "" && elecinf === "") || (beforeCards[idInf] === elecinf)) {}

                            // 삭제. > 입력 값이 공백인 경우
                            else if (beforeCards[idInf] !== "" && elecinf === "") {
                                deleteInfo.push({
                                    "name": beforeCards[idInf],
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            }

                            // 변경(업데이트) "A" > "B"
                            else if (rocMembers.includes(elecinf) && beforeCards[idInf] !== "" && beforeCards[idInf] !== elecinf) {
                                updateInfo.push({
                                    "name": beforeCards[idInf],
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                    "toBeName": elecinf
                                });
                            }

                            // 추가 "" > "A"
                            else if (rocMembers.includes(elecinf) && beforeCards[idInf] === "") {
                                insertInfo.push({
                                    "name": elecinf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            }

                            else if (!rocMembers.includes(elecinf)) {
                                flag = false;
                                document.getElementById(`${formdate}ELEC${i}`).style.color = "red";
                            }
                            else {
                                flag = false;
                                document.getElementById(`${formdate}ELEC${i}`).style.color = "red";
                            }

                        }

                        // 조립
                        for (let i = 1; i < 7; i++) {
                            let cellinf = cellInfo[i - 1].trim(); // 하나의 값
                            let idInf = `${formdate}CELL${i}`;
                            document.getElementById(idInf).style.color = "black";

                            if (beforeCards[idInf] !== cellinf) {noChange = false;}
                            // 입력 공백 또는 변경 사항이 없을시 continue
                            if ((beforeCards[idInf] === "" && cellinf === "") || (beforeCards[idInf] === cellinf)) {}

                            // 삭제. > 입력 값이 공백인 경우
                            else if (beforeCards[idInf] !== "" && cellinf === "") {
                                deleteInfo.push({
                                    "name": beforeCards[idInf],
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            }

                            // 변경(업데이트) "A" > "B"
                            else if (rocMembers.includes(cellinf) && beforeCards[idInf] !== "" && beforeCards[idInf] !== cellinf) {
                                updateInfo.push({
                                    "name": cellinf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            }

                            // 추가 "" > "A"
                            else if (rocMembers.includes(cellinf) && beforeCards[idInf] === "") {
                                insertInfo.push({
                                    "name": cellinf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            }

                            else if (!rocMembers.includes(cellinf)) {
                                flag = false;
                                document.getElementById(`${formdate}CELL${i}`).style.color = "red";
                            }
                            else {
                                flag = false;
                                document.getElementById(`${formdate}CELL${i}`).style.color = "red";
                            }

                        }
                        /*
                        for (let i = 1; i < 7; i++) {
                            let forminf = formInfo[i - 1].trim();
                            if (forminf === "") {
                            } else if (rocMembers.includes(forminf)) {
                                //confirmedSchedule 정보 넣기
                                document.getElementById(`${formdate}FORM${i}`).style.color = "black";
                                confirmedSchedule.push({
                                    "name": forminf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            } else {
                                // 해당 줄 빨간줄 표시
                                flag = false;
                                document.getElementById(`${formdate}FORM${i}`).style.color = "red";
                            }
                        }
                        for (let i = 1; i < 7; i++) {
                            let packinf = packInfo[i - 1].trim();
                            if (packinf === "") {
                            } else if (rocMembers.includes(packinf)) {
                                //confirmedSchedule 정보 넣기
                                document.getElementById(`${formdate}PACK${i}`).style.color = "black";
                                confirmedSchedule.push({
                                    "name": packinf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            } else {
                                // 해당 줄 빨간줄 표시
                                flag = false;
                                document.getElementById(`${formdate}PACK${i}`).style.color = "red";
                            }
                        }
                        for (let i = 1; i < 7; i++) {
                            let wmsinf = wmsInfo[i - 1].trim();
                            if (wmsinf === "") {
                            } else if (rocMembers.includes(wmsinf)) {
                                //confirmedSchedule 정보 넣기
                                document.getElementById(`${formdate}WMS${i}`).style.color = "black";
                                confirmedSchedule.push({
                                    "name": wmsinf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            } else {
                                // 해당 줄 빨간줄 표시
                                flag = false;
                                document.getElementById(`${formdate}WMS${i}`).style.color = "red";
                            }
                        }
                        for (let i = 1; i < 7; i++) {
                            let collinf = collInfo[i - 1].trim();
                            if (collinf === "") {
                            } else if (rocMembers.includes(collinf)) {
                                document.getElementById(`${formdate}COLL${i}`).style.color = "black";
                                //confirmedSchedule 정보 넣기
                                confirmedSchedule.push({
                                    "name": collinf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            } else {
                                // 해당 줄 빨간줄 표시
                                flag = false;
                                document.getElementById(`${formdate}COLL${i}`).style.color = "red";
                            }
                        }
                        for (let i = 1; i < 7; i++) {
                            let comminf = commInfo[i - 1].trim();
                            if (comminf === "") {
                            } else if (rocMembers.includes(comminf)) {
                                document.getElementById(`${formdate}COMM${i}`).style.color = "black";
                                //confirmedSchedule 정보 넣기
                                confirmedSchedule.push({
                                    "name": comminf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                                //console.log("confirmedSchedule"+JSON.stringify(confirmedSchedule, null, 2));
                            } else {
                                // 해당 줄 빨간줄 표시
                                flag = false;
                                document.getElementById(`${formdate}COMM${i}`).style.color = "red";
                            }
                        }
                        */

                        if (j === form.length - 1) {
                            if (noChange) {
                                document.getElementById("modify_save").disabled = false;
                                document.getElementById("modify_save").style.opacity = 1;
                                alert("변경 사항이 없습니다.")
                                return; //저장하지 않음
                            }
                            // 오타가 없는 경우
                            else if (flag) {
                                console.log("이 값들이 디비에 들어감.", insertInfo)
                                console.log("이 값들이 디비에 삭제됨.", deleteInfo)
                                console.log("이 값들이 디비에 변경됨.", updateInfo)

                                // 비동기 작업 카운터 초기화
                                let asyncTotalCounter = 0;
                                let asyncCounter = 0;
                                if (insertInfo.length !== 0) {asyncTotalCounter +=1}
                                if (deleteInfo.length !== 0) {asyncTotalCounter +=1}
                                if (updateInfo.length !== 0) {asyncTotalCounter +=1}
                                console.log("=================", asyncTotalCounter)

                                // Promise를 사용하여 비동기 작업 정의
                                function performAsyncOperation(xhr, infoArray) {
                                    return new Promise(function(resolve) {
                                        xhr.send(JSON.stringify(infoArray));
                                        xhr.onload = function() {
                                            if (xhr.responseText === "Delete Success" || xhr.responseText === "Save Success" || xhr.responseText === "Update Success") {
                                                resolve();
                                            } else {
                                                // 에러 처리 로직 추가
                                                console.error("비동기 작업 실패");
                                                resolve(); // 실패하더라도 resolve를 호출하여 카운터를 증가시킴
                                            }
                                        };
                                    });
                                }

                                // insert 작업
                                if (insertInfo.length !== 0) {
                                    let insert_xhr = new XMLHttpRequest();
                                    insert_xhr.open('POST', '/saveSchedule', true);
                                    insert_xhr.setRequestHeader("Content-Type", "application/json");

                                    performAsyncOperation(insert_xhr, insertInfo)
                                        .then(function() {
                                            asyncCounter++;
                                            checkAllOperationsComplete();
                                        });
                                }

                                // delete 작업
                                if (deleteInfo.length !== 0) {
                                    let delete_xhr = new XMLHttpRequest();
                                    delete_xhr.open('POST', '/delete', true);
                                    delete_xhr.setRequestHeader("Content-Type", "application/json");

                                    performAsyncOperation(delete_xhr, deleteInfo)
                                        .then(function() {
                                            asyncCounter++;
                                            checkAllOperationsComplete();
                                        });
                                }

                                // update 작업
                                if (updateInfo.length !== 0) {
                                    let update_xhr = new XMLHttpRequest();
                                    update_xhr.open('POST', '/modifyUpdate', true);
                                    update_xhr.setRequestHeader("Content-Type", "application/json");

                                    performAsyncOperation(update_xhr, updateInfo)
                                        .then(function() {
                                            asyncCounter++;
                                            checkAllOperationsComplete();
                                        });
                                }

                                // 모든 비동기 작업이 완료되었는지 확인하는 함수
                                function checkAllOperationsComplete() {
                                    if (asyncCounter === asyncTotalCounter) {
                                        // 모든 작업이 완료된 후에 실행될 동작
                                        window.location.href = "/admin?id=" + nowUserId
                                        document.getElementById("modify_save").disabled = false;
                                        document.getElementById("modify_save").style.opacity = 1;
                                        alert("작업 모두 완료");
                                    }
                                }
                            }
                            else {
                                document.getElementById("modify_save").disabled = false;
                                document.getElementById("modify_save").style.opacity = 1;
                                alert("오탈자를 확인해주세요")
                                return; //저장하지 않음
                            }
                        }
                    }
                }
            }

        }
        else {
            window.location.href = "/"
            document.getElementById("modify_save").disabled = false;
            document.getElementById("modify_save").style.opacity = 1;
            alert("로그인 세션이 만료되었습니다. 다시 로그인 부탁드립니다. ")
        }
    })

}