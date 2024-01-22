// 매개변수로 유효한 인증 번호를 전송 받는다.
function emailAuth(authNum, emailBackground) {
    emailBackground.removeChild(document.getElementById('emailModalContainer')); // 이전 이메일 입력 모달 제거.

    let codeModalContainer = document.createElement('div'); // 인증 코드를 입력하는 새로운 모달 생성
    codeModalContainer.id = 'codeModalContainer'; // 위 태그에 id를 부여한다.
    codeModalContainer.innerHTML = `
                <div class = "codeModalHeader"> 이메일 인증이 필요합니다.</div>
                <div class = "codeModalBody"><span>사내 구성원 인증을 위해 이메일 인증이 필요합니다. 이메일 주소를 통해 인증번호를 확인해 주세요.</span></div>
                <div class = "codeModalInputContainer">
                    <span class = "codeModalInputTitle">인증번호</span>    
                    <input type = "text" placeholder = " 6-character input " id="value" class = "codeModalInputBody"></input>
                </div>
                <input type = "button" value = "전송" id = "codeModalSubmit"></input>
    `;

    // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
    emailBackground.appendChild(codeModalContainer);

    document.getElementById('codeModalSubmit').addEventListener('click', function() {
        codeOffBtn()
        loadingOn()
        codeSubmitBtn(authNum, emailBackground, codeModalContainer);
    });
    alert("이메일에서 인증번호를 확인해주세요");
}

function codeSubmitBtn(authNum, emailBackground, codeModalContainer) {
    // 사용자가 입력한 인증번호 문자열 을 받아온다.
    let inputValue = document.getElementById('value').value.trim();
    inputValue = inputValue.trim(); // 2중 trim

    // 공백 입력시
    if (inputValue === "") {
        codeOnBtn()
        loadingOff()
        alert("인증번호를 입력해주세요")
    }
    else if (inputValue !== authNum) {
        codeOnBtn()
        loadingOff()
        alert("인증번호가 일치하지 않습니다")
    }
    else if (inputValue === authNum) {
        loadingOff()
        emailBackground.removeChild(codeModalContainer); // 백그라운드에서 인증코드 입력하는 모달 제거. > signUp함수에서 signUp 모달을 붙인다.
        alert("감사합니다. 회원정보를 입력해주세요")
        signUp(emailBackground)
    }
}

function emailCancelBtn() {
    alert("취소되었습니다.")
    unlinkWithKakao()
    window.location.href = "/"
}

function codeOnBtn() {
    document.getElementById("codeModalSubmit").disabled = false;     // 버튼 활성화
    document.getElementById("codeModalSubmit").style.opacity = 1;     // 버튼 활성화
}

function codeOffBtn() {
    document.getElementById("codeModalSubmit").disabled = true;     // 버튼 비활성화
    document.getElementById("codeModalSubmit").style.opacity = 0.5;     // 버튼 비활성화 표시 위한 투명도
}