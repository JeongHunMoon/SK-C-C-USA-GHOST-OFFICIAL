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
    else if (rocMembers.includes(CELLinf) && beforeCards[idInf] !== "" && beforeCards[idInf] !== CELLinf) {
        updateInfo.push({
            "name": CELLinf,
            "date": formdate,
            "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
            "priority": i < 4 ? '1' : '2',
        });
    }

    // 추가 "" > "A"
    else if (rocMembers.includes(CELLinf) && beforeCards[idInf] === "") {
        insertInfo.push({
            "name": CELLinf,
            "date": formdate,
            "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
            "priority": i < 4 ? '1' : '2',
        });
    }

    else if (!rocMembers.includes(CELLinf)) {
        flag = false;
        document.getElementById(`${formdate}CELL${i}`).style.color = "red";
    }
    else {
        flag = false;
        document.getElementById(`${formdate}CELL${i}`).style.color = "red";
    }

}