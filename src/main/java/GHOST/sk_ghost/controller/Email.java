package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.service.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Paths;

@RestController
public class Email {
    private EmailService emailService;
    public Email(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/send-email")
    public String sendEmail() { //여기서 메일주소를 받아서
        String to = "recipient@example.com"; //여기에 수신자로 설정해준다
        String subject = "Test Email with Attachment";
        String text = "Hello! This is a test email with an attachment.";
        String attachmentPath = "/path/to/your/attachment.file";

        try {
            emailService.sendEmailWithAttachment(to, subject, text, Paths.get(attachmentPath));
            return "Email sent successfully!";
        } catch (Exception e) {
            return "Error sending email: " + e.getMessage();
        }
    }
}