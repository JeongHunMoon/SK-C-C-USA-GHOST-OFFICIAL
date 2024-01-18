package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.dto.EmailRequestDto;
import GHOST.sk_ghost.service.EmailService;
import GHOST.sk_ghost.validatior.Validatior;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import jakarta.validation.ValidatorContext;
import jakarta.validation.constraints.NotBlank;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.nio.file.Paths;
@Controller
public class Email {
    private EmailService emailService;
    public Email(EmailService emailService) {
        this.emailService = emailService;
    }
    @GetMapping("/emailAuthTemp")
    public String emailAuthTemp(Model model) {
        return "home/emailAuthTemp";
    }

    @ResponseBody
    @jakarta.validation.constraints.Email(message="잘못된 이메일 형식입니다")
    @NotBlank
    @PostMapping("/emailValidation")
    public String emailValidation(@RequestBody @Valid Validatior validatior) throws MessagingException, UnsupportedEncodingException {
        return "";
    }
    @ResponseBody
    @PostMapping("/sendEmail")
    public String sendEmail(@RequestBody EmailRequestDto emailCheckReq) throws MessagingException, UnsupportedEncodingException {
        String authCode = emailService.sendEmail(emailCheckReq.getEmail());
        return authCode;
    }
}