# Etapa 1: Construir el JAR con Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar el pom.xml y descargar dependencias (caché)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el resto del proyecto y construir
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final con Java 21
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copiar el JAR generado
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar"]
