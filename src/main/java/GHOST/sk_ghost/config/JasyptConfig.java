package GHOST.sk_ghost.config;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableEncryptableProperties
public class JasyptConfig {

    @Bean("jasyptEncryptor")
    public StringEncryptor stringEncryptor() {
        //PooledPBEStringEncryptor를 생성하고 설정
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        encryptor.setProvider(new BouncyCastleProvider()); //Bouncy Castle 라이브러리에서 제공하는 암호화 알고리즘들을 생성하여 암호화에 적용
        encryptor.setPoolSize(2); // 암호화 및 복호화 작업을 수행하는 데 사용하는 스레드 풀의 크기(2를 권장)
        encryptor.setPassword("password"); // 암호화 키 -> 암호화 및 복호화에 사용되는 키.. 실제 운영 환경에서는 이 password 도 가려야 함. (추후 txt파일에서 불러오기)
        encryptor.setAlgorithm("PBEWithSHA256And128BitAES-CBC-BC"); // Bouncy Castle 라이브러리에서 제공하는 암호화 알고리즘들 중에서 사용할 알고리즘(PBE~)를 세팅

//      실제 암호화 수행
//      주의 : 암호화 수행 시 암호화된 코드가 변경되므로 동일 텍스트에 대해 두번수행하지 않도록 해야 합니다
//      String db_text = "123"; //123은 암호화하고자 하는 문자열 예시
//      String encrypted_db_text = encryptor.encrypt(db_text);
//      System.out.println("Enc = " + encrypted_db_text);
//
//      암호화한 db_text 복호화 및 정상출력 확인
//      String decryptedText = encryptor.decrypt(encrypted_db_text);
//      System.out.println("Dec = " + decryptedText);


        return encryptor;
    }


}

