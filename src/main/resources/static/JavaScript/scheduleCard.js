// 스케줄 정보가 없을 시 빈 배열 results에 전달
function scheduleCard(results, dfe, date) {
    // 테이블을 담을 div
    const Container = document.getElementById("image-container");

    // 테이블 생성
    const schedule_div = document.createElement("div");
    schedule_div.className = "schedule_div";

    // results가 빈 배열인 경우에만 밝은 회색 배경 적용
    if (results.length === 0) {
        schedule_div.style.backgroundColor = "lightgray";
    }

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


    // 테이블을 div에 추가
    schedule_div.appendChild(table)
    Container.appendChild(schedule_div);
}