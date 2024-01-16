//package GHOST.sk_ghost.controller;
//
//import GHOST.sk_ghost.service.EmailService;
//import GHOST.sk_ghost.service.V1service;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//
//@Controller
//public class Email {
//    @Autowired
//    private EmailService emailService; // Service 호출을 위한 객체
//    @PostMapping("/emailConfirm")
//    public String emailConfirm(@RequestParam String email) throws Exception {
//
//        String confirm = emailService.sendSimpleMessage(email);
//
//        return confirm;
//    }
//}
