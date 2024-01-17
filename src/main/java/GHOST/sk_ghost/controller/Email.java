//package GHOST.sk_ghost.controller;
//import GHOST.sk_ghost.dto.EmailRequestDto;
//import GHOST.sk_ghost.service.EmailService;
//import lombok.RequiredArgsConstructor;
////import org.hibernate.annotations.Check;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.validation.Valid;
//
//@RestController
//@RequiredArgsConstructor
//public class Email {
//    private final EmailService mailService;
//
//    @PostMapping("/mailSend")
//    public String mailSend(@RequestBody @Valid EmailRequestDto emailDto) {
//        System.out.println("이메일 인증 이메일 :" + emailDto.getEmail());
//        return mailService.joinEmail(emailDto.getEmail());
//    }
//}
