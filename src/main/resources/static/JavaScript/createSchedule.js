function createSchedule() {

    let date = document.getElementById("date").innerText;

    //변수 가변으로 생성
    let dynamicVariables = {};

    for (let i = 1; i < 7; i++) {
        dynamicVariables[`elec${i}`] = document.getElementById(`ELEC${i}`).value;
    }

    // //form에서 값 받아오는지 확인
    // for(let i =1;i<7;i++) {
    //     // DB에 저장할 수 있는 형태로 페이로드 생성
    //     let inputdatas = {
    //         "name": dynamicVariables[`elec${i}`],
    //         "date": date,
    //         "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
    //         "priority": i < 4 ? '1' : '2',
    //     }
    //     console.log(inputdatas);
    // }

    //6칸에 대해서 빈칸일경우 예외처리
    for(let i=0;i<6;i++) {
        if ( dynamicVariables[`elec${i}`]  === '') {
            alert("이름을 입력하세요");
            document.getElementById(`ELEC${i}`).focus();
            return;
        }
    }

    for(let i =1;i<7;i++) {
        // DB에 저장할 수 있는 형태로 페이로드 생성
        let inputdata = {
            "name": dynamicVariables[`elec${i}`] ,
            "date": date,
            "shift": i%3===1 ? 'N' : i%3===2 ? 'D' : 'E' ,
            "priority": i<4 ? '1' : '2',
        }

        // 서버로 해당 페이로드를 실어 REST POST (DB로 저장)
        let xhr_check = new XMLHttpRequest(); // REST API 통신을 위한 객체
        xhr_check.open('POST', '/saveSchedule', true); // REST 정의
        xhr_check.setRequestHeader("Content-Type", "application/json"); // 요청 해더 정의 > payload는 Json
        xhr_check.send(JSON.stringify(inputdata)) // inputdata를 문자열로 변환 후 서버로 POST 전송
    }

}