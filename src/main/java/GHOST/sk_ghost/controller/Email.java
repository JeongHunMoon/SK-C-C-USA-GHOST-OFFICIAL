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

    @ResponseBody
    @PostMapping("/sendEmail")
    public String sendEmail(@RequestBody EmailRequestDto emailCheckReq) throws MessagingException, UnsupportedEncodingException {
        return emailService.sendEmail(emailCheckReq.getEmail());
    }
}