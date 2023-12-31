package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.service.V1service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.util.*;
import java.time.LocalDate;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

@Controller
public class Admin {

    @Autowired
    private V1service v1service; // Service 호출을 위한 객체

    private static String newAdminhashValue = null;

    @PostMapping("/adminShiftLastDate")
    @ResponseBody
    public ResponseEntity<String> adminShiftLastDate(@RequestBody Map<String, String> requestBody) {
        String dateInfo = requestBody.get("date");

        ArrayList<String> lists = v1service.adminShiftLastDate();
        if (lists.isEmpty()) {
            return ResponseEntity.ok("False");
        } else {
            List<LocalDate> dateList = lists.stream()
                    .map(LocalDate::parse)
                    .sorted()
                    .collect(Collectors.toList());
            LocalDate latestDate = dateList.get(dateList.size() - 1);

            LocalDate nextDay = latestDate.plusDays(1);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String nextDayString = nextDay.format(formatter);

            System.out.println("Next Day: " + nextDayString);
            return ResponseEntity.ok(nextDayString);
        }
    }

    @GetMapping("/uniquePage")
    @ResponseBody
    public String uniquePage(HttpSession session, @RequestParam String id) {

        /* 기본적으로 id가 맴버인지 판단. 맴버라면 아래 ㄱ
        */

        // 세션이 없으면 ? 일단 uuid도 없어야함.
        if (session == null) { newAdminhashValue = null; }
        // 크롬에서 세션을 만들었다면,
        //session.getAttribute("visited") != null

        if (newAdminhashValue != null) {
            System.out.println("==세션 있음.==");
            System.out.println(newAdminhashValue);

            if (newAdminhashValue.equals(id)) {
                System.out.println("재접속");
                return "true";
            }
            else {
                System.out.println("누군가 쓰고 있음." + newAdminhashValue);
                return "home/admin";
            }
        } else {
            System.out.println("신규 접속");
            newAdminhashValue = id;
            session.setAttribute("visited", true);
            return "true";
        }
    }

    @GetMapping("/done")
    @ResponseBody
    public String done(HttpSession session, @RequestParam String id) {
        // 수정된 부분
        if (newAdminhashValue != null && newAdminhashValue.equals(id)) {
            session.invalidate();
            newAdminhashValue = null;
            System.out.println("정상적으로 세션 종료. 다른 사용자 접속 허용");
        }
        else {
            System.out.println("이상한 사용자가 종료 처리 요청함");
        }
        return "OK"; // 수정된 부분
    }

    @GetMapping("/remove")
    public String remove(HttpSession session) {
        if (session != null && session.getAttribute("visited") != null) {
            session.invalidate();
            System.out.println("세션이 성공적으로 종료되었습니다.");
        } else {
            System.out.println("세션이 이미 무효화되었거나 존재하지 않습니다.");
        }
        return "home/admin";
    }


    @PostMapping("/saveData")
    @ResponseBody
    public ResponseEntity<String> saveData(HttpSession session, @RequestBody Map<String, String> requestBody) {
        if (session.getAttribute("myArray") != null) {
            session.removeAttribute("myArray");
        }

        String datas = requestBody.get("datas");
        boolean flag = false;
        // '?'로 분리
        String[] dataArray = datas.split("\\?");

        // 각 문자열을 '&'로 분리하여 배열로 만들기
        List<List<String>> result = new ArrayList<>();
        for (String data : dataArray) {
            String[] parts = data.split("&");
            result.add(Arrays.asList(parts));
            flag = true;
        }

        // 결과 확인
        System.out.println(result);
        System.out.println(flag);

        // 아무런 값도 입력하지 않으면 세션을 만들지 않는다.
        if (flag) {
            // 세션에 배열 저장
            session.setAttribute("myArray", result);

            // 세션에서 배열 읽기
            List<List<String>> savedD = (List<List<String>>) session.getAttribute("myArray");
            System.out.println("세션에 저장된 값" + savedD);

        }

        return ResponseEntity.ok("Data received successfully!");
    }

    @PostMapping("/getSavedData")
    @ResponseBody
    public ResponseEntity<List<List<String>>> getSavedData(HttpSession session, @RequestBody Map<String, String> requestBody) {
        String userId = requestBody.get("id");

        if (session.getAttribute("myArray") != null && userId.equals(newAdminhashValue)) {
            List<List<String>> savedD = (List<List<String>>) session.getAttribute("myArray");
            System.out.println("저장된 세션 얻기" + savedD);
            return ResponseEntity.ok(savedD);
        }

        System.out.println(Collections.emptyList());
        return ResponseEntity.ok(Collections.emptyList()); // 빈 리스트 반환 또는 다른 기본값 설정
    }


}