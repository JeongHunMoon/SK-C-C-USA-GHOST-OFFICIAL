// 화성
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
        });
    }

    // 변경(업데이트) "A" > "B"
    else if (rocMembers.hasOwnProperty(comminf) && rocMembers[comminf] === "COMM" && beforeCards[idInf] !== "" && beforeCards[idInf] !== comminf) {
        updateInfo.push({
            "name": comminf,
            "date": formdate,
            "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
            "priority": i < 4 ? '1' : '2',
        });
    }

    // 추가 "" > "A"
    else if (rocMembers.hasOwnProperty(comminf) && rocMembers[comminf] === "COMM" && beforeCards[idInf] === "") {
        insertInfo.push({
            "name": comminf,
            "date": formdate,
            "shift": i % 3 === 1 ? 'N' : i % 3 === 2 ? 'D' : 'E',
            "priority": i < 4 ? '1' : '2',
        });
    }

    else {
        flag = false;
        document.getElementById(`${formdate}COMM${i}`).style.color = "red";
    }
}