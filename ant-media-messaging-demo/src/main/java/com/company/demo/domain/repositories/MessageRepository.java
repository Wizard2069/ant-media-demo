package com.company.demo.domain.repositories;

import com.company.demo.domain.entities.Message;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface MessageRepository extends ReactiveMongoRepository<Message, ObjectId> {
    
    Flux<Message> findAllByStreamId(String streamId);
}
