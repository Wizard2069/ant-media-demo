package com.company.demo.domain.common;

import lombok.*;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
@AllArgsConstructor
@Builder
public class User {
    
    private String id;
    
    private String name;
    
    private String email;
    
    private String avatar;
}
