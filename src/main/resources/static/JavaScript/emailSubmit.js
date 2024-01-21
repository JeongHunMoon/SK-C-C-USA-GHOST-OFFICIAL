// 회원가입시 이메일을 입력하는 DOM과 처리 로직.
function emailSubmit() {
    // 동적 DOM 트리로써 이메일 입력을 위한 HTML 생성
    let emailBackground = document.createElement('div');
    emailBackground.id = 'emailBackground'; // 위 태그에 id를 부여한다.
    emailBackground.innerHTML = `
        <div id = "emailModalContainer">
            <div class = "emailModalHeader"> 이메일 인증이 필요합니다.</div>
            <div class = "emailModalBody"> <span>사내 구성원 인증을 위해 이메일 인증이 필요합니다. 아래 이메일을 통해 인증코드를 확인해 주세요.<br><br>@partner.sk.com or @skccus.com</span></div>
            <input type = "text" placeholder = " @partner.sk.com, @skccus.com" id="value" class = "emailModalInputBody"></input>
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
    inputValue = inputValue.trim() // 2중 trim

    // 공백 입력시
    if (inputValue === "") {
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
            // 입력된 이메일 문자열을 서버로 보내서 인증번호를 발신한다
            let xhr_sendEmail = new XMLHttpRequest(); // REST API 통신을 위한 객체
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
                    alert("이메일 서버에 오류가 있습니다. \n재시도 부탁드립니다.");
                    loadingOff()
                    unlinkWithKakao()
                    window.location.href = "/"
                }
            };
            loadingOn()
            xhr_sendEmail.send(JSON.stringify({"email" : inputValue})); // REST 요청

            xhr_sendEmail.timeout = 10000;

            // 서버에서 일정시간 응답이 없을 때,
            xhr_sendEmail.ontimeout = function () {
                alert("서버 처리 지연.\n재시도 부탁드립니다.")
                loadingOff()
                window.location.href = "/"
            };

            // 넷웤이 없는데 요청할때 실행
            xhr_sendEmail.onerror = function () {
                alert("인터넷 접속을 확인하세요.\n재시도 부탁드립니다.")
                loadingOff()
                window.location.href = "/"
            };
        }
        else {
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