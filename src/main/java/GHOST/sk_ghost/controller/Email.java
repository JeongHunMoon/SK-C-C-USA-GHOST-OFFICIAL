package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.dto.loginDto.EmailRequestDto;
import GHOST.sk_ghost.service.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.io.UnsupportedEncodingException;

@Controller
public class Email {
    private EmailService emailService;
    public Email(EmailService emailService) {
        this.emailService = emailService;
    }

    // 이메일 전송 라우터.
    @ResponseBody
    @PostMapping("/sendEmail")
    public String sendEmail(@RequestBody EmailRequestDto emailCheckReq) throws MessagingException, UnsupportedEncodingException {
        return emailService.sendEmail(emailCheckReq.getEmail());
    }
}