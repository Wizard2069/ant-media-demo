package com.company.demo.domain.utils.jwt;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {
    
    private String issuer = System.getenv("SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUERURI");
    
    public String getUserId(String token) {
        Jwt jwt = getJwtDecoder().decode(token);
        
        return jwt.getSubject();
    }
    
    public JwtDecoder getJwtDecoder() {
        if (issuer == null) {
            issuer = "http://localhost:8090/auth/realms/demo";
        }
        
        return JwtDecoders.fromIssuerLocation(issuer);
    }
}
