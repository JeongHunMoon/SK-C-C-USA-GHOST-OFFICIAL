package GHOST.sk_ghost.validatior;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class Validatior {

//    회원가입 시 사용 가능
//    @NotBlank
//    @Pattern(message = "잘못된 아이디 형식입니다."
//            , regexp = "^[a-z0-9_-]{3,10}")
//    private String userId;
//
//    @NotBlank
//    @Pattern(message = "잘못된 비밀번호 형식입니다."
//            , regexp = "^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!%*#?&])[A-Za-z[0-9]$@$!%*#?&]{8,15}")
//    private String password;

//    @NotBlank
//    @Email(message = "잘못된 이메일 형식입니다.")
//    @Pattern(message = "사내 메일이 아닙니다."
//            , regexp = "@(skccus\\.com|partner\\.sk\\.com)$")
//    private String email;
}