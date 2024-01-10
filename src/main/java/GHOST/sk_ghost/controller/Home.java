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

    // 로그인 페이지로 이동시킨다.
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


    // 생성 페이지 중 카드 생성 페이지로 이동시킨다.
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

    @PostMapping("/getSchedule")
    public ResponseEntity<List<Map<String, String>>> getSchedule(@RequestBody Map<String, String> requestBody) {
        String dateInfo = requestBody.get("date"); // 무의미 데이터 무시하세요.

        List<Map<String, String>> lists = v1service.oneDateSchedule(dateInfo); // 금일의 대응자 admin을 조회한다.

        System.out.println("조희 결과> " + lists);

        return ResponseEntity.ok(lists);
    }


    //DB 저장을 위한 Controller
    @PostMapping("/saveSchedule")
    public ResponseEntity<String> saveScheduleInsert(@RequestBody List<Map<String, String>> requestBody) throws Exception {
        System.out.println("Save to DB : " + requestBody);
        try{
            v1service.saveSchedule(requestBody);
        }
        catch (Exception e) {
            return ResponseEntity.ok("Save Fail");
        }
        return ResponseEntity.ok("Save Success");
    }


    @GetMapping("/judgeNewSchedule")
    public String judgeNewSchedule(@RequestParam(value = "user", required = true) String user, Model model) {
        System.out.println(user);
        // 해쉬가 없다면 400 오류 페이지 반환
        if (newhashValue == null) {
            //newhashValue = UUID.randomUUID().toString();
            // DB 조회하여 가장 마지막 날짜 + 1을 반환한다.

            model.addAttribute("new", newhashValue); //model에 key를 uuid, value를 hashValue로 담아서 프론트로 보냄
            model.addAttribute("date", "2024-12-12"); //model에 key를 uuid, value를 hashValue로 담아서 프론트로 보냄
            return "home/newSchedule";
        }

        // 누군가 이미 생성 중이라면 아무도 접근 하지 못하게 차단한다.
        else {
            System.out.println("누군가 이미 생성 중입니다.");
            return "home/admin";
        }
    }

    //Create시 ROC멤버 아닌 사람 입력 검증을 위해 member 모두 불러옴
    @ResponseBody
    @PostMapping("/checktypo")
    public ArrayList<String> checkTypo(@RequestBody Map<String, String> requestBody) {
        String checkTypo = requestBody.get("CheckTypo"); // 프론트에서 보낸 입력값.
        List<Map<String, String>> lists = v1service.userList();
        ArrayList<String> rocALlNames = new ArrayList<>();
        for (Map<String, String> list : lists) {
            rocALlNames.add(list.get("name"));
        }
        return rocALlNames;
    }

}
