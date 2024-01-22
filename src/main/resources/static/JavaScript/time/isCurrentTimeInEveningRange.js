// 주어진 시간이 저녁(15:00~17:00)에 속하는지 확인하는 함수
function isCurrentTimeInEveningRange() {
    const lowerBound = 15; // 15:00
    const upperBound = 17; // 17:00

    const newYorkTime = getNewYorkTime();
    const currentHour = parseInt(newYorkTime.split(':')[0]);

    return currentHour >= lowerBound && currentHour < upperBound;
}