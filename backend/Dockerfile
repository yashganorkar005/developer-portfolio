FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY backend/pom.xml ./pom.xml
COPY backend/src ./src

RUN mvn -B -DskipTests clean package \
    && JAR_FILE="$(find target -maxdepth 1 -type f -name '*.jar' ! -name '*-sources.jar' | head -n 1)" \
    && test -n "$JAR_FILE" \
    && cp "$JAR_FILE" /app/app.jar

FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd --system --uid 10001 --create-home appuser

RUN mkdir -p /app/portfolio-media /app/resume-storage \
    && chown -R appuser:appuser /app/portfolio-media /app/resume-storage

ENV PORTFOLIO_MEDIA_DIR=/app/portfolio-media

COPY --from=build --chown=appuser:appuser /app/app.jar /app/app.jar

USER appuser

ENV PORT=10000

EXPOSE 10000

ENTRYPOINT ["sh", "-c", "exec java -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-10000} -jar /app/app.jar"]
