// 스케줄 정보가 없을 시 빈 배열 results에 전달
function scheduleCard(results, dfe, date) {
    console.log(results)
    // 테이블을 담을 div
    const Container = document.getElementById("image-container");

    // 테이블 생성
    const schedule_div = document.createElement("div");
    schedule_div.className = "schedule_div";
    schedule_div.setAttribute("id", date+"schedule_div"); // 카드의 id 설정
    schedule_div.style.border= "1px solid lightgray"

    // results가 빈 배열인 경우에만 밝은 회색 배경 적용
    if (results.length === 0) {
        schedule_div.style.backgroundColor = "lightgray";
    }

    let table = document.createElement("table");
    table.className = "schedule_card"; // class 설정
    table.setAttribute("border", "1");
    table.style.borderCollapse = "collapse";
    table.style.borderColor = "lightgray"; // 빨간색 테이블 선

    // 상단 해더 고정
    const headerRow = table.insertRow();
    //headerRow.style.borderTop = "1px solid transparent"

    const partHeader = headerRow.insertCell();
    partHeader.textContent = "Part";
    partHeader.rowSpan = 2;
    headerRow.style.borderLeft = "1px solid transparent"

    const priorityHeader = headerRow.insertCell();
    priorityHeader.textContent = "Priority";
    priorityHeader.rowSpan = 2;

    const mondayHeader = headerRow.insertCell();
    mondayHeader.textContent = dfe

    const dateHeader = headerRow.insertCell();
    dateHeader.colSpan = 2;
    dateHeader.textContent = date;
    dateHeader.style.borderRight = "1px solid transparent"


    // 날짜 행 추가
    const dateRow = table.insertRow();
    const nHeader = dateRow.insertCell();
    nHeader.textContent = "N";

    const dHeader = dateRow.insertCell();
    dHeader.textContent = "D";

    const eHeader = dateRow.insertCell();
    eHeader.textContent = "E";
    eHeader.style.borderRight = "1px solid transparent"


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
    elec.style.borderLeft = "1px solid transparent"

    const elec_1 = elecRow.insertCell();
    elec_1.textContent = "1";

    const elec_1_N = elecRow.insertCell();
    elec_1_N.textContent = elec_info1.find(item => item.shift === "N")?.name || "";

    const elec_1_D = elecRow.insertCell();
    elec_1_D.textContent = elec_info1.find(item => item.shift === "D")?.name || "";

    const elec_1_E = elecRow.insertCell();
    elec_1_E.textContent = elec_info1.find(item => item.shift === "E")?.name || "";
    elec_1_E.style.borderRight = "1px solid transparent"

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
    elec_2_E.style.borderRight = "1px solid transparent"



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
    cell.style.borderLeft = "1px solid transparent"

    const cell_1 = cellRow.insertCell();
    cell_1.textContent = "1";

    const cell_1_N = cellRow.insertCell();
    cell_1_N.textContent = cell_info1.find(item => item.shift === "N")?.name || "";

    const cell_1_D = cellRow.insertCell();
    cell_1_D.textContent = cell_info1.find(item => item.shift === "D")?.name || "";

    const cell_1_E = cellRow.insertCell();
    cell_1_E.textContent = cell_info1.find(item => item.shift === "E")?.name || "";
    cell_1_E.style.borderRight = "1px solid transparent"


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
    cell_2_E.style.borderRight = "1px solid transparent"



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
    form.style.borderLeft = "1px solid transparent"

    const form_1 = formRow.insertCell();
    form_1.textContent = "1";

    const form_1_N = formRow.insertCell();
    form_1_N.textContent = form_info1.find(item => item.shift === "N")?.name || "";

    const form_1_D = formRow.insertCell();
    form_1_D.textContent = form_info1.find(item => item.shift === "D")?.name || "";

    const form_1_E = formRow.insertCell();
    form_1_E.textContent = form_info1.find(item => item.shift === "E")?.name || "";
    form_1_E.style.borderRight = "1px solid transparent"

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
    form_2_E.style.borderRight = "1px solid transparent"



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
    pack.style.borderLeft = "1px solid transparent"

    const pack_1 = packRow.insertCell();
    pack_1.textContent = "1";

    const pack_1_N = packRow.insertCell();
    pack_1_N.textContent = pack_info1.find(item => item.shift === "N")?.name || "";

    const pack_1_D = packRow.insertCell();
    pack_1_D.textContent = pack_info1.find(item => item.shift === "D")?.name || "";

    const pack_1_E = packRow.insertCell();
    pack_1_E.textContent = pack_info1.find(item => item.shift === "E")?.name || "";
    pack_1_E.style.borderRight = "1px solid transparent"

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
    pack_2_E.style.borderRight = "1px solid transparent"



    //wms 정보 가공
    let wms_info1 = []
    let wms_info2 = []
    let wms_info3 = []

    results.forEach(item => {
        if (item.process === "WMS") {
            if (item.priority === "1") {
                wms_info1.push(item);
            } else if (item.priority === "2") {
                wms_info2.push(item);
            } else if(item.priority === "3") {
                wms_info3.push(item);
            }
        }
    });


    //// wms ////
    const wmsRow = table.insertRow();
    const wms = wmsRow.insertCell();
    wms.textContent = "WMS";
    wms.rowSpan = 3;
    wms.style.borderLeft = "1px solid transparent"

    const wms_1 = wmsRow.insertCell();
    wms_1.textContent = "1";

    const wms_1_N = wmsRow.insertCell();
    wms_1_N.textContent = wms_info1.find(item => item.shift === "N")?.name || "";

    const wms_1_D = wmsRow.insertCell();
    wms_1_D.textContent = wms_info1.find(item => item.shift === "D")?.name || "";

    const wms_1_E = wmsRow.insertCell();
    wms_1_E.textContent = wms_info1.find(item => item.shift === "E")?.name || "";
    wms_1_E.style.borderRight = "1px solid transparent"

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
    wms_2_E.style.borderRight = "1px solid transparent"

    // wms 3차
    const wmsRow3 = table.insertRow();
    const wms_3 = wmsRow3.insertCell();
    wms_3.textContent = "3";

    const wms_3_N = wmsRow3.insertCell();
    wms_3_N.textContent = wms_info3.find(item => item.shift === "N")?.name || "";

    const wms_3_D = wmsRow3.insertCell();
    wms_3_D.textContent = wms_info3.find(item => item.shift === "D")?.name || "";

    const wms_3_E = wmsRow3.insertCell();
    wms_3_E.textContent = wms_info3.find(item => item.shift === "E")?.name || "";
    wms_3_E.style.borderRight = "1px solid transparent"



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
    coll.style.borderLeft = "1px solid transparent"

    const coll_1 = collRow.insertCell();
    coll_1.textContent = "1";

    const coll_1_N = collRow.insertCell();
    coll_1_N.textContent = coll_info1.find(item => item.shift === "N")?.name || "";

    const coll_1_D = collRow.insertCell();
    coll_1_D.textContent = coll_info1.find(item => item.shift === "D")?.name || "";

    const coll_1_E = collRow.insertCell();
    coll_1_E.textContent = coll_info1.find(item => item.shift === "E")?.name || "";
    coll_1_E.style.borderRight = "1px solid transparent"

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
    coll_2_E.style.borderRight = "1px solid transparent"


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
    comm.style.borderLeft= "1px solid transparent"
    comm.style.borderBottom = "1px solid transparent"



    const comm_1 = commRow.insertCell();
    comm_1.textContent = "1";

    const comm_1_N = commRow.insertCell();
    comm_1_N.textContent = comm_info1.find(item => item.shift === "N")?.name || "";

    const comm_1_D = commRow.insertCell();
    comm_1_D.textContent = comm_info1.find(item => item.shift === "D")?.name || "";

    const comm_1_E = commRow.insertCell();
    comm_1_E.textContent = comm_info1.find(item => item.shift === "E")?.name || "";
    comm_1_E.style.borderRight = "1px solid transparent"

    // comm 2차
    const commRow2 = table.insertRow();
    const comm_2 = commRow2.insertCell();
    comm_2.textContent = "2";
    commRow2.style.borderBottom = "1px solid transparent"

    const comm_2_N = commRow2.insertCell();
    comm_2_N.textContent = comm_info2.find(item => item.shift === "N")?.name || "";

    const comm_2_D = commRow2.insertCell();
    comm_2_D.textContent = comm_info2.find(item => item.shift === "D")?.name || "";

    const comm_2_E = commRow2.insertCell();
    comm_2_E.textContent = comm_info2.find(item => item.shift === "E")?.name || "";
    comm_2_E.style.borderRight= "1px solid transparent"



    const creatorSpan = document.createElement('p');
    creatorSpan.style.color = 'gray';

    const modificatorSpan = document.createElement('p');
    modificatorSpan.style.color = 'gray';

    // 그냥 빈 카드
    if (results.length === 0) {
        creatorSpan.textContent = "Created by : - ";
        modificatorSpan.textContent = "Modified by : - ";
    }
    // 값이 하나라도 들어 있는 카드
    else {
        creatorSpan.textContent = "Created by : " +  results[0]["creator"];
        modificatorSpan.textContent = "Modified by : " + results[0]["modificator"];
    }

    // 테이블을 div에 추가
    const topDiv = document.createElement('div');
    topDiv.className = "schedule_top_div"
    topDiv.appendChild(creatorSpan)
    topDiv.appendChild(modificatorSpan)

    schedule_div.appendChild(topDiv)
    schedule_div.appendChild(table)

    Container.appendChild(schedule_div);
}