//공정별로 구분해서 작성한 이유 : 본인 공정만 등록/수정할 수 있도록 하는 기능을 추후 개발 가능성 고려
function createSchedule() {

    // //모두 빈칸일 경우 알람
    // for(let i=0;i<6;i++) {
    //     if ( dynamicVariablesELEC[`elec${i}`]  === '') {
    //         alert("값을 입력 해주세요!");
    //         return;
    //     }
    // }
    let form = document.querySelectorAll("#createForm");
    let formdate = form[0].querySelector("#dateInfo").textContent;

    //변수 가변으로 생성하기위한 객체
    let dynamicVariablesELEC = {};
    let dynamicVariablesCELL = {};
    let dynamicVariablesFORM = {};
    let dynamicVariablesPACK = {};
    let dynamicVariablesWMS = {};
    let dynamicVariablesCOLL = {};
    let dynamicVariablesCOMM = {};

    //전극,조립,화성,모듈,수집,공통 FORM 값
    for (let i = 1; i < 7; i++) {
        dynamicVariablesELEC[`elec${i}`] = document.getElementById(`${formdate}ELEC${i}`).value;
        dynamicVariablesCELL[`cell${i}`] = document.getElementById(`${formdate}CELL${i}`).value;
        dynamicVariablesFORM[`form${i}`] = document.getElementById(`${formdate}FORM${i}`).value;
        dynamicVariablesPACK[`pack${i}`] = document.getElementById(`${formdate}PACK${i}`).value;
        dynamicVariablesWMS[`wms${i}`] = document.getElementById(`${formdate}WMS${i}`).value;
        dynamicVariablesCOLL[`coll${i}`] = document.getElementById(`${formdate}COLL${i}`).value;
        dynamicVariablesCOMM[`comm${i}`] = document.getElementById(`${formdate}COMM${i}`).value;

        //DB 조회 값과 이름이 일치하지 않은 경우 알람 및 색깔 변경
        // 오탈자 검증용 변수
        let checkTypoELEC = {"CheckTypo" : dynamicVariablesELEC[`elec${i}`]};
        let checkTypoCELL = {"CheckTypo" : dynamicVariablesCELL[`cell${i}`]};
        let checkTypoFORM = {"CheckTypo" : dynamicVariablesFORM[`form${i}`]};
        let checkTypoPACK = {"CheckTypo" : dynamicVariablesPACK[`pack${i}`]};
        let checkTypoWMS = {"CheckTypo" : dynamicVariablesWMS[`WMS${i}`]};
        let checkTypoCOLL = {"CheckTypo" : dynamicVariablesCOLL[`coll${i}`]};
        let checkTypoCOMM = {"CheckTypo" : dynamicVariablesCOMM[`comm${i}`]};

        // REST POST
        let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        xhr_check.open('POST', '/checktypo', true); // REST 정의
        xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json

        // 서버 통해 DB validation 후 오타면 색깔 변경 및 저장 하지 않음.
        xhr_check.send(JSON.stringify(checkTypoELEC))
        xhr_check.onload = function () {
            if (xhr_check.status >= 200 && xhr_check.status < 300) {
                // 성공적으로 응답 받았을 때
                let responseData = xhr_check.responseText;
                // console.log("responseData : "+responseData);
                if(responseData === 'False') {
                    console.log("There are some Typo");
                    alert("등록되지 않은 사용자 이름이 있습니다! \n오탈자를 확인하세요.");
                    document.getElementById(`${formdate}ELEC${i}`).style.color = "red";
                }else {
                    // 페이로드 생성
                    let inputdataelec = {
                        "name": dynamicVariablesELEC[`elec${i}`],
                        "date": formdate,
                        "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
                        "priority": i < 4 ? '1' : '2',
                    }
                    console.log(inputdataelec)
                    let xhr_check2 = new XMLHttpRequest(); // REST API 통신을 위한 객체
                    xhr_check2.open('POST', '/saveSchedule', true); // REST 정의
                    xhr_check2.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
                    xhr_check2.send(JSON.stringify(inputdataelec))
                }
            } else {
                    // 응답이 실패한 경우
                    console.error("서버 응답 실패 (xhr_check):", xhr_check.status, xhr_check.statusText);
                }

        }


        // xhr_check.send(JSON.stringify(checkTypoCELL))
        // if(xhr_check.responseText === 'False') {dynamicVariablesCELL[`cell${i}`].style.color="red";}
        // else{
        //     for(let i =1;i<7;i++) {
        //         // 페이로드 생성
        //         let inputdatacell = {
        //             "name": dynamicVariablesELEC[`cell${i}`] ,
        //             "formdate": formdate,
        //             "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
        //             "priority": i<4 ? '1' : '2',
        //         }
        //         let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        //         xhr_check.open('POST', '/saveSchedule', true); // REST 정의
        //         xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
        //         xhr_check.send(JSON.stringify(inputdatacell))
        //     }
        // }
        // xhr_check.send(JSON.stringify(checkTypoFORM))
        // if(xhr_check.responseText === 'False') {dynamicVariablesFORM[`form${i}`].style.color="red";}
        // else{
        //     for(let i =1;i<7;i++) {
        //         let inputdataform = {
        //             "name": dynamicVariablesELEC[`form${i}`] ,
        //             "formdate": formdate,
        //             "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
        //             "priority": i<4 ? '1' : '2',
        //         }
        //         let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        //         xhr_check.open('POST', '/saveSchedule', true); // REST 정의
        //         xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
        //         xhr_check.send(JSON.stringify(inputdataform))
        //     }
        // }
        // xhr_check.send(JSON.stringify(checkTypoPACK))
        // if(xhr_check.responseText === 'False') {dynamicVariablesFORM[`pack${i}`].style.color="red";}
        // else{
        //     for(let i =1;i<7;i++) {
        //         let inputdatapack = {
        //             "name": dynamicVariablesELEC[`pack${i}`] ,
        //             "formdate": formdate,
        //             "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
        //             "priority": i<4 ? '1' : '2',
        //         }
        //         let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        //         xhr_check.open('POST', '/saveSchedule', true); // REST 정의
        //         xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
        //         xhr_check.send(JSON.stringify(inputdatapack))
        //     }
        // }
        // xhr_check.send(JSON.stringify(checkTypoWMS))
        // if(xhr_check.responseText === 'False') {dynamicVariablesFORM[`wms${i}`].style.color="red";}
        // else{
        //     for(let i =1;i<7;i++) {
        //         let inputdatawms = {
        //             "name": dynamicVariablesELEC[`wms${i}`] ,
        //             "formdate": formdate,
        //             "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
        //             "priority": i<4 ? '1' : '2',
        //         }
        //         let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        //         xhr_check.open('POST', '/saveSchedule', true); // REST 정의
        //         xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
        //         xhr_check.send(JSON.stringify(inputdatawms))
        //     }
        // }
        // xhr_check.send(JSON.stringify(checkTypoCOLL))
        // if(xhr_check.responseText === 'False') {dynamicVariablesFORM[`coll${i}`].style.color="red";}
        // else{
        //     for(let i =1;i<7;i++) {
        //         let inputdatacoll = {
        //             "name": dynamicVariablesELEC[`coll${i}`] ,
        //             "formdate": formdate,
        //             "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
        //             "priority": i<4 ? '1' : '2',
        //         }
        //         let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        //         xhr_check.open('POST', '/saveSchedule', true); // REST 정의
        //         xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
        //         xhr_check.send(JSON.stringify(inputdatacoll))
        //     }
        // }
        // xhr_check.send(JSON.stringify(checkTypoCOMM))
        // if(xhr_check.responseText === 'False') {dynamicVariablesFORM[`comm${i}`].style.color="red";}
        // else {
        //     for (let i = 1; i < 7; i++) {
        //         let inputdatacomm = {
        //             "name": dynamicVariablesELEC[`coll${i}`],
        //             "formdate": formdate,
        //             "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
        //             "priority": i < 4 ? '1' : '2',
        //         }
        //         let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        //         xhr_check.open('POST', '/saveSchedule', true); // REST 정의
        //         xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
        //         xhr_check.send(JSON.stringify(inputdatacomm))
        //     }
        // }
    }
}