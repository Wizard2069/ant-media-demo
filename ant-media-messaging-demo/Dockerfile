FROM openjdk:15-jdk-alpine
ARG JAR_FILE=build/libs/demo-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} messaging-service.jar
ENTRYPOINT ["java", "-jar", "/messaging-service.jar"]


