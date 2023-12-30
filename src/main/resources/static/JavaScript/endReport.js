function endReport() {
    // Crate a wrapper for the input fields
    let inputWrapper = document.createElement('div');
    inputWrapper.id = 'inputWrapper';
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

    // Append the input fields to the body
    document.body.appendChild(inputWrapper);
}

function submitValues() {
    // Get the input values
    let values = [];
    for (let i = 1; i <= 8; i++) {
        let inputValue = document.getElementById('value' + i).value.trim();
        values.push(inputValue);
    }

    // Check if values are valid numbers
    for (let i = 0; i < values.length; i++) {
        if (!isValidNumber(values[i])) {
            alert('Please enter valid numeric values.');
            return; // Stop execution if values are not valid
        }
    }
    document.body.removeChild(document.getElementById('inputWrapper'));

    // Log the values to the console
    console.log('Values:', values);

    for (let i = 0; i < values.length; i++) {
        if (values[i] === "") {
            values[i] = 0
        }
    }

    let endReportText = "SOP: New " + values[0] + ", Done " + values[2] + ", Open " + values[4] + ", Transferred " + values[6]
        + "\nITS: New " + values[1] + ", Done " + values[3] + ", Waiting " + values[5] + ", Transferred " + values[7]
    console.log(endReportText)

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

function cancelInput() {
    // Clear input fields
    for (let i = 1; i <= 8; i++) {
        document.getElementById('value' + i).value = '';
    }

    // Remove the input fields and wrapper from the body
    document.body.removeChild(document.getElementById('inputWrapper'));
}

function isValidNumber(value) {
    // Check if the value is a valid number
    return !isNaN(value) || value === '';
}
