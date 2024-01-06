function createSchedule() {

    //!!!!!공정별로 구분해서 작성한 이유 : 본인 공정만 등록/수정할 수 있도록 하는 기능을 추후 개발 가능성 고려

    //날짜 값 (동적으로 생성 된 값을 받아와야 함)
    let date = document.getElementById("date").innerText;

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
        dynamicVariablesELEC[`elec${i}`] = document.getElementById(`ELEC${i}`).value;
        dynamicVariablesCELL[`cell${i}`] = document.getElementById(`CELL${i}`).value;
        dynamicVariablesFORM[`form${i}`] = document.getElementById(`FORM${i}`).value;
        dynamicVariablesPACK[`pack${i}`] = document.getElementById(`PACK${i}`).value;
        dynamicVariablesCOLL[`coll${i}`] = document.getElementById(`COLL${i}`).value;
        dynamicVariablesCOMM[`comm${i}`] = document.getElementById(`COMM${i}`).value;

        //DB 조회 값과 이름이 일치하지 않은 경우 알람 및 색깔 변경
        // 오탈자 검증용 셀 값
        let checktypoelec = {"CheckTypo" : dynamicVariablesELEC[`elec${i}`]}; // 서버로 해당 페이로드를 실어 REST POST
        let checktypocell = {"CheckTypo" : dynamicVariablesCELL[`cell${i}`]};
        let checktypoform = {"CheckTypo" : dynamicVariablesFORM[`form${i}`]};
        let checktypopack = {"CheckTypo" : dynamicVariablesPACK[`pack${i}`]};
        let checktypocoll = {"CheckTypo" : dynamicVariablesCOLL[`coll${i}`]};
        let checktypocomm = {"CheckTypo" : dynamicVariablesCOMM[`comm${i}`]};

        // 서버 REST POST 통신 열기
        let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        xhr_check.open('POST', '/checktypo', true); // REST 정의
        xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json

        // 서버로 send
        xhr_check.send(JSON.stringify(checktypoelec)); // inputdata를 문자열로 변환 후 서버로 POST 전송
        xhr_check.send(JSON.stringify(checktypocell));
        xhr_check.send(JSON.stringify(checktypoform));
        xhr_check.send(JSON.stringify(checktypopack));
        xhr_check.send(JSON.stringify(checktypocoll));
        xhr_check.send(JSON.stringify(checktypocomm));
    }
    //WMS FORM 값
    for (let i = 1; i < 10; i++) {
        dynamicVariablesWMS[`wms${i}`] = document.getElementById(`WMS${i}`).value;

        //DB 조회 값과 이름이 일치하지 않은 경우 알람 및 색깔 변경
        // 오탈자 검증용 셀 값
        let checktypowms = {"CheckTypo" : dynamicVariablesWMS[`WMS${i}`]}; // 서버로 해당 페이로드를 실어 REST POST

        // 서버 REST POST 통신 열기
        let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        xhr_check.open('POST', '/checktypo', true); // REST 정의
        xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json

        // 서버로 send
        xhr_check.send(JSON.stringify(checktypowms)); // inputdata를 문자열로 변환 후 서버로 POST 전송
    }

    // //form에서 값 받아오는지 콘솔확인
    // for(let i =1;i<7;i++) {
    //     let inputdatas = {
    //         "name": dynamicVariables[`elec${i}`],
    //         "date": date,
    //         "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
    //         "priority": i < 4 ? '1' : '2',
    //     }
    //     console.log(inputdatas);
    // }

    //모두 빈칸일 경우 알람
    for(let i=0;i<6;i++) {
        if ( dynamicVariablesELEC[`elec${i}`]  === '') {
            alert("값을 입력 해주세요!");
            return;
        }
    }



    //DB 저장
    //admin_shift 테이블 칼럼 순서대로인 name,date,shift,priority 로 페이로드 생성 및 전송
    for(let i =1;i<7;i++) {
        // 페이로드 생성
        let inputdataelec = {
            "name": dynamicVariablesELEC[`elec${i}`] ,
            "date": date,
            "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
            "priority": i<4 ? '1' : '2',
        }
        let inputdatacell = {
            "name": dynamicVariablesELEC[`cell${i}`] ,
            "date": date,
            "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
            "priority": i<4 ? '1' : '2',
        }
        let inputdataform = {
            "name": dynamicVariablesELEC[`cell${i}`] ,
            "date": date,
            "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
            "priority": i<4 ? '1' : '2',
        }
        let inputdatapack = {
            "name": dynamicVariablesELEC[`cell${i}`] ,
            "date": date,
            "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
            "priority": i<4 ? '1' : '2',
        }
        let inputdatawms = {
            "name": dynamicVariablesELEC[`cell${i}`] ,
            "date": date,
            "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
            "priority": i<4 ? '1' : '2',
        }
        let inputdatacoll = {
            "name": dynamicVariablesELEC[`cell${i}`] ,
            "date": date,
            "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
            "priority": i<4 ? '1' : '2',
        }
        let inputdatacomm = {
            "name": dynamicVariablesELEC[`cell${i}`] ,
            "date": date,
            "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
            "priority": i<4 ? '1' : '2',
        }

        // 서버로 REST POST
        let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        xhr_check.open('POST', '/saveSchedule', true); // REST 정의
        xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json

        // 문자열로 변환 후 서버 전송
        xhr_check.send(JSON.stringify(inputdataelec))
        xhr_check.send(JSON.stringify(inputdatacell))
        xhr_check.send(JSON.stringify(inputdataform))
        xhr_check.send(JSON.stringify(inputdatapack))
        xhr_check.send(JSON.stringify(inputdatawms))
        xhr_check.send(JSON.stringify(inputdatacoll))
        xhr_check.send(JSON.stringify(inputdatacomm))

    }

}