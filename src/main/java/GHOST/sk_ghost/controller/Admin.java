package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.service.V1service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDate;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;


@Controller
public class Admin {
    private String newAdminhashValue = null;

    @Autowired
    V1service v1service; // Service 호출을 위한 객체

    @PostMapping("/adminShiftLastDate")
    public ResponseEntity<String> adminShiftLastDate(@RequestBody Map<String, String> requestBody) {
        String dateInfo = requestBody.get("date");

        ArrayList<String> lists = v1service.adminShiftLastDate(); // 금일의 대응자 admin을 조회한다.
        if (lists.isEmpty()) {
            return ResponseEntity.ok("False");
        } else {
            // 가장 늦은 날짜 출력
            List<LocalDate> dateList = lists.stream()
                    .map(LocalDate::parse)
                    .sorted()
                    .collect(Collectors.toList());
            LocalDate latestDate = dateList.get(dateList.size() - 1);

            // 날짜를 1일 더하고 문자열로 변환
            LocalDate nextDay = latestDate.plusDays(1);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String nextDayString = nextDay.format(formatter);

            System.out.println("Next Day: " + nextDayString);
            return ResponseEntity.ok(nextDayString);
        }
    }

    @PostMapping("/newScheUUIDJudge")
    public ResponseEntity<String> newScheUUIDJudge(@RequestBody Map<String, String> requestBody) {
        String who = requestBody.get("Who"); // 스케줄 생성을 요청한 사용자 id
        System.out.println("??" + newAdminhashValue);
        if (newAdminhashValue == null) return ResponseEntity.ok("NO");
        else return ResponseEntity.ok("YES");
    }

    @PostMapping("/newScheUUIDRemove")
    public ResponseEntity<String> newScheUUIDRemove(@RequestBody Map<String, String> requestBody) {
        String who = requestBody.get("Who"); // 스케줄 생성을 요청한 사용자 id
        newAdminhashValue = null;
        System.out.println("해쉬 제거완료");
        return ResponseEntity.ok("OK"); //DB에 없는 사용자가 로그인을 시도했기에 접근을 차단한다.
    }
}
