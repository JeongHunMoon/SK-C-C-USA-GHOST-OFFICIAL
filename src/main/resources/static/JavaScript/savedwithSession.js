//공정별로 구분해서 작성한 이유 : 본인 공정만 등록/수정할 수 있도록 하는 기능을 추후 개발 가능성 고려
function savedwithSession() {
    let form = document.querySelectorAll("#createForm");
    let payload = ""

    // 전체 카드 반복(1~7)
    for (let i = 0; i < form.length; i++) {
        let formdate = form[i].querySelector("#dateInfo").textContent;

        for (let i = 1; i <= 6; i++) {
            let elementId = formdate + "ELEC" + i;
            let elementValue = document.getElementById(elementId).value.trim();
            payload += (elementValue !== "") ? `${formdate}&${elementId}&${elementValue}?` : "";
        }


        for (let i = 1; i <= 6; i++) {
            let elementId = formdate + "CELL" + i;
            let elementValue = document.getElementById(elementId).value.trim();
            payload += (elementValue !== "") ? `${formdate}&${elementId}&${elementValue}?` : "";
        }

        for (let i = 1; i <= 6; i++) {
            let elementId = formdate + "FORM" + i;
            let elementValue = document.getElementById(elementId).value.trim();
            payload += (elementValue !== "") ? `${formdate}&${elementId}&${elementValue}?` : "";
        }

        for (let i = 1; i <= 6; i++) {
            let elementId = formdate + "PACK" + i;
            let elementValue = document.getElementById(elementId).value.trim();
            payload += (elementValue !== "") ? `${formdate}&${elementId}&${elementValue}?` : "";
        }

        for (let i = 1; i <= 6; i++) {
            let elementId = formdate + "WMS" + i;
            let elementValue = document.getElementById(elementId).value.trim();
            payload += (elementValue !== "") ? `${formdate}&${elementId}&${elementValue}?` : "";
        }

        for (let i = 1; i <= 6; i++) {
            let elementId = formdate + "COLL" + i;
            let elementValue = document.getElementById(elementId).value.trim();
            payload += (elementValue !== "") ? `${formdate}&${elementId}&${elementValue}?` : "";
        }

        for (let i = 1; i <= 6; i++) {
            let elementId = formdate + "COMM" + i;
            let elementValue = document.getElementById(elementId).value.trim();
            payload += (elementValue !== "") ? `${formdate}&${elementId}&${elementValue}?` : "";
        }
    }
    if (payload !== "") {
        payload = payload.slice(0, -1);
    }
    console.log(">>>>>>>>>>", payload)
    return payload
}
