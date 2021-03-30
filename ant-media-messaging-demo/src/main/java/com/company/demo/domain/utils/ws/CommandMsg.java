package com.company.demo.domain.utils.ws;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
@RequiredArgsConstructor
public class CommandMsg {
    
    private final String command;
    
    @Override
    public String toString() {
        return "{\"command\": " + "\"" + command + "\"}";
    }
}
