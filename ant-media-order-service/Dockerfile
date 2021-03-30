FROM openjdk:15-jdk-alpine
ARG JAR_FILE=build/libs/ant-media-order-service-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} order-service.jar
ENTRYPOINT ["java", "-jar", "/order-service.jar"]


