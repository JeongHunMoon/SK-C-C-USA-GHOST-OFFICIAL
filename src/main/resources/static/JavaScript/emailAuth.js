
function emailAuth() {
    // 동적 DOM 트리로써 이메일 입력을 위한 HTML 생성
    let modalWrapper = document.createElement('div');
    modalWrapper.id = 'modalWrapper'; // 위 태그에 id를 부여한다.
    modalWrapper.innerHTML = `
        <div class = "modalBackGround">
            <div class = "modalContainer">
                <div class = "modalHeader"> 이메일 인증이 필요합니다 </div>
                <div class = "modalBody"> 사내 구성원 인증을 위해 이메일 인증이 필요합니다. 이메일 주소를 통해 인증번호를 확인해 주세요</div>
                <div class = "modalInputContainer">
                    <span class = "modalInputTitle"> Email </span>    
                    <input type = "text" placeholder = " VDI mail 또는 @skccus.com 입력" id="value" class = "modalInputBody"></input>
                </div>
                <input type = "button" value = "전송" class = "modalSubmit" onclick = "emailSubmitBtn()"></input>
            </div>
        </div>   
    `;
    // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
    document.body.appendChild(modalWrapper);
}

function emailSubmitBtn() {
    // 사용자가 입력한 이메일 문자열 을 받아온다.
    let inputValue = document.getElementById('value').value.trim();
    console.log(inputValue)

    // 공백 입력시
    if (inputValue===""){
        alert("Email을 입력해주세요")
        return;
    }
    else{
        // 이메일 형식 유효성 검사 (추후 추가 -> @skccus, @partner.sk.com 만 가능하도록 정규식 추가)
        //https://stickode.tistory.com/654
        // 입력된 이메일 문자열을 서버로 보내서 인증번호를 발신한다

        // 서버 관련 예외처리

        //
    }
    // 사용자가 입력한 값을 가져온 후, DOM에서 퇴근 보고 태그를 삭제한다.
    document.body.removeChild(document.getElementById('inputWrapper'));
}

// 시용자가 x 표시를 누르는 경우  alert 후 홈으로 이동한다
function cancelInput() {
    // 생성했던 DOM 트리 제거
    document.body.removeChild(document.getElementById('inputWrapper'));
    alert("이메일 인증을 통해 DB에 사내 구성원을 등록 후 서비스 이용이 가능합니다");
    //home으로 이동
    window.location.href = "/"
}
