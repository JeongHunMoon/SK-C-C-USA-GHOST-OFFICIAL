
function emailSubmit() {
    // 동적 DOM 트리로써 이메일 입력을 위한 HTML 생성
    let emailBackground = document.createElement('div');
    emailBackground.id = 'emailBackground'; // 위 태그에 id를 부여한다.
    emailBackground.innerHTML = `
        <div id = "emailModalContainer">
            <div class = "emailModalHeader"> 이메일 인증이 필요합니다 </div>
            <div class = "emailModalBody"> 사내 구성원 인증을 위해 이메일 인증이 필요합니다. 이메일 주소를 통해 인증번호를 확인해 주세요</div>
            <div class = "emailModalInputContainer">
                <span class = "emailModalInputTitle"> Email </span>    
                <input type = "text" placeholder = " VDI mail 또는 @skccus.com 입력" id="value" class = "emailModalInputBody"></input>
            </div>
            <input type = "button" value = "Submit" id = "emailModalSubmit"></input>
        </div>
    `;
    // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
    document.body.appendChild(emailBackground);

    document.getElementById('emailModalSubmit').addEventListener('click', function() {
        emailOffBtn()
        emailSubmitBtn(emailBackground);
    });
}

function emailSubmitBtn(emailBackground) {

    // 사용자가 입력한 이메일 문자열 을 받아온다.
    let inputValue = document.getElementById('value').value.trim();
    inputValue = inputValue.trim()

    // 공백 입력시
    if (inputValue === "") {
        loadingOff()
        emailOnBtn()
        alert("Email을 입력해주세요")
    }

    else {
        // 이메일 형식 유효성 검사 (@skccus, @partner.sk.com 만 가능한 정규식 검사)
        const IsValidatedEmail = (inputValue) => {
            const regex = /^[a-zA-Z0-9._%+-]+@(skccus\.com|partner\.sk\.com)$/; // 정규표현식을 RegExp 객체로 생성
            return regex.test(inputValue);
        }
        // 테스트용 이메일 형식 유효성 검사 //wdg0434@naver.com wjdgns8243@naver.com
        const testmail = (inputValue) => {
            const regex2 = /^[a-zA-Z0-9._%+-]+@(naver\.com|gmail\.com)$/; // 정규표현식을 RegExp 객체로 생성
            return regex2.test(inputValue);
        }

        if (testmail(inputValue)  === true) { //정규식 테스트
            console.log("inputemail : " + inputValue)
            console.log("이메일형식에 맞음")

            // 입력된 이메일 문자열을 서버로 보내서 인증번호를 발신한다
            let xhr_sendEmail = new XMLHttpRequest(); // REST API 통신을 위한 객체
            let emailMessage = {"email" : inputValue} // 서버에 전송될 Json 데이터 > 사용자 카카오 계정을 전달
            xhr_sendEmail.open('POST', '/sendEmail', true); // REST 정의
            xhr_sendEmail.setRequestHeader("Content-Type", "application/json"); // 해더 설정

            // REST POST
            xhr_sendEmail.onload = function () {
                if (xhr_sendEmail.status === 200) {
                    alert("이메일에서 인증번호를 확인해주세요");
                    loadingOff()
                    emailAuth(xhr_sendEmail.responseText, emailBackground);
                }
                else {
                    // POST 실패
                    alert("이메일 서버에 오류가 있습니다. \n재시도 부탁드립니다.");
                    loadingOff()
                    unlinkWithKakao()
                    window.location.href = "/admin?id=" + userId;
                }
            };
            loadingOn()
            xhr_sendEmail.send(JSON.stringify(emailMessage)); // REST 요청
        }
        else {
            loadingOff()
            emailOnBtn()
            alert("올바른 이메일 형식이 아니거나, 사내 메일이 아닙니다. \n @skccus.com 또는 @partner.sk.com 메일을 입력해주세요")
        }
    }
}

function emailCancelBtn() {
    alert("취소되었습니다.")
    unlinkWithKakao()
    window.location.href = "/"
}

function emailOnBtn() {
    document.getElementById("emailModalSubmit").disabled = false;     // 버튼 활성화
    document.getElementById("emailModalSubmit").style.opacity = 1;     // 버튼 활성화
}

function emailOffBtn() {
    document.getElementById("emailModalSubmit").disabled = true;     // 버튼 비활성화
    document.getElementById("emailModalSubmit").style.opacity = 0.5;     // 버튼 비활성화 표시 위한 투명도
}