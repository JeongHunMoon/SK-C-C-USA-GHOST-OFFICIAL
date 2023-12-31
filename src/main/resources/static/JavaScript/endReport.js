function endReport() {
    // 동적으로 DOM 트리에 퇴근 보고를 위한 HTML 태그르 생성 한다.
    let inputWrapper = document.createElement('div');
    inputWrapper.id = 'inputWrapper'; // 위 태그에 id를 부여한다.
    inputWrapper.innerHTML = `
        <div class="inputRow">
            <div class="inputColumn">
                <label class="inputLabel" for="value1">SOP: New</label>
                <input type="text" class="inputField" id="value1">
            </div>
            <div class="inputColumn">
                <label class="inputLabel" for="value2">ITS: New</label>
                <input type="text" class="inputField" id="value2">
            </div>
        </div>
        <div class="inputRow">
            <div class="inputColumn">
                <label class="inputLabel" for="value3">Done</label>
                <input type="text" class="inputField" id="value3">
            </div>
            <div class="inputColumn">
                <label class="inputLabel" for="value4">Done</label>
                <input type="text" class="inputField" id="value4">
            </div>
        </div>
        <div class="inputRow">
            <div class="inputColumn">
                <label class="inputLabel" for="value5">Open</label>
                <input type="text" class="inputField" id="value5">
            </div>
            <div class="inputColumn">
                <label class="inputLabel" for="value6">Waiting</label>
                <input type="text" class="inputField" id="value6">
            </div>
        </div>

        <div class="inputRow">
            <div class="inputColumn">
                <label class="inputLabel" for="value7">Transferred</label>
                <input type="text" class="inputField" id="value7">
            </div>
            <div class="inputColumn">
                <label class="inputLabel" for="value8">Transferred</label>
                <input type="text" class="inputField" id="value8">
            </div>
        </div>

        <button id="submitButton" onclick="submitValues()">Submit</button>
        <button id="cancelButton" onclick="cancelInput()">Cancel</button>
    `;

    // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
    document.body.appendChild(inputWrapper);
}

function submitValues() {
    // 사용자가 퇴근 보고를 위해 입력한 값을 코드로 받아온다.
    let values = [];
    for (let i = 1; i <= 8; i++) {
        let inputValue = document.getElementById('value' + i).value.trim();
        values.push(inputValue);
    }

    // 퇴근 보고에 입력되는 숫자가 숫자만 들어왔는지 체크한다.
    for (let i = 0; i < values.length; i++) {
        if (!isValidNumber(values[i])) {
            alert('Please enter valid numeric values.');
            return; // Stop execution if values are not valid
        }
    }

    // 사용자가 입력한 값을 가져온 후, DOM에서 퇴근 보고 태그를 삭제한다.
    document.body.removeChild(document.getElementById('inputWrapper'));

    // Log the values to the console
    console.log('Values:', values);

    // 사용자가 입력하지 란에 대해서는 0으로 기입한다.
    for (let i = 0; i < values.length; i++) {
        if (values[i] === "") {
            values[i] = 0
        }
    }

    // 퇴근 보고 템플릿
    let endReportText = "SOP: New " + values[0] + ", Done " + values[2] + ", Open " + values[4] + ", Transferred " + values[6]
        + "\nITS: New " + values[1] + ", Done " + values[3] + ", Waiting " + values[5] + ", Transferred " + values[7]
    console.log(endReportText)

    // 해당 퇴근 보고는 나에게 전송된다.
    Kakao.API.request({
        url: '/v2/api/talk/memo/default/send',
        data: {
            template_object: {
                object_type: 'text',
                text: endReportText,
                link: {
                    // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
                    mobile_web_url: 'http://3.145.154.90:8080', // //https://developers.kakao.com
                    web_url: 'http://3.145.154.90:8080'
                },
            },
        },
    })
        .then(function (res) {
            alert("Success. Goodbye.");
            window.location.href = '/'; // 메인으로 redirect
        })
        .catch(function (err) {
            alert('error: ' + JSON.stringify(err));
            window.location.href = '/'; // 메인으로 redirect
        });
}

// 시용자가 퇴근 보고 취소를 누르는 경우
function cancelInput() {
    // Clear input fields
    for (let i = 1; i <= 8; i++) {
        document.getElementById('value' + i).value = '';
    }

    // Remove the input fields and wrapper from the body
    document.body.removeChild(document.getElementById('inputWrapper'));
}

// 입력된 값이 공백이거나 숫자이면 true를 반화한다. 그 이외 값은 잘못된 입력으로 간주한다.  
function isValidNumber(value) {
    // Check if the value is a valid number
    return !isNaN(value) || value === '';
}
