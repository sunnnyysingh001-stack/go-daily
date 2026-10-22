FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml backend/pom.xml
COPY data data
COPY backend/src backend/src
RUN mvn -B -f backend/pom.xml verify
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/backend/target/go-daily-api-1.0.0.jar app.jar
USER 10001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
