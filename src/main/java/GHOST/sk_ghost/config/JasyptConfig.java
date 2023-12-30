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
        encryptor.setPassword("password"); // 암호화 키 -> 암호화 및 복호화에 사용되는 키.. 실제 운영 환경에서는 이 password 도 가려야 함.
        encryptor.setAlgorithm("PBEWithSHA256And128BitAES-CBC-BC"); // Bouncy Castle 라이브러리에서 제공하는 암호화 알고리즘들 중에서 사용할 알고리즘(PBE~)를 세팅

//        String db_password = "ghost123";
//        String encrypted_db_password = encryptor.encrypt(db_password);
//        System.out.println("Enc = " + encrypted_db_password);

        //테스트 코드 시작 (추후 삭제)
//        String plainText = "ghost123";
//        String encryptedText = encryptor.encrypt(plainText);
//        String decryptedText = encryptor.decrypt(encryptedText);
//        System.out.println("Enc = " + encryptedText);
//        System.out.println("Dec = " + decryptedText);
        //테스트 코드 끝

        return encryptor;
    }


}

