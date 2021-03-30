package com.company.demo.domain.service;

import com.company.demo.domain.entities.Message;
import com.company.demo.domain.repositories.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    
    public Flux<Message> getMessageHistory(String userId, String streamId) {
      return messageRepository.findAllByStreamId(streamId)
          .filter(message -> message.getReplyTo() == null ||
              message.getSender().getId().equals(userId) ||
              message.getReplyTo().getId().equals(userId)
          );
    }
}
