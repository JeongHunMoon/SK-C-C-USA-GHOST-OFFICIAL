// 내 친구 목록 uuid 값 불러오기 함수. (사용 미정)
function getFriendUuid(newAccessToken) {
    const xhr = new XMLHttpRequest();
    const url = 'https://kapi.kakao.com/v1/api/talk/friends';

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + newAccessToken);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const payload = JSON.parse(xhr.responseText);
            friendUuid = payload.elements[0].uuid;
            console.log('갱신된 친구 UUID:', friendUuid);
        } else {
            console.error('Failed to refresh friend UUID:', xhr.responseText);
        }
    };
    xhr.send();
}