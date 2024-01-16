package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.service.V1service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Controller
public class Home {
    private String hashValue = null; // OP 가 로그인 시 서버에서 접근 가능하도록 해쉬 생성
    private String newhashValue = null;

    @Autowired
    V1service v1service; // Service 호출을 위한 객체

    // 가장 메인 도메인의 라우터
    @GetMapping("/")
    public String doHome(Model model) {
        return "home/index";
    }

    // op가 처음 카카오 로그인 시, DB에 저장된 회원인지 검증한다.
    @PostMapping("/check")
    public ResponseEntity<String> checkOfUser(@RequestBody Map<String, String> requestBody) {
        String who = requestBody.get("Who"); // who는 프론트에서 전달 받은 로그인 시도한 사용자의 카카오 id.
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.
        System.out.println("ROC Member" + lists);

        // 로그인한 사용자가 올바른지 검증
        for (Map<String, String> list : lists) {
            String rocMember = list.get("id"); // ROC인원의 id
            String processInfo = list.get("process");

            // 로그인 요청한 사용자가 OP인 경우만 OP 페이지 접속 허가 > 운영자는 OP 페이지 접속 불가.
            if (rocMember.equals(who) && processInfo.equals("OP")) {
                hashValue = UUID.randomUUID().toString(); // 해쉬값 생성 후 이 사용자에게 부여한다.(사용자를 식별하는 역할)
                return ResponseEntity.ok(list.get("name")+ "!@#$%" +hashValue); //정상적으로 DB에 있는 사용자이므로 생성된 해쉬를 프론트로 전달한다.
            }
        }
        return ResponseEntity.ok("False"); //DB에 없는 사용자가 로그인을 시도했기에 접근을 차단한다.
    }

    // admin 최초 로그인 요청 및 admin 페이지 이동
    @GetMapping("/admin")
    // 호출 예시 ex) http://localhost:8080/OP?uuid=12313213dwf232fe231321 > 서버에서 발급된 해쉬가 올바르게 요청되야 OP페이지로 이동함.
    public String goToAdminPage(
            @RequestParam(value = "id", required = true) String id,
            @RequestParam(value = "first", required = false) String first,
            Model model) {
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.
        System.out.println("ROC Member" + lists);

        // 로그인한 사용자가 올바른지 검증
        for (Map<String, String> list : lists) {
            String rocMember = list.get("id"); // ROC인원의 id
            String processInfo = list.get("process");

            // 로그인 요청한 사용자가 OP인 경우만 OP 페이지 접속 허가 > 운영자는 OP 페이지 접속 불가.
            if (rocMember.equals(id)) {
                if (first != null) {
                    // "first" 파라미터가 전달된 경우 운영자 페이지에 처음 접속한 경우이므로 Model 저달
                    model.addAttribute("firstValue", first);
                }

                System.out.println(id + lists);
                return "home/admin";
            }
        }
        return "home/400";
    }


    //출근하기 기능이다. 디비에서 금일의 대응자님 조회하여 list로 조히하여 프론트로 전송한다.
    @PostMapping("/goingToWork")
    public ResponseEntity<List<Map<String, String>>> goingToWork(@RequestBody Map<String, String> requestBody) {
        System.out.println("OP 페이지가 실행됨");
        String shift = requestBody.get("shift"); // 무의미 데이터 무시하세요.

        List<Map<String, String>> lists = v1service.shiftAdminList(); // 금일의 대응자 admin을 조회한다.

        System.out.println("조회된 금일 담당 대응자 분들 > " + lists);

        return ResponseEntity.ok(lists);
    }

    // OP 페이지로 이동한다. 사용자가 발급받은 해쉬 값을 추출하여 일치하는지 점검한다.
    @GetMapping("/OP")
    // 호출 예시 ex) http://localhost:8080/OP?uuid=12313213dwf232fe231321 > 서버에서 발급된 해쉬가 올바르게 요청되야 OP페이지로 이동함.
    public String goToOpPage(@RequestParam(value = "uuid", required = true) String uuid, Model model) {
        // 해쉬가 없다면 400 오류 페이지 반환
        if (hashValue == null) {
            return "home/400";
        }

        // 정상적으로 해쉬가 일치하므로 사용자르 OP 페이지로 이동시킨다.
        if (hashValue.equals(uuid)) {
            model.addAttribute("uuid", hashValue); //model에 key를 uuid, value를 hashValue로 담아서 프론트로 보냄
            hashValue = null;
            return "home/OP";
        }

        // 외부 URL로 접근한 공격이므로 차단 시킨다. 또는 여러명의 OP가 동시에 요청한 경우이므로 트레픽을 차단시킨다.
        else {
            System.out.println("서버와 프론트의 uuid가 다릅니다. 로그인 실패");
            return "home/404";
        }
    }

    // op가 질문하기 버튼을 눌렀을 떄 DB에 저장된 회원인지 검증한다.
    @PostMapping("/checkForasking")
    public ResponseEntity<String> checkForasking(@RequestBody Map<String, String> requestBody) {
        String who = requestBody.get("Who"); // who는 프론트에서 전달 받은 로그인 시도한 사용자의 카카오 id이다.
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.
        System.out.println(lists);

        for (Map<String, String> list : lists) { // 사용자 검증을 진행한다.
            String rocMember = list.get("id");
            if (rocMember.equals(who)) {
                return ResponseEntity.ok(list.get("name")); //정상적으로 DB에 있는 사용자이므로 생성된 해쉬를 프론트로 전달한다.
            }
        }
        return ResponseEntity.ok("False"); //DB에 없는 사용자가 로그인을 시도했기에 접근을 차단한다.
    }

    // op가 처음 카카오 로그인 시, DB에 저장된 회원인지 검증한다.
    @PostMapping("/getMe")
    public ResponseEntity<String> getMe(@RequestBody Map<String, String> requestBody) {
        String meId = requestBody.get("id"); // who는 프론트에서 전달 받은 로그인 시도한 사용자의 카카오 id이다.
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.

        for (Map<String, String> list : lists) { // 사용자 검증을 진행한다.
            String dbID = list.get("id");
            if (dbID.equals(meId)) {
                return ResponseEntity.ok(list.get("name")); //정상적으로 DB에 있는 사용자이므로 생성된 해쉬를 프론트로 전달한다.
            }
        }
        return ResponseEntity.ok("False"); //DB에 없는 사용자가 로그인을 시도했기에 접근을 차단한다.
    }


    // Admin에서 new 버튼 > 생성 페이지 중 카드 드레그 생성 페이지로 이동시킨다.
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

    // 운영자 정보를 가져온다.
    @PostMapping("/getSchedule")
    public ResponseEntity<List<List<Map<String, String>>>> getSchedule(@RequestBody Map<String, List<String>> requestBody) {
        List<String> dateInfo = requestBody.get("date"); // 무의미 데이터 무시하세요.
        List<List<Map<String, String>>> payload = new Vector<List<Map<String, String>>>();

        for (String card : dateInfo) {
            List<Map<String, String>> lists = v1service.oneDateSchedule(card); // 금일의 대응자 admin을 조회한다.
            payload.add(lists);
        }
        System.out.println("조희 결과> " + payload);

        return ResponseEntity.ok(payload);
    }


    //DB 저장을 위한 Controller
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
            return ResponseEntity.ok("Save Fail");
        }
        return ResponseEntity.ok("Save Success");
    }


    //Create시 ROC멤버 아닌 사람 입력 검증을 위해 member 모두 불러옴
    @ResponseBody
    @PostMapping("/checktypo")
    public HashMap<String, String> checkTypo(@RequestBody Map<String, String> requestBody) {
        String checkTypo = requestBody.get("CheckTypo"); // 프론트에서 보낸 입력값.
        List<Map<String, String>> lists = v1service.userList();
        System.out.println("CheckTypo"+lists);

        HashMap<String, String> rocALlNames = new HashMap<>();
        for (Map<String, String> list : lists) {
            rocALlNames.put(list.get("name"), list.get("process"));
        }
        System.out.println(rocALlNames);
        return rocALlNames;
    }
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
                    System.out.println(name +"으로" +date +"의 shcedule_hisotry 를 수정한다.");
                    v1service.updateDateToScheduleHistoryTable(date, name);
                }
            }
        }
        catch (Exception e) {
            return ResponseEntity.ok("Delete Fail");
        }
        return ResponseEntity.ok("Delete Success");
    }
}
