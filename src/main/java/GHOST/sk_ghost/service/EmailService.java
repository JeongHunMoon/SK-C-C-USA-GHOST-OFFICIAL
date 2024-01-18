package GHOST.sk_ghost.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.nio.file.Path;

@Service
public class EmailService {
    private final JavaMailSender mailSender; //JavaMailSender 변수 생성
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    public void sendEmailWithAttachment(String to, String subject, String text, Path attachmentPath) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage(); //JavaMailSender에 createMimeMessage() 이용해서 MimeMessage message를 만듬.
        MimeMessageHelper helper = new MimeMessageHelper(message, true); //MimeMessageHelper에 true 속성으로 메일 제목, 본문 등 따로 설정 가능
        helper.setTo(to); //수신자 설정
        helper.setSubject(subject); //메일 제목 설정
        helper.setText(text); //메일 본문 설정
        helper.addAttachment(attachmentPath.getFileName().toString(), attachmentPath.toFile()); // 파일 첨부
        mailSender.send(message); //MimeMessage 통해 메일 전송
    }
}