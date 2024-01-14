function deleteScheduleCard(results, dfe, date) {

    // 테이블을 담을 div
    const Container = document.getElementById("image-container");

    // 테이블 생성
    const schedule_div = document.createElement("div");
    schedule_div.className = "schedule_div";

    let table = document.createElement("table");
    table.className = "schedule_card"; // class 설정
    table.setAttribute("border", "1");
    table.style.borderCollapse = "collapse";

    // 상단 해더 고정
    const headerRow = table.insertRow();

    const partHeader = headerRow.insertCell();
    partHeader.textContent = "Part";
    partHeader.rowSpan = 2;

    const priorityHeader = headerRow.insertCell();
    priorityHeader.textContent = "Priority";
    priorityHeader.rowSpan = 2;

    const mondayHeader = headerRow.insertCell();
    mondayHeader.textContent = dfe

    const dateHeader = headerRow.insertCell();
    dateHeader.colSpan = 2;
    dateHeader.textContent = date;


    // 날짜 행 추가
    const dateRow = table.insertRow();
    const nHeader = dateRow.insertCell();
    nHeader.textContent = "N";

    const dHeader = dateRow.insertCell();
    dHeader.textContent = "D";

    const eHeader = dateRow.insertCell();
    eHeader.textContent = "E";


    //전극 정보 가공
    let elec_info1 = []
    let elec_info2 = []

    results.forEach(item => {
        if (item.process === "ELEC") {
            if (item.priority === "1") {
                elec_info1.push(item);
            } else if (item.priority === "2") {
                elec_info2.push(item);
            }
        }
    });


    //// 전극 ////
    const elecRow = table.insertRow();
    const elec = elecRow.insertCell();
    elec.textContent = "ELEC";
    elec.rowSpan = 2;

    const elec_1 = elecRow.insertCell();
    elec_1.textContent = "1";

    const elec_1_N = elecRow.insertCell();
    elec_1_N.textContent = elec_info1.find(item => item.shift === "N")?.name || "";

    const elec_1_D = elecRow.insertCell();
    elec_1_D.textContent = elec_info1.find(item => item.shift === "D")?.name || "";

    const elec_1_E = elecRow.insertCell();
    elec_1_E.textContent = elec_info1.find(item => item.shift === "E")?.name || "";

    // 전극 2차
    const elecRow2 = table.insertRow();
    const elec_2 = elecRow2.insertCell();
    elec_2.textContent = "2";

    const elec_2_N = elecRow2.insertCell();
    elec_2_N.textContent = elec_info2.find(item => item.shift === "N")?.name || "";

    const elec_2_D = elecRow2.insertCell();
    elec_2_D.textContent = elec_info2.find(item => item.shift === "D")?.name || "";

    const elec_2_E = elecRow2.insertCell();
    elec_2_E.textContent = elec_info2.find(item => item.shift === "E")?.name || "";



    //조립 정보 가공
    let cell_info1 = []
    let cell_info2 = []

    results.forEach(item => {
        if (item.process === "CELL") {
            if (item.priority === "1") {
                cell_info1.push(item);
            } else if (item.priority === "2") {
                cell_info2.push(item);
            }
        }
    });

    //// 조립 ////
    const cellRow = table.insertRow();
    const cell = cellRow.insertCell();
    cell.textContent = "CELL";
    cell.rowSpan = 2;

    const cell_1 = cellRow.insertCell();
    cell_1.textContent = "1";

    const cell_1_N = cellRow.insertCell();
    cell_1_N.textContent = cell_info1.find(item => item.shift === "N")?.name || "";

    const cell_1_D = cellRow.insertCell();
    cell_1_D.textContent = cell_info1.find(item => item.shift === "D")?.name || "";

    const cell_1_E = cellRow.insertCell();
    cell_1_E.textContent = cell_info1.find(item => item.shift === "E")?.name || "";

    // 조립 2차
    const cellRow2 = table.insertRow();
    const cell_2 = cellRow2.insertCell();
    cell_2.textContent = "2";

    const cell_2_N = cellRow2.insertCell();
    cell_2_N.textContent = cell_info2.find(item => item.shift === "N")?.name || "";

    const cell_2_D = cellRow2.insertCell();
    cell_2_D.textContent = cell_info2.find(item => item.shift === "D")?.name || "";

    const cell_2_E = cellRow2.insertCell();
    cell_2_E.textContent = cell_info2.find(item => item.shift === "E")?.name || "";




    //화성 정보 가공
    let form_info1 = []
    let form_info2 = []

    results.forEach(item => {
        if (item.process === "FORM") {
            if (item.priority === "1") {
                form_info1.push(item);
            } else if (item.priority === "2") {
                form_info2.push(item);
            }
        }
    });


    //// 화성 ////
    const formRow = table.insertRow();
    const form = formRow.insertCell();
    form.textContent = "FORM";
    form.rowSpan = 2;

    const form_1 = formRow.insertCell();
    form_1.textContent = "1";

    const form_1_N = formRow.insertCell();
    form_1_N.textContent = form_info1.find(item => item.shift === "N")?.name || "";

    const form_1_D = formRow.insertCell();
    form_1_D.textContent = form_info1.find(item => item.shift === "D")?.name || "";

    const form_1_E = formRow.insertCell();
    form_1_E.textContent = form_info1.find(item => item.shift === "E")?.name || "";

    // 화성 2차
    const formRow2 = table.insertRow();
    const form_2 = formRow2.insertCell();
    form_2.textContent = "2";

    const form_2_N = formRow2.insertCell();
    form_2_N.textContent = form_info2.find(item => item.shift === "N")?.name || "";

    const form_2_D = formRow2.insertCell();
    form_2_D.textContent = form_info2.find(item => item.shift === "D")?.name || "";

    const form_2_E = formRow2.insertCell();
    form_2_E.textContent = form_info2.find(item => item.shift === "E")?.name || "";



    //모듈 정보 가공
    let pack_info1 = []
    let pack_info2 = []

    results.forEach(item => {
        if (item.process === "PACK") {
            if (item.priority === "1") {
                pack_info1.push(item);
            } else if (item.priority === "2") {
                pack_info2.push(item);
            }
        }
    });


    //// 모듈 ////
    const packRow = table.insertRow();
    const pack = packRow.insertCell();
    pack.textContent = "PACK";
    pack.rowSpan = 2;

    const pack_1 = packRow.insertCell();
    pack_1.textContent = "1";

    const pack_1_N = packRow.insertCell();
    pack_1_N.textContent = pack_info1.find(item => item.shift === "N")?.name || "";

    const pack_1_D = packRow.insertCell();
    pack_1_D.textContent = pack_info1.find(item => item.shift === "D")?.name || "";

    const pack_1_E = packRow.insertCell();
    pack_1_E.textContent = pack_info1.find(item => item.shift === "E")?.name || "";

    // 모듈 2차
    const packRow2 = table.insertRow();
    const pack_2 = packRow2.insertCell();
    pack_2.textContent = "2";

    const pack_2_N = packRow2.insertCell();
    pack_2_N.textContent = pack_info2.find(item => item.shift === "N")?.name || "";

    const pack_2_D = packRow2.insertCell();
    pack_2_D.textContent = pack_info2.find(item => item.shift === "D")?.name || "";

    const pack_2_E = packRow2.insertCell();
    pack_2_E.textContent = pack_info2.find(item => item.shift === "E")?.name || "";



    //wms 정보 가공
    let wms_info1 = []
    let wms_info2 = []

    results.forEach(item => {
        if (item.process === "WMS") {
            if (item.priority === "1") {
                wms_info1.push(item);
            } else if (item.priority === "2") {
                wms_info2.push(item);
            }
        }
    });


    //// wms ////
    const wmsRow = table.insertRow();
    const wms = wmsRow.insertCell();
    wms.textContent = "WMS";
    wms.rowSpan = 2;

    const wms_1 = wmsRow.insertCell();
    wms_1.textContent = "1";

    const wms_1_N = wmsRow.insertCell();
    wms_1_N.textContent = wms_info1.find(item => item.shift === "N")?.name || "";

    const wms_1_D = wmsRow.insertCell();
    wms_1_D.textContent = wms_info1.find(item => item.shift === "D")?.name || "";

    const wms_1_E = wmsRow.insertCell();
    wms_1_E.textContent = wms_info1.find(item => item.shift === "E")?.name || "";

    // wms 2차
    const wmsRow2 = table.insertRow();
    const wms_2 = wmsRow2.insertCell();
    wms_2.textContent = "2";

    const wms_2_N = wmsRow2.insertCell();
    wms_2_N.textContent = wms_info2.find(item => item.shift === "N")?.name || "";

    const wms_2_D = wmsRow2.insertCell();
    wms_2_D.textContent = wms_info2.find(item => item.shift === "D")?.name || "";

    const wms_2_E = wmsRow2.insertCell();
    wms_2_E.textContent = wms_info2.find(item => item.shift === "E")?.name || "";



    //coll 정보 가공
    let coll_info1 = []
    let coll_info2 = []

    results.forEach(item => {
        if (item.process === "COLL") {
            if (item.priority === "1") {
                coll_info1.push(item);
            } else if (item.priority === "2") {
                coll_info2.push(item);
            }
        }
    });


    //// coll ////
    const collRow = table.insertRow();
    const coll = collRow.insertCell();
    coll.textContent = "COLL";
    coll.rowSpan = 2;

    const coll_1 = collRow.insertCell();
    coll_1.textContent = "1";

    const coll_1_N = collRow.insertCell();
    coll_1_N.textContent = coll_info1.find(item => item.shift === "N")?.name || "";

    const coll_1_D = collRow.insertCell();
    coll_1_D.textContent = coll_info1.find(item => item.shift === "D")?.name || "";

    const coll_1_E = collRow.insertCell();
    coll_1_E.textContent = coll_info1.find(item => item.shift === "E")?.name || "";

    // coll 2차
    const collRow2 = table.insertRow();
    const coll_2 = collRow2.insertCell();
    coll_2.textContent = "2";

    const coll_2_N = collRow2.insertCell();
    coll_2_N.textContent = coll_info2.find(item => item.shift === "N")?.name || "";

    const coll_2_D = collRow2.insertCell();
    coll_2_D.textContent = coll_info2.find(item => item.shift === "D")?.name || "";

    const coll_2_E = collRow2.insertCell();
    coll_2_E.textContent = coll_info2.find(item => item.shift === "E")?.name || "";


    //comm 정보 가공
    let comm_info1 = []
    let comm_info2 = []

    results.forEach(item => {
        if (item.process === "COMM") {
            if (item.priority === "1") {
                comm_info1.push(item);
            } else if (item.priority === "2") {
                comm_info2.push(item);
            }
        }
    });



    //// comm ////
    const commRow = table.insertRow();
    const comm = commRow.insertCell();
    comm.textContent = "COMM";
    comm.rowSpan = 2;

    const comm_1 = commRow.insertCell();
    comm_1.textContent = "1";

    const comm_1_N = commRow.insertCell();
    comm_1_N.textContent = comm_info1.find(item => item.shift === "N")?.name || "";

    const comm_1_D = commRow.insertCell();
    comm_1_D.textContent = comm_info1.find(item => item.shift === "D")?.name || "";

    const comm_1_E = commRow.insertCell();
    comm_1_E.textContent = comm_info1.find(item => item.shift === "E")?.name || "";

    // comm 2차
    const commRow2 = table.insertRow();
    const comm_2 = commRow2.insertCell();
    comm_2.textContent = "2";

    const comm_2_N = commRow2.insertCell();
    comm_2_N.textContent = comm_info2.find(item => item.shift === "N")?.name || "";

    const comm_2_D = commRow2.insertCell();
    comm_2_D.textContent = comm_info2.find(item => item.shift === "D")?.name || "";

    const comm_2_E = commRow2.insertCell();
    comm_2_E.textContent = comm_info2.find(item => item.shift === "E")?.name || "";


    // 테이블 클릭 했을 때 스타일 변경, 삭제 후보 배열에 넣기
    let tableFlag = 1;
    let tableFirstClick = 0;
    let deleteList= [];

    table.onclick = function(){
        if (tableFirstClick === 0) {
            this.style.backgroundColor = "darkgrey";
            this.style.color = "white";
            tableFirstClick++;
            tableFlag *= -1;
            console.log("First Click ON")
            //테이블 전체 셀을 배열에 넣음
            for (let i = 2; i < table.rows.length; i++) { //ok
                let row = table.rows[i];
                let rowIndex = row.rowIndex;
                // let rowCellIter = row.cells.length % 2 === 0 ? row.cells.length +1: row.cells.length;
                for (let j = 2; j < row.cells.length; j++) {
                    // // let rowCellCount= row.cells.length % 2 === 0 ? row.cells.length +1: row.cells.length;
                    // console.log("rowCellCount"+rowCellCount) //계속 5
                    // // const columnIndex = this.cellIndex;
                    let columnIndex = row.cells.length % 2 === 0 ? row.cells[j].cellIndex - 1: row.cells[j].cellIndex;
                    console.log("columnIndex"+columnIndex) //2,3,4

                    // //행이 홀수인 경우 4번째 열 강제 주입 //0번째 열 셀 병합으로 인해 행의 셀 개수가 동일하지 않음으로 동일하게 처리
                    // if(row.cells.length % 2 !== 0 && j === row.cells.length-1){
                    //     console.log("4번째 강제주입"+rowIndex + ","+ row.cells[j+1].textContent)
                    //     let deleteCandidate = {
                    //         "name": row.cells[j+1].textContent,
                    //         "date": date,
                    //         "shift": columnIndex === 2 ? 'N' : columnIndex === 3 ? 'D' : 'E',
                    //         "priority": rowIndex % 2 === 0 ? '1' : '2',
                    //     }
                    //     deleteList.push(deleteCandidate)
                    // }
                    let deleteCandidate = {
                        "name": row.cells[j].textContent,
                        "date": date,
                        "shift": columnIndex === 2 ? 'N' : columnIndex === 3 ? 'D' : 'E',
                        "priority": rowIndex % 2 === 0 ? '1' : '2',
                    }
                    deleteList.push(deleteCandidate)
                    console.log("Row: " + rowIndex + ", Column: " + columnIndex);
                    // console.log(deleteList)
                }
            }
            console.log(deleteList)
        }
        else if( tableFlag===1 && this.style.backgroundColor === "white"){
            this.style.backgroundColor = "darkgrey";
            this.style.color = "white";
            console.log("Table Click ON")
            tableFlag *= -1;
            //배열에 넣기
            for (let i = 0; i < table.rows.length; i++) {
                const row = table.rows[i];
                const rowIndex = row.rowIndex;
                for (let j = 0; j < row.cells.length; j++) {
                    const cell = row.cells[j];
                    const columnIndex = this.cellIndex;
                    // 이미 배열에 있는지 확인용
                    const deleteCandidate = {
                        "name": this.textContent,
                        "date": date,
                        "shift": columnIndex === 2 ? 'N' : columnIndex === 3 ? 'D' : 'E',
                        "priority": rowIndex % 2 === 0 ? '1' : '2'
                    }
                    deleteList.push(deleteCandidate)
                }
                console.log(deleteList)
            }
        }
        else if( tableFlag!==1 || this.style.backgroundColor !== "darkgrey" ){
            this.style.backgroundColor = "white";
            this.style.color = "black";
            console.log("Table Click OFF")
            tableFlag *= -1;
            //배열에서 제외 (중복된 내용만 제거 필요함)
            // for (let i = 0; i < table.rows.length; i++) {
            //     const row = table.rows[i];
            //     const rowIndex = row.rowIndex;
            //     for (let j = 0; j < row.cells.length; j++) {
            //         const columnIndex = this.cellIndex;
            //         // 이미 배열에 있는지 확인용
            //         const deleteCandidate = {
            //             "name": this.textContent,
            //             "date": date,
            //             "shift": columnIndex === 2 ? 'N' : columnIndex === 3 ? 'D' : 'E',
            //             "priority": rowIndex % 2 === 0 ? '1' : '2'
            //         }
            //         deleteList.push(deleteCandidate)
            //     }
            //     console.log(deleteList)
            // }
        }
    };



    // 테이블을 div에 추가
    schedule_div.appendChild(table)
    Container.appendChild(schedule_div);
}