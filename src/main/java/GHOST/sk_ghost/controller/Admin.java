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

    // 미사용 라우터(삭제 예정)
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

    // 카카오 id > 사용자 이름 매핑하는 API이다.
    @PostMapping("/getUsedName")
    @ResponseBody
    public ResponseEntity<String> getUsedName(@RequestBody Map<String, String> requestBody) {
        if (newAdminhashValue == null) {
            return ResponseEntity.ok("False");
        }
        else {
            return ResponseEntity.ok(v1service.getNameFromId(newAdminhashValue));
        }
    }

    // 현재 admin_shift 테이블에 등록되어 있는 날짜 중 가장 마지막 날짜를 가져오는 라우터이다.
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

    // 생성 페이지의 Save 버튼 클릭 시 동작한다. 현재까지 입력된 데이터를 세션으로 백업한다.
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

    // 생성시 Save 하였던 세션에 저장된 데이터 프론트로 반환한다.
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

    // (C1) CREATE PAGE1 : Admin에서 new 버튼 > 생성 페이지 중 카드 드레그 생성 페이지로 이동시킨다.
    @GetMapping("/newSchedule")
    public String adminNewSchedule(@RequestParam(value = "id", required = true) String id, Model model) {
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.
        System.out.println("ROC Member" + lists);

        // 로그인한 사용자가 올바른지 검증
        for (Map<String, String> list : lists) {
            String rocMember = list.get("id"); // ROC인원의 id
            String processInfo = list.get("process");

            // 로그인 요청한 사용자가 OP인 경우만 OP 페이지 접속 허가 > 운영자는 OP 페이지 접속 불가.
            if (rocMember.equals(id)) {
                System.out.println(id + lists);
                return "home/newSchedule";
            }
        }
        return "home/400";
    }

    // (C2) CREATE PAGE2 : 생성 스크롤 페이지에서 > 실제 생성 페이지로 이동시키는 라우터이다.
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

                        return ResponseEntity.ok(v1service.getNameFromId(newAdminhashValue));
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


    // (U) MODIFY PAGE : 사용자를 수정 페이지로 이동시킨다.
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

                if (newAdminhashValue != null) {
                    System.out.println("==누군가 수정 중임.==");
                    System.out.println(newAdminhashValue);

                    if (newAdminhashValue.equals(id)) {
                        System.out.println("재접속");
                        return "home/modifySchedule";
                    }
                    else {
                        System.out.println("누군가 쓰고 있음." + newAdminhashValue);
                        model.addAttribute("flag", v1service.getNameFromId(newAdminhashValue)); // 이름으로 전달 필요.
                        return "home/admin";
                    }
                } else {
                    System.out.println("신규 접속");
                    newAdminhashValue = id;
                    return "home/modifySchedule";
                }
            }
        }
        return "home/400";
    }


    // (D) DELETE PAGE : 사용자를 삭제 페이지로 이동시킨다.
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

                if (newAdminhashValue != null) {
                    System.out.println("==누군가 수정 중임.==");
                    System.out.println(newAdminhashValue);

                    if (newAdminhashValue.equals(id)) {
                        System.out.println("재접속");
                        return "home/deleteSchedule";
                    }
                    else {
                        System.out.println("누군가 쓰고 있음." + newAdminhashValue);
                        model.addAttribute("flag", v1service.getNameFromId(newAdminhashValue)); // 이름으로 전달 필요.
                        return "home/admin";
                    }
                } else {
                    System.out.println("신규 접속");
                    newAdminhashValue = id;
                    return "home/deleteSchedule";
                }
            }
        }
        return "home/400";
    }

    // (C) INSERT : admin_shift 테이블에 insert를 수행하는 라우터이다.
    @PostMapping("/saveSchedule")
    public ResponseEntity<String> saveScheduleInsert(@RequestBody List<Map<String, String>> requestBody) throws Exception {
        System.out.println("Save to DB : " + requestBody);
        // date가 있는지 검사한다. > 있다면 무시한다.
        // > 없다면 card table에 담당자의 이름을 추가한다. id를 넣으면 이름을 가져오는 서비스가 필요함.
        try {
            Set<String> dateSet = new HashSet<>();

            for (Map<String, String> map : requestBody) {
                String date = map.get("date");
                if (date != null && !date.isEmpty()) {
                    dateSet.add(date);
                }
            }

            for (String date : dateSet) {
                // 해당 카드를 새로 만드는 insert
                if (!v1service.isDateHistory(date)) {
                    String name = v1service.getNameFromId(requestBody.get(0).get("manager"));
                    System.out.println(name +"으로" +date +"의 shcedule_hisotry 를 만든다.");
                    v1service.insertDateToScheduleHistoryTable(date, name);
                }
                // 해당 카드를 수정하는 insert
                else {
                    String name = v1service.getNameFromId(requestBody.get(0).get("manager"));
                    System.out.println(name +"으로" +date +"의 shcedule_hisotry 를 수정한다.");
                    v1service.updateDateToScheduleHistoryTable(date, name);
                }
            }

            v1service.saveSchedule(requestBody);
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Save Fail");
        }
        return ResponseEntity.ok("Save Success");
    }

    // (R) READ : 스케줄 카드를 생성할 때 사용되는 라우터이다. 요청된 날짜에 해당하는 모든 admin_shift정보를 리스트로 반환한다.
    @PostMapping("/getSchedule")
    public ResponseEntity<List<List<Map<String, String>>>> getSchedule(@RequestBody Map<String, List<String>> requestBody) throws Exception {
        try {
            List<String> dateInfo = requestBody.get("date"); // 무의미 데이터 무시하세요.
            List<List<Map<String, String>>> payload = new Vector<List<Map<String, String>>>();

            for (String card : dateInfo) {
                List<Map<String, String>> lists = v1service.oneDateSchedule(card); // 금일의 대응자 admin을 조회한다.
                payload.add(lists);
            }
            System.out.println("조희 결과> " + payload);

            return ResponseEntity.ok(payload);
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }

    // (U) UPDATE : 수정 시 > 업데이트 호출 부분
    @PostMapping("/updateSchedule")
    public ResponseEntity<String> updateSchedule(@RequestBody List<Map<String, String>> requestBody) throws Exception {
        System.out.println("modifyUpdate from DB : " + requestBody);
        try {
            Set<String> dateSet = new HashSet<>();

            for (Map<String, String> map : requestBody) {
                String date = map.get("date");
                if (date != null && !date.isEmpty()) {
                    dateSet.add(date);
                }
            }

            for (String date : dateSet) {
                if (v1service.isDateHistory(date)) {
                    String name = v1service.getNameFromId(requestBody.get(0).get("manager"));
                    System.out.println(name +"으로" +date +"의 shcedule_hisotry 변경한다");
                    v1service.updateDateToScheduleHistoryTable(date, name);
                }
            }

            v1service.updateSchedule(requestBody);
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Update Fail");
        }
        return ResponseEntity.ok("Update Success");
    }

    // (D) DELETE : admin_shift 테이블에 delete를 수행하는 라우터이다.
    @ResponseBody
    @PostMapping("/delete")
    public ResponseEntity<String> delete(@RequestBody List<Map<String, String>> requestBody) throws Exception {
        System.out.println("delete from DB : " + requestBody);
        try {
            v1service.deleteSchedule(requestBody);

            // 날짜 추출 > 해당 날짜가 admin_shift에 없으면 > history_table에서 해당 날짜 제거 하기.
            Set<String> dateSet = new HashSet<>();

            for (Map<String, String> map : requestBody) {
                String date = map.get("date");
                if (date != null && !date.isEmpty()) {
                    dateSet.add(date);
                }
            }

            for (String date : dateSet) {
                // admin_shift 테이블에 이제 더 이상 운영자가 없기에 히스토리도 지운다.
                if (!v1service.isDateAdminShiftTable(date)) {
                    v1service.deleteDateToScheduleHistoryTable(date);
                }
                // 누군가 카드를 삭제하긴 했는데 > 아직 살아있기 때문에 수정자 이름을 바꾼다.
                else {
                    String name = v1service.getNameFromId(requestBody.get(0).get("manager"));
                    System.out.println("삭제 : " + name +"으로" +date +"의 shcedule_hisotry 를 수정한다.");
                    v1service.updateDateToScheduleHistoryTable(date, name);
                }
            }
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Delete Fail");
        }
        return ResponseEntity.ok("Delete Success");
    }

    // CANCEL : 생성에서 사용하는 cancel 버튼 > id get으로 받고, 맴버 검증 수행 후 취소하기
    @GetMapping("/removeCreate")
    public ResponseEntity<String> remove(@RequestParam(name = "id", required = true) String id, HttpSession session) {
        System.out.println("현재 생성 중인 사람" + newAdminhashValue);
        if (id.equals(newAdminhashValue)) {
            session.setMaxInactiveInterval(-1);
            session.invalidate();
            newAdminhashValue = null;
            System.out.println("생성시 세션이 성공적으로 종료되었습니다.");
            return ResponseEntity.ok("true");

        } else {
            return ResponseEntity.ok("false");
        }
    }

    // CANCEL : 업데이트, delete 에서 사용하는 취소 버튼 > id get으로 받고, 맴버 검증 수행 후 취소하기
    @GetMapping("/removeModify")
    public ResponseEntity<String> removeModify(@RequestParam(name = "id", required = true) String id, HttpSession session) {
        System.out.println("현재 수정 중인 사람" + newAdminhashValue);
        if (id.equals(newAdminhashValue)) {
            // 사용할 id를 여기에서 활용할 수 있음
            newAdminhashValue = null;
            System.out.println("수정시 세션이 성공적으로 종료되었습니다.");
            return ResponseEntity.ok("true");

        } else {
            return ResponseEntity.ok("false");
        }
    }
}