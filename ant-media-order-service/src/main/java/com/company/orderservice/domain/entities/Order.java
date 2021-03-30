package com.company.orderservice.domain.entities;

import lombok.*;

import javax.persistence.*;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
@AllArgsConstructor
@Builder
@Entity(name = "orders")
@Access(AccessType.FIELD)
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_email")
    private String userEmail;
    
    @Column(name = "data_pack")
    private String dataPack;
}
