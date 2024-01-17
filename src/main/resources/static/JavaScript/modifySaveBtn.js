function modifySaveBtn(beforeCards) {
    document.getElementById("modify_save").disabled = true;     // 버튼 비활성화
    document.getElementById("modify_save").style.opacity = 0.5;     // 버튼 비활성화

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
                if(xhr_check.status === 200) {
                    rocMembers = JSON.parse(xhr_check.response);
                    console.log("ROC MEMBERS : " + rocMembers); // 전체 ROC인원을 문자열로 가지는 배열.
                    form = document.querySelectorAll("#createForm");

                    //DB에서 member table이 비어 있는 경우
                    if (rocMembers.length === 0) {
                        let remove_xhr = new XMLHttpRequest();
                        remove_xhr.open("GET", "/removeModify?id="+nowUserId, true);

                        // Timeout 설정 (예: 5초)
                        remove_xhr.timeout = 5000;

                        remove_xhr.onload = function () {
                            if (remove_xhr.status === 200) {
                                if (remove_xhr.responseText === "true") {
                                    document.getElementById("modify_save").disabled = false;
                                    document.getElementById("modify_save").style.opacity = 1;
                                    alert("현재 DB ROC 맴버가 없습니다.. 관리자에게 문의해주세요!")
                                    window.location.href = "admin?id="+nowUserId;
                                }
                                else {
                                    document.getElementById("modify_save").disabled = false;
                                    document.getElementById("modify_save").style.opacity = 1;
                                    alert("잘못된 접근입니다.")
                                    window.location.href = "/";
                                }

                            } else {
                                document.getElementById("modify_save").disabled = false;
                                document.getElementById("modify_save").style.opacity = 1;
                                alert("취소 실패. 다시 취소 부탁드립니다.")
                            }
                        };

                        // 서버에서 일정시간 응답이 없을 때,
                        remove_xhr.ontimeout = function () {
                            document.getElementById("modify_save").disabled = false;
                            document.getElementById("modify_save").style.opacity = 1;
                            alert("Request timed out. Please try again.");
                        };

                        // 넷웤이 없는데 요청할때 실행
                        remove_xhr.onerror = function () {
                            document.getElementById("modify_save").disabled = false;
                            document.getElementById("modify_save").style.opacity = 1;
                            alert("Network error occurred. Please check your connection and try again.");
                        };

                        // 프론트에서 네트워크가 있는 경우에 전송
                        if (navigator.onLine) {
                            remove_xhr.send();
                        } else {
                            document.getElementById("modify_save").disabled = false;
                            document.getElementById("modify_save").style.opacity = 1;
                            location.reload();
                            alert("No internet connection. Please check your connection and try again.");
                        }
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
                            wmsInfo.push(document.getElementById(formdate + "WMS7").value)
                            wmsInfo.push(document.getElementById(formdate + "WMS8").value)
                            wmsInfo.push(document.getElementById(formdate + "WMS9").value)

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
                                        "manager" : nowUserId
                                    });
                                }

                                // 변경(업데이트) "A" > "B"
                                else if (rocMembers.hasOwnProperty(elecinf) && rocMembers[elecinf] === "ELEC" && beforeCards[idInf] !== "" && beforeCards[idInf] !== elecinf) {
                                    updateInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "toBeName": elecinf,
                                        "manager" : nowUserId
                                    });
                                }

                                // 추가 "" > "A"
                                else if (rocMembers.hasOwnProperty(elecinf) && rocMembers[elecinf] === "ELEC" && beforeCards[idInf] === "") {
                                    insertInfo.push({
                                        "name": elecinf,
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
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
                                        "manager" : nowUserId
                                    });
                                }

                                // 변경(업데이트) "A" > "B"
                                else if (rocMembers.hasOwnProperty(cellinf) && rocMembers[cellinf] === "CELL" && beforeCards[idInf] !== "" && beforeCards[idInf] !== cellinf) {
                                    updateInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "toBeName": cellinf,
                                        "manager" : nowUserId
                                    });
                                }

                                // 추가 "" > "A"
                                else if (rocMembers.hasOwnProperty(cellinf) && rocMembers[cellinf] === "CELL" && beforeCards[idInf] === "") {
                                    insertInfo.push({
                                        "name": cellinf,
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
                                }

                                else {
                                    flag = false;
                                    document.getElementById(`${formdate}CELL${i}`).style.color = "red";
                                }
                            }

                            // 화성
                            for (let i = 1; i < 7; i++) {
                                let forminf = formInfo[i - 1].trim(); // 하나의 값
                                let idInf = `${formdate}FORM${i}`;
                                document.getElementById(idInf).style.color = "black";

                                if (beforeCards[idInf] !== forminf) {noChange = false;}
                                // 입력 공백 또는 변경 사항이 없을시 continue
                                if ((beforeCards[idInf] === "" && forminf === "") || (beforeCards[idInf] === forminf)) {}

                                // 삭제. > 입력 값이 공백인 경우
                                else if (beforeCards[idInf] !== "" && forminf === "") {
                                    deleteInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
                                }

                                // 변경(업데이트) "A" > "B"
                                else if (rocMembers.hasOwnProperty(forminf) && rocMembers[forminf] === "FORM" && beforeCards[idInf] !== "" && beforeCards[idInf] !== forminf) {
                                    updateInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "toBeName": forminf,
                                        "manager" : nowUserId
                                    });
                                }

                                // 추가 "" > "A"
                                else if (rocMembers.hasOwnProperty(forminf) && rocMembers[forminf] === "FORM" && beforeCards[idInf] === "") {
                                    insertInfo.push({
                                        "name": forminf,
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
                                }

                                else {
                                    flag = false;
                                    document.getElementById(`${formdate}FORM${i}`).style.color = "red";
                                }
                            }

                            // 모듈
                            for (let i = 1; i < 7; i++) {
                                let packinf = packInfo[i - 1].trim(); // 하나의 값
                                let idInf = `${formdate}PACK${i}`;
                                document.getElementById(idInf).style.color = "black";

                                if (beforeCards[idInf] !== packinf) {noChange = false;}
                                // 입력 공백 또는 변경 사항이 없을시 continue
                                if ((beforeCards[idInf] === "" && packinf === "") || (beforeCards[idInf] === packinf)) {}

                                // 삭제. > 입력 값이 공백인 경우
                                else if (beforeCards[idInf] !== "" && packinf === "") {
                                    deleteInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
                                }

                                // 변경(업데이트) "A" > "B"
                                else if (rocMembers.hasOwnProperty(packinf) && rocMembers[packinf] === "PACK" && beforeCards[idInf] !== "" && beforeCards[idInf] !== packinf) {
                                    updateInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "toBeName": packinf,
                                        "manager" : nowUserId
                                    });
                                }

                                // 추가 "" > "A"
                                else if (rocMembers.hasOwnProperty(packinf) && rocMembers[packinf] === "PACK" && beforeCards[idInf] === "") {
                                    insertInfo.push({
                                        "name": packinf,
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
                                }

                                else {
                                    flag = false;
                                    document.getElementById(`${formdate}PACK${i}`).style.color = "red";
                                }
                            }

                            // WMS
                            for (let i = 1; i < 10; i++) {
                                let wmsinf = wmsInfo[i - 1].trim(); // 하나의 값
                                let idInf = `${formdate}WMS${i}`;
                                document.getElementById(idInf).style.color = "black";

                                if (beforeCards[idInf] !== wmsinf) {noChange = false;}
                                // 입력 공백 또는 변경 사항이 없을시 continue
                                if ((beforeCards[idInf] === "" && wmsinf === "") || (beforeCards[idInf] === wmsinf)) {}

                                // 삭제. > 입력 값이 공백인 경우
                                else if (beforeCards[idInf] !== "" && wmsinf === "") {
                                    deleteInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": (i < 4) ? '1' : (i < 7) ? '2' : '3',
                                        "manager" : nowUserId
                                    });
                                }

                                // 변경(업데이트) "A" > "B"
                                else if (rocMembers.hasOwnProperty(wmsinf) && rocMembers[wmsinf] === "WMS" && beforeCards[idInf] !== "" && beforeCards[idInf] !== wmsinf) {
                                    updateInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": (i < 4) ? '1' : (i < 7) ? '2' : '3',
                                        "toBeName": wmsinf,
                                        "manager" : nowUserId
                                    });
                                }

                                // 추가 "" > "A"
                                else if (rocMembers.hasOwnProperty(wmsinf) && rocMembers[wmsinf] === "WMS" && beforeCards[idInf] === "") {
                                    insertInfo.push({
                                        "name": wmsinf,
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": (i < 4) ? '1' : (i < 7) ? '2' : '3',
                                        "manager" : nowUserId
                                    });
                                }

                                else {
                                    flag = false;
                                    document.getElementById(`${formdate}WMS${i}`).style.color = "red";
                                }
                            }

                            // 수집서버
                            for (let i = 1; i < 7; i++) {
                                let collinf = collInfo[i - 1].trim(); // 하나의 값
                                let idInf = `${formdate}COLL${i}`;
                                document.getElementById(idInf).style.color = "black";

                                if (beforeCards[idInf] !== collinf) {noChange = false;}
                                // 입력 공백 또는 변경 사항이 없을시 continue
                                if ((beforeCards[idInf] === "" && collinf === "") || (beforeCards[idInf] === collinf)) {}

                                // 삭제. > 입력 값이 공백인 경우
                                else if (beforeCards[idInf] !== "" && collinf === "") {
                                    deleteInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
                                }

                                // 변경(업데이트) "A" > "B"
                                else if (rocMembers.hasOwnProperty(collinf) && rocMembers[collinf] === "COLL" && beforeCards[idInf] !== "" && beforeCards[idInf] !== collinf) {
                                    updateInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "toBeName": collinf,
                                        "manager" : nowUserId
                                    });
                                }

                                // 추가 "" > "A"
                                else if (rocMembers.hasOwnProperty(collinf) && rocMembers[collinf] === "COLL" && beforeCards[idInf] === "") {
                                    insertInfo.push({
                                        "name": collinf,
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
                                }

                                else {
                                    flag = false;
                                    document.getElementById(`${formdate}COLL${i}`).style.color = "red";
                                }
                            }

                            // 공통
                            for (let i = 1; i < 7; i++) {
                                let comminf = commInfo[i - 1].trim(); // 하나의 값
                                let idInf = `${formdate}COMM${i}`;
                                document.getElementById(idInf).style.color = "black";

                                if (beforeCards[idInf] !== comminf) {noChange = false;}
                                // 입력 공백 또는 변경 사항이 없을시 continue
                                if ((beforeCards[idInf] === "" && comminf === "") || (beforeCards[idInf] === comminf)) {}

                                // 삭제. > 입력 값이 공백인 경우
                                else if (beforeCards[idInf] !== "" && comminf === "") {
                                    deleteInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
                                }

                                // 변경(업데이트) "A" > "B"
                                else if (rocMembers.hasOwnProperty(comminf) && rocMembers[comminf] === "COMM" && beforeCards[idInf] !== "" && beforeCards[idInf] !== comminf) {
                                    updateInfo.push({
                                        "name": beforeCards[idInf],
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "toBeName": comminf,
                                        "manager" : nowUserId
                                    });
                                }

                                // 추가 "" > "A"
                                else if (rocMembers.hasOwnProperty(comminf) && rocMembers[comminf] === "COMM" && beforeCards[idInf] === "") {
                                    insertInfo.push({
                                        "name": comminf,
                                        "date": formdate,
                                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                        "priority": i < 4 ? '1' : '2',
                                        "manager" : nowUserId
                                    });
                                }

                                else {
                                    flag = false;
                                    document.getElementById(`${formdate}COMM${i}`).style.color = "red";
                                }
                            }

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

                                    // 동기적으로 처리하기 위해 async 함수 사용
                                    async function performSyncOperations() {
                                        // insert 작업
                                        if (insertInfo.length !== 0) {
                                            let insert_xhr = new XMLHttpRequest();
                                            insert_xhr.open('POST', '/saveSchedule', true);
                                            insert_xhr.setRequestHeader("Content-Type", "application/json");
                                            await performAsyncOperation(insert_xhr, insertInfo);
                                        }

                                        // delete 작업
                                        if (deleteInfo.length !== 0) {
                                            let delete_xhr = new XMLHttpRequest();
                                            delete_xhr.open('POST', '/delete', true);
                                            delete_xhr.setRequestHeader("Content-Type", "application/json");
                                            await performAsyncOperation(delete_xhr, deleteInfo);
                                        }

                                        // update 작업
                                        if (updateInfo.length !== 0) {
                                            let update_xhr = new XMLHttpRequest();
                                            update_xhr.open('POST', '/updateSchedule', true);
                                            update_xhr.setRequestHeader("Content-Type", "application/json");
                                            await performAsyncOperation(update_xhr, updateInfo);
                                        }

                                        // 모든 작업이 완료된 후에 수행할 로직
                                        checkAllOperationsComplete();
                                    }

                                    // performSyncOperations 함수 호출
                                    performSyncOperations();

                                    // 모든 비동기 작업이 완료되었는지 확인하는 함수
                                    function checkAllOperationsComplete() {
                                        let delete_xhr = new XMLHttpRequest();
                                        delete_xhr.open("GET", "/removeModify?id=" + nowUserId, true);
                                        delete_xhr.send();

                                        // Timeout 설정 (예: 5초)
                                        delete_xhr.timeout = 5000;

                                        delete_xhr.onload = function () {
                                            if (delete_xhr.status === 200) {
                                                if (delete_xhr.responseText === "true") {
                                                    window.location.href = "/admin?id=" + nowUserId
                                                    document.getElementById("modify_save").disabled = false;
                                                    document.getElementById("modify_save").style.opacity = 1;
                                                    alert("작업 모두 완료.");
                                                }
                                                else {
                                                    window.location.href = "/"
                                                    document.getElementById("modify_save").disabled = false;
                                                    document.getElementById("modify_save").style.opacity = 1;
                                                    alert("서버 오류 발생.\n데이터는 수정되었으나, 다른 운영자님들이 이용할 수 있게 아래 수동 조치 부탁드립니다.\n" +
                                                        "수정 페이지에서 cancel버튼을 다시 눌러주세요!")
                                                }

                                            } else {
                                                window.location.href = "/"
                                                document.getElementById("modify_save").disabled = false;
                                                document.getElementById("modify_save").style.opacity = 1;
                                                alert("서버 오류 발생.\n데이터는 수정 되었으나, 다른 운영자님들이 이용할 수 있게 아래 수동 조치 부탁드립니다.\n" +
                                                    "수정 페이지에서 cancel버튼을 다시 눌러주세요!")
                                            }
                                        };

                                        // 서버에서 일정시간 응답이 없을 때,
                                        delete_xhr.ontimeout = function () {
                                            alert("서버 응답 시간이 느립니다.\n수정 페이지에서 cancel버튼을 눌러주세요!")
                                            window.location.href = "/"
                                            document.getElementById("modify_save").disabled = false;
                                            document.getElementById("modify_save").style.opacity = 1;
                                        };

                                        // 넷웤이 없는데 요청할때 실행
                                        delete_xhr.onerror = function () {
                                            alert("네트워크가 끊겨있습니다.\n수정 페이지에서 cancel버튼을 눌러주세요!")
                                            window.location.href = "/"
                                            document.getElementById("modify_save").disabled = false;
                                            document.getElementById("modify_save").style.opacity = 1;
                                        };
                                    }
                                }
                                else {
                                    document.getElementById("modify_save").disabled = false;
                                    document.getElementById("modify_save").style.opacity = 1;
                                    alert("오타 및 입력된 운영자님의 공정이 올바른지 확인해주세요.")
                                    return; //저장하지 않음
                                }
                            }
                        }
                    }
                }
                else {
                    alert("서버 오류.\n재시도 부탁드립니다.")
                    window.location.href = "/"
                }
            }

            xhr_check.timeout = 10000;

            // 서버에서 일정시간 응답이 없을 때,
            xhr_check.ontimeout = function () {
                alert("서버 처리 지연./n재시도 부탁드립니다.")
                window.location.href = "/"
            };

            // 넷웤이 없는데 요청할때 실행
            xhr_check.onerror = function () {
                alert("인터넷 접속을 확인하세요.\n재시도 부탁드립니다.")
                window.location.href = "/"
            };

        }
        else {
            window.location.href = "/"
            document.getElementById("modify_save").disabled = false;
            document.getElementById("modify_save").style.opacity = 1;
            alert("로그인 세션이 만료되었습니다. 다시 로그인 부탁드립니다. ")
        }
    })
}