// Access token을 갱신하는 함수. > 사용 안하는 함수
function refreshAccessToken(refreshToken) { // 현재 가지고 있는 refresh token을 전달하면
    console.log("전달 받은 리프레시 토큰", refreshToken)
    const clientId = 'ea824815503273f372ee072a86ee2fa5'; // REST API Key > 암호화 필요.
    const clientSecret = 'vX05Pr1kZujPDGJUc5Si8aEZW7LRuqcp'; // 우리 플랫폼의 Secret > 암호화 필요.
    const xhr = new XMLHttpRequest();
    const url = `https://kauth.kakao.com/oauth/token?grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}`;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const newAccessToken = response.access_token;

            // 여기서 새로 받은 Access Token을 사용하여 다른 작업을 수행할 수 있습니다.
            // 예를 들면, 친구 목록을 갱신하는 API 호출 등...
            Kakao.Auth.setAccessToken(newAccessToken);
            console.log("갱신될 새 토큰" + newAccessToken);
            console.log("갱신된 새 토큰이 등록됨" + Kakao.Auth.getAccessToken());

            //refreshfriendUuid(newAccessToken);

            alert('New Access Token:' + newAccessToken);
        } else {
            alert('Failed to refresh Access Token:' + xhr.responseText) ;
        }
    };
    xhr.send();
}