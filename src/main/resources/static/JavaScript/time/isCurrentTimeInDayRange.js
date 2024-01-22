// 주어진 시간이 주간(07:00~09:00)에 속하는지 확인하는 함수
function isCurrentTimeInDayRange() {
    const lowerBound = 7; // 07:00
    const upperBound = 9; // 09:00

    const newYorkTime = getNewYorkTime();
    const currentHour = parseInt(newYorkTime.split(':')[0]);

    return currentHour >= lowerBound && currentHour < upperBound;
}

