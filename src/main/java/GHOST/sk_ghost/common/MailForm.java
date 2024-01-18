//import GHOST.sk_ghost.common.CertificationNumber;
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.MimeMessage;// 메일 양식 작성
//import org.springframework.mail.javamail.JavaMailSender;
//
//import java.io.UnsupportedEncodingException;
//
//public MimeMessage MailForm(String email) throws MessagingException, UnsupportedEncodingException {
//
//    String authNum = CertificationNumber.getAuthNum(); // 인증번호 생성
//    String setFrom = "hostserviceteam.official@gmail.com";	// 보내는 사람
//    String toEmail = email;		    // 받는 사람 (받아온 값)
//    String title = "인증번호 테스트";   // 메일 제목
//
//    JavaMailSender mailSender = "";
//    MimeMessage message = mailSender.createMimeMessage();
//
//    message.addRecipients(MimeMessage.RecipientType.TO, toEmail);	// 받는 사람 설정
//    message.setSubject(title);		// 제목 설정
//
//    // 메일 내용 설정
//    String msgOfEmail="";
//    msgOfEmail += "<div style='margin:20px;'>";
//    msgOfEmail += "<h1> 안녕하세요 Team Ghost 입니다. </h1>";
//    msgOfEmail += "<br>";
//    msgOfEmail += "<p>아래 코드를 서비스 창에 입력해주세요<p>";
//    msgOfEmail += "<br>";
//    msgOfEmail += "<p>감사합니다.<p>";
//    msgOfEmail += "<br>";
//    msgOfEmail += "<div align='center' style='border:1px solid black; font-family:verdana';>";
//    msgOfEmail += "<h3 style='color:blue;'>회원가입 인증 코드 : </h3>";
//    msgOfEmail += "<div style='font-size:130%'>";
//    msgOfEmail += "CODE : <strong>";
//    msgOfEmail += authNum + "</strong><div><br/> ";
//    msgOfEmail += "</div>";
//
//    message.setFrom(setFrom);		// 보내는 사람 설정
//    // 위 String으로 받은 내용을 아래에 넣어 내용을 설정합니다.
//    message.setText(msgOfEmail, "utf-8", "html");
//
//    return message;
//}