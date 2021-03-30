package com.company.demo.domain.entities;

import com.company.demo.domain.common.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.AccessType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
@AllArgsConstructor
@Builder
@Document(collection = "user_messages")
@AccessType(AccessType.Type.FIELD)
public class Message {
    
    @Id
    @JsonSerialize(using= ToStringSerializer.class)
    private ObjectId id;
    
    private String streamId;
    
    private User sender;
    
    private String msg;
    
    private String time;
    
    private User replyTo;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String ip;
}
