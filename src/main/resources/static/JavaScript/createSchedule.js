//공정별로 구분해서 작성한 이유 : 본인 공정만 등록/수정할 수 있도록 하는 기능을 추후 개발 가능성 고려
async function createSchedule() {
    let confirmedSchedule = [];
    let flag = true;
    //오타검증 : ROC 멤버를 배열로 미리 저장
    let rocMembers = [];
    let typoPostSample = {"CheckTypo": 'typoPostSample'};
    let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
    xhr_check.open('POST', '/checktypo', true); // REST 정의
    xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
    xhr_check.send(JSON.stringify(typoPostSample));
    //xhr_check.send 받은 후 동작 - 비동기
    await new Promise((resolve) => {
        xhr_check.onreadystatechange = function () {
            if (xhr_check.readyState === 4 && xhr_check.status === 200) {
                rocMembers = JSON.parse(xhr_check.responseText);
                // console.log("ROC MEMBERS : " + rocMembers); // 전체인원
                let form = document.querySelectorAll("#createForm");

                //DB에서 이름을 불러오지 못했을 때
                if (!rocMembers) {
                    alert("현재 DB 접근에 문제가 있습니다. 관리자에게 문의해주세요")
                    window.location.href = '/index';
                } else {
                    // 전체 카드 반복(1~7)
                    for (let i = 0; i < form.length; i++) {
                        let formdate = form[i].querySelector("#dateInfo").textContent;

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
                            let elecinf = elecInfo[i - 1];
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
                            let cellinf = cellInfo[i - 1];
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
                            let forminf = formInfo[i - 1];
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
                            let packinf = packInfo[i - 1];
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
                            let wmsinf = wmsInfo[i - 1];
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
                            let collinf = collInfo[i - 1];
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
                            let comminf = commInfo[i - 1];
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
                        // 모든 카드 OK
                        if (flag === false) {
                            alert("오탈자를 확인해주세요")
                            return 1; //저장하지 않음)
                        } else {
                        }
                    }
                }
                resolve();
            }
        }
    });
    console.log(JSON.stringify(confirmedSchedule, null, 2));
    let xhr_check_saveDB = new XMLHttpRequest(); // REST API 통신을 위한 객체
    xhr_check_saveDB.open('POST', '/saveSchedule', true);
    xhr_check_saveDB.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json

    xhr_check_saveDB.send(JSON.stringify(confirmedSchedule));

    xhr_check_saveDB.onreadystatechange = function() {
        console.log("open")
        if (xhr_check_saveDB.readyState === 4) {
            if (xhr_check_saveDB.status === 200) { //반환값을 받을 필요 없으므로 서버로의 요청 성공 여부(상태 200)만 체크
                try {
                    alert("저장되었습니다");
                    window.location.href = '/';
                } catch (e) {
                    alert("저장이 불가능합니다. 관리자에게 문의해주세요.");
                    window.location.href = '/';
                }
            } else {
                alert("서버연결이 불안정합니다. 상태코드: "+xhr_check_saveDB.status);
                window.location.href = '/';
            }
            console.log("close")
        }
    };
    // xhr_check_saveDB.send(JSON.stringify(confirmedSchedule));
    // if (xhr_check_saveDB.status === 200) { //반환값을 받을 필요 없으므로 서버로의 요청 성공 여부(상태 200)만 체크
    //     try{
    //         alert("저장되었습니다");
    //         window.location.href = '/index';
    //     }catch (e) {
    //         alert("저장이 불가능합니다. 관리자에게 문의해주세요.");
    //     }
    // } else {
    //     alert("서버연결이 불안정합니다. 관리자에게 문의해주세요.");
    // }
}