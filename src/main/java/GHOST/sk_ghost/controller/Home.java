package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.dao.V1Dao;
import GHOST.sk_ghost.service.V1service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
public class Home {
    private String hashValue = null;

    @Autowired
    V1service v1service;

    @GetMapping("/") //가장 메인 도메인의 라우터이다.
    public String doHome(Model model) {
        return "home/index";
    }

    @PostMapping("/check") // op가 처음 카카오 로그인 시, DB에 저장된 회원인지 검증한다.
    public ResponseEntity<String> checkOfUser(@RequestBody Map<String, String> requestBody) {
        String who = requestBody.get("Who"); // who는 프론트에서 전달 받은 로그인 시도한 사용자의 카카오 id이다.
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.
        System.out.println("???" + lists);
        for (Map<String, String> list : lists) { // 사용자 검증을 진행한다.
            String rocMember = list.get("id");
            String processInfo = list.get("process");

            if (rocMember.equals(who) && processInfo.equals("OP")) {
                hashValue = UUID.randomUUID().toString(); // 해쉬값 생성 후 이 사용자에게 부여한다.(사용자를 식별하는 역할)
                return ResponseEntity.ok(list.get("name") + " " + hashValue); //정상적으로 DB에 있는 사용자이므로 생성된 해쉬를 프론트로 전달한다.
            }
        }
        return ResponseEntity.ok("False"); //DB에 없는 사용자가 로그인을 시도했기에 접근을 차단한다.
    }

    @PostMapping("/goingToWork") //출근하기 기능이다. 디비에서 금일의 대응자님 조회하여 list로 조히하여 프론트로 전송한다.
    public ResponseEntity<List<Map<String, String>>> goingToWork(@RequestBody Map<String, String> requestBody) {
        System.out.println("OP 페이지가 실행됨");
        String shift = requestBody.get("shift"); // 무의미 데이터 무시하세요.
        System.out.println(shift);

        List<Map<String, String>> lists = v1service.shiftAdminList(); // 금일의 대응자 admin을 조회한다.

        /*
        * 현재는 모든 내용을 그대로 리스트로 반환하지만, 금일의 대응자만 추출하여 list로 만들어 전달해야한다.
        * Elec 테이블에서 오늘의 날짜를 가져온다. 현재 시간을 가져온다. 08시 기준 07~09시 까지를 Day로 판단한 후, data = 12/1, shift = D 하면
        * 1차, 2차 대응자가 조회되며, 이를 left join friend하면
        * id, name, data, shift, priority, uuid 테이블이 만들어진다.(12/1일 D에 해당하는 전극 운영자만 추출됨
        *
        * 위 과정을 7공정에 대해 모두 수행하여 List<Map<String, String>> 으로 만든다.
        * */
        System.out.println(">>" + lists);

        return ResponseEntity.ok(lists);
    }

    @GetMapping("/OP") // OP 페이지로 이동한다. 사용자가 발급받은 해쉬 값을 추출하여 일치하는지 점검한다.
    // 호출 예시 ex) http://localhost:8080/OP?uuid=12313213dwf232fe231321 > 서버에서 발급된 해쉬가 올바르게 요청되야 OP페이지로 이동함.
    public String goToOpPage(@RequestParam(value = "uuid", required = true) String uuid, Model model) {
        if (hashValue == null) {
            return "home/400";
        }
        if (hashValue.equals(uuid)) {
            model.addAttribute("uuid", hashValue);
            hashValue = null;
            return "home/OP";
        }
        else {
            System.out.println("서버와 프론트의 uuid가 다릅니다. 로그인 실패");
            return "home/404";
        }
    }

    @PostMapping("/checkForasking") // op가 처음 카카오 로그인 시, DB에 저장된 회원인지 검증한다.
    public ResponseEntity<String> checkForasking(@RequestBody Map<String, String> requestBody) {
        String who = requestBody.get("Who"); // who는 프론트에서 전달 받은 로그인 시도한 사용자의 카카오 id이다.
        List<Map<String, String>> lists = v1service.userList(); // DB를 매퍼로 조회하여, 현재 사용자의 정보를 가져온다.
        System.out.println("???" + lists);

        for (Map<String, String> list : lists) { // 사용자 검증을 진행한다.
            String rocMember = list.get("id");
            if (rocMember.equals(who)) {
                return ResponseEntity.ok(list.get("name")); //정상적으로 DB에 있는 사용자이므로 생성된 해쉬를 프론트로 전달한다.
            }
        }
        return ResponseEntity.ok("False"); //DB에 없는 사용자가 로그인을 시도했기에 접근을 차단한다.
    }

    @PostMapping("/getMe") // op가 처음 카카오 로그인 시, DB에 저장된 회원인지 검증한다.
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
}
