package com.company.demo.domain.utils.filter;

import com.company.demo.domain.entities.Message;

import java.util.Arrays;
import java.util.function.Predicate;

public class MessageUtils {

    private static final String[] dataPacks = {
        "V120", "ST70", "ST90", "ST120"
    };
    
    public static boolean match(Message message) {
        return Arrays.stream(dataPacks).anyMatch(Predicate.isEqual(message.getMsg()));
    }
}
