
function emailAuth(authNum) {
    loadingOff()
    // 동적 DOM 트리로써 이메일 입력을 위한 HTML 생성
    let codeModalWrapper = document.createElement('div');
    codeModalWrapper.id = 'codeModalWrapper'; // 위 태그에 id를 부여한다.
    codeModalWrapper.innerHTML = `
        <div class = "codeModalBackGround">
            <div class = "codeModalContainer">
                <div class = "codeModalHeader"> 이메일 인증이 필요합니다 </div>
                <div class = "codeModalBody"> 사내 구성원 인증을 위해 이메일 인증이 필요합니다. 이메일 주소를 통해 인증번호를 확인해 주세요</div>
                <div class = "codeModalInputContainer">
                    <span class = "codeModalInputTitle"> 인증번호 </span>    
                    <input type = "text" placeholder = " 6-character input " id="value" class = "codeModalInputBody"></input>
                </div>
                <input type = "button" value = "전송" id = "codeModalSubmit" onclick = "codeSubmitBtn()"></input>
            </div>
        </div>   
    `;
    // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
    document.body.appendChild(codeModalWrapper);
}

function codeSubmitBtn() {
    // 사용자가 입력한 인증번호 문자열 을 받아온다.
    let inputValue = document.getElementById('value').value.trim();
    console.log(inputValue)

    // 공백 입력시
    if (inputValue === ""){
        alert("인증번호를 입력해주세요")
    }
    else if (inputValue !== authNum){
        alert("인증번호가 일치하지 않습니다")
    }
    else if (inputValue === authNum){
        alert("인증번호가 일치합니다. 회원정보를 입력해주세요") //회원정보입력창 개발 필요
        document.body.removeChild(document.getElementById('codeModalWrapper')); //현재 모달창 DOM 삭제
        signUp()
    }

}

// 시용자가 x 표시를 누르는 경우  alert 후 홈으로 이동한다
// function cancelInput() {
//     // 생성했던 DOM 트리 제거
//     document.body.removeChild(document.getElementById('inputWrapper'));
//     alert("이메일 인증을 통해 DB에 사내 구성원을 등록 후 서비스 이용이 가능합니다");
//     //home으로 이동
//     window.location.href = "/"
// }

function codeOnBtn() {
    document.getElementById("codeModalSubmit").disabled = false;     // 버튼 활성화
    document.getElementById("codeModalSubmit").style.opacity = 1;     // 버튼 활성화
}

function codeOffBtn() {
    document.getElementById("codeModalSubmit").disabled = true;     // 버튼 비활성화
    document.getElementById("codeModalSubmit").style.opacity = 0.5;     // 버튼 비활성화 표시 위한 투명도
}