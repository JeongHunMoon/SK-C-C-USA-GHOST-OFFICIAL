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
    private static String modifyAdminhashValue = null;

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
    public ResponseEntity<String> uniquePage(HttpSession session, @RequestParam String id) {
        session.setMaxInactiveInterval(-1);
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.
        System.out.println("ROC Member" + lists);

        // 로그인한 사용자가 올바른지 검증
        for (Map<String, String> list : lists) {
            String rocMember = list.get("id"); // ROC인원의 id
            String processInfo = list.get("process");

            // 로그인 요청한 사용자가 OP인 경우만 OP 페이지 접속 허가 > 운영자는 OP 페이지 접속 불가.
            if (rocMember.equals(id)) {
                System.out.println(id + lists);
                // 세션이 없으면 ? 일단 uuid도 없어야함.
                if (session == null) { newAdminhashValue = null; }
                // 크롬에서 세션을 만들었다면,
                //session.getAttribute("visited") != null

                if (newAdminhashValue != null) {
                    System.out.println("==세션 있음.==");
                    System.out.println(newAdminhashValue);

                    if (newAdminhashValue.equals(id)) {
                        System.out.println("재접속");
                        return ResponseEntity.ok("true");
                    }
                    else {
                        System.out.println("누군가 쓰고 있음." + newAdminhashValue);
                        return ResponseEntity.ok("false");
                    }
                } else {
                    System.out.println("신규 접속");
                    newAdminhashValue = id;
                    session.setMaxInactiveInterval(-1);
                    session.setAttribute("visited", true);
                    return ResponseEntity.ok("true");
                }
            }
        }

        // 운영자가 아닌사람이 스케줄 생성 시도
        System.out.println("잘못된 id 맴버" + "현재 사용자 > " + newAdminhashValue);
        return ResponseEntity.ok("None");
    }

    @GetMapping("/done")
    @ResponseBody
    public String done(HttpSession session, @RequestParam String id) {
        session.setMaxInactiveInterval(-1);
        // 수정된 부분
        if (newAdminhashValue != null && newAdminhashValue.equals(id)) {
            session.invalidate(); // 모든 세션 제거 및 session > null
            newAdminhashValue = null;
            System.out.println("정상적으로 세션 종료. 다른 사용자 접속 허용");
        }
        else {
            System.out.println("이상한 사용자가 종료 처리 요청함");
        }
        return "OK"; // 수정된 부분
    }

    // id get으로 받고, 맴버 검증 수행 후 취소하기
    @GetMapping("/remove")
    public String remove(HttpSession session) {
        session.setMaxInactiveInterval(-1);
        session.invalidate();
        newAdminhashValue = null;
        System.out.println("세션이 성공적으로 종료되었습니다.");
        return "home/admin";
    }

    // id get으로 받고, 맴버 검증 수행 후 취소하기
    @GetMapping("/removeModify")
    public String removeModify(@RequestParam String id, HttpSession session) {

        if (id.equals(modifyAdminhashValue)) {
            // 사용할 id를 여기에서 활용할 수 있음
            modifyAdminhashValue = null;
            System.out.println("수정시 세션이 성공적으로 종료되었습니다.");
            return "home/admin";
        }
        else {
            return "home/400";
        }
    }




    @PostMapping("/saveData")
    @ResponseBody
    public ResponseEntity<String> saveData(HttpSession session, @RequestBody Map<String, String> requestBody) {
        session.setMaxInactiveInterval(-1);
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
            @SuppressWarnings("unchecked")
            List<List<String>> savedD = (List<List<String>>) session.getAttribute("myArray");
            System.out.println("세션에 저장된 값" + session.getAttribute("myArray"));

        }

        return ResponseEntity.ok("Data received successfully!");
    }

    @PostMapping("/getSavedData")
    @ResponseBody
    public ResponseEntity<List<List<String>>> getSavedData(HttpSession session, @RequestBody Map<String, String> requestBody) {
        session.setMaxInactiveInterval(-1);
        String userId = requestBody.get("id");

        if (session.getAttribute("myArray") != null && userId.equals(newAdminhashValue)) {
            @SuppressWarnings("unchecked")
            List<List<String>> savedD = (List<List<String>>) session.getAttribute("myArray");
            System.out.println("저장된 세션 얻기" + savedD);
            return ResponseEntity.ok(savedD);
        }

        System.out.println("세션 안가져옴"+Collections.emptyList());
        return ResponseEntity.ok(Collections.emptyList()); // 빈 리스트 반환 또는 다른 기본값 설정
    }


    // 생성과 수정은 독립적 관계이므로 페이지를 각각 잠근다.
    @GetMapping("/modifySchedule")
    public String modifySchedule(
            @RequestParam(value = "id", required = true) String id,
            @RequestParam(value = "start", required = true) String start,
            @RequestParam(value = "end", required = true) String end,
            Model model) {
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.
        System.out.println("ROC Member" + lists);

        // 로그인한 사용자가 올바른지 검증
        for (Map<String, String> list : lists) {
            String rocMember = list.get("id"); // ROC인원의 id
            String processInfo = list.get("process");

            // 로그인 요청한 사용자가 OP인 경우만 OP 페이지 접속 허가 > 운영자는 OP 페이지 접속 불가.
            if (rocMember.equals(id)) {
                System.out.println(start + end);
                // 여기에서 start와 end를 사용하여 필요한 작업 수행
                model.addAttribute("start", start);
                model.addAttribute("end", end);

                if (modifyAdminhashValue != null) {
                    System.out.println("==누군가 수정 중임.==");
                    System.out.println(modifyAdminhashValue);

                    if (modifyAdminhashValue.equals(id)) {
                        System.out.println("재접속");
                        return "home/modifySchedule";
                    }
                    else {
                        System.out.println("누군가 쓰고 있음." + newAdminhashValue);
                        model.addAttribute("flag", id); // 이름으로 전달 필요.
                        return "home/admin";
                    }
                } else {
                    System.out.println("신규 접속");
                    modifyAdminhashValue = id;
                    return "home/modifySchedule";
                }
            }
        }
        return "home/400";
    }


    @GetMapping("/deleteSchedule")
    public String deleteSchedule(
            @RequestParam(value = "id", required = true) String id,
            @RequestParam(value = "start", required = true) String start,
            @RequestParam(value = "end", required = true) String end,
            Model model) {
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.
        System.out.println("ROC Member" + lists);

        // 로그인한 사용자가 올바른지 검증
        for (Map<String, String> list : lists) {
            String rocMember = list.get("id"); // ROC인원의 id
            String processInfo = list.get("process");

            // 로그인 요청한 사용자가 OP인 경우만 OP 페이지 접속 허가 > 운영자는 OP 페이지 접속 불가.
            if (rocMember.equals(id)) {
                System.out.println(start + end);
                // 여기에서 start와 end를 사용하여 필요한 작업 수행
                model.addAttribute("start", start);
                model.addAttribute("end", end);

                if (modifyAdminhashValue != null) {
                    System.out.println("==누군가 수정 중임.==");
                    System.out.println(modifyAdminhashValue);

                    if (modifyAdminhashValue.equals(id)) {
                        System.out.println("재접속");
                        return "home/deleteSchedule";
                    }
                    else {
                        System.out.println("누군가 쓰고 있음." + newAdminhashValue);
                        model.addAttribute("flag", id); // 이름으로 전달 필요.
                        return "home/admin";
                    }
                } else {
                    System.out.println("신규 접속");
                    modifyAdminhashValue = id;
                    return "home/deleteSchedule";
                }
            }
        }
        return "home/400";
    }


    @PostMapping("/modifyUpdate")
    public ResponseEntity<String> modifyUpdate(@RequestBody List<Map<String, String>> requestBody) throws Exception {
        System.out.println("modifyUpdate from DB : " + requestBody);
        try {
            v1service.modifyUpdate(requestBody);
        }
        catch (Exception e) {
            return ResponseEntity.ok("Update Fail");
        }
        return ResponseEntity.ok("Update Success");
    }

}