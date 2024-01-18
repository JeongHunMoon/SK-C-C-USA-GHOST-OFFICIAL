function signUp(){
    console.log("sign up now")
    alert("회원가입 모달")
    // 공정, 이름 입력만 하면 되나?
    // 이름 입력 규칙?

    // 동적 DOM 트리로써 이메일 입력을 위한 HTML 생성
    let modalWrapper = document.createElement('div');
    modalWrapper.id = 'modalWrapper'; // 위 태그에 id를 부여한다.
    modalWrapper.innerHTML = `
        <div class = "modalBackGround">
            <div class = "modalContainer">
                <div class = "modalHeader"> 회원가입 제목 </div>
                <div class = "modalBody">  회원가입 본문 </div>
                <div class = "modalInputContainer">
                    <span class = "modalInputTitle"> 회원가입 입력 </span>    
                    <input type = "text" placeholder = " 입력하세요 " id="value" class = "modalInputBody"></input>
                </div>
                <input type = "button" value = "전송" class = "modalSubmit" onclick = "memberSubmitBtn()"></input>
            </div>
        </div>   
    `;
    // 현재 이 함수가 실행된 html dom에 자식으로 태그를 추가한다.
    document.body.appendChild(modalWrapper);
}

function memberSubmitBtn() {
    // 사용자가 입력한 인증번호 문자열 을 받아온다.
    alert("회원가입 완료")
}