//공정별로 구분해서 작성한 이유 : 본인 공정만 등록/수정할 수 있도록 하는 기능을 추후 개발 가능성 고려
function createSchedule() {
    Kakao.Auth.getStatusInfo(function(statusObj) {
        let nowUserId = null;
        let nowUserNiname = null;

        // 만약 사용자가 로그인이 되어 있는 경우
        if (statusObj.status === 'connected') {
            nowUserId = statusObj.user.kakao_account.email;
            nowUserNiname = statusObj.user.kakao_account.profile.nickname

            let confirmedSchedule = [];
            let flag = true;
            let rocMembers = null; //오타검증 : ROC 멤버를 배열로 미리 저장
            let typoPostSample = {"CheckTypo": 'typoPostSample'};
            let form = null;

            // ROC 맴버의 모든 이름을 가져온다.
            let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
            xhr_check.open('POST', '/checktypo', true); // REST 정의
            xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
            xhr_check.send(JSON.stringify(typoPostSample));

            xhr_check.onload = function () {
                rocMembers = JSON.parse(xhr_check.responseText);
                console.log("ROC MEMBERS : " + rocMembers); // 전체인원
                form = document.querySelectorAll("#createForm");

                //DB에서 이름을 불러오지 못했을 때
                if (rocMembers.length === 0) {
                    window.location.href = '/remove';
                    alert("현재 DB ROC 맴버가 없습니다.. 관리자에게 문의해주세요??")
                }
                else {
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
                            let elecinf = elecInfo[i - 1].trim();
                            //앞뒤로 트립 제거
                            if (elecinf === "") {
                            } else if (rocMembers.includes(elecinf)) {
                                console.log(elecinf)
                                document.getElementById(`${formdate}ELEC${i}`).style.color = "black";
                                //confirmedSchedule 정보 넣기
                                confirmedSchedule.push({
                                    "name": elecinf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            } else {
                                // 해당 줄 빨간줄 표시
                                flag = false;
                                document.getElementById(`${formdate}ELEC${i}`).style.color = "red";
                            }
                        }
                        for (let i = 1; i < 7; i++) {
                            let cellinf = cellInfo[i - 1].trim();
                            if (cellinf === "") {
                            } else if (rocMembers.includes(cellinf)) {
                                //confirmedSchedule 정보 넣기
                                document.getElementById(`${formdate}CELL${i}`).style.color = "black";
                                confirmedSchedule.push({
                                    "name": cellinf,
                                    "date": formdate,
                                    "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                                    "priority": i < 4 ? '1' : '2',
                                });
                            } else {
                                // 해당 줄 빨간줄 표시
                                flag = false;
                                document.getElementById(`${formdate}CELL${i}`).style.color = "red";
                            }
                        }
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

                        if (j === form.length - 1) {
                            // 오타가 없는 경우
                            if (flag) {
                                console.log(JSON.stringify(confirmedSchedule));
                                let xhr_check_saveDB = new XMLHttpRequest(); // REST API 통신을 위한 객체
                                xhr_check_saveDB.open('POST', '/saveSchedule', true);
                                xhr_check_saveDB.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json

                                xhr_check_saveDB.send(JSON.stringify(confirmedSchedule));

                                xhr_check_saveDB.onload = function() {
                                    if (xhr_check_saveDB.responseText === "Save Success") {
                                        window.location.href = "/remove";
                                        alert("정상적으로 등록되었습니다.")
                                    }
                                    else {
                                        // 디비에 넣는 서비스가 예외가 일었났으므로 세션 날릴 필요 없음.
                                        window.location.href = "admin?id=" + nowUserId;
                                        alert("저장이 불가능합니다. 다시 시도 부탁드립니다.");
                                    }
                                };
                            }
                            else {
                                alert("오탈자를 확인해주세요")
                                return; //저장하지 않음
                            }
                        }
                    }
                }
            }
        }

        else {
            // 세션 저장할 필요 없음 > 재로그이 시킨 후 다시 접속 시 세션을 불러와야함.
            window.location.href = "/"
            alert("로그인 세션이 만료되었습니다. 재 로그인 부탁드립니다.")
        }
    })
}
