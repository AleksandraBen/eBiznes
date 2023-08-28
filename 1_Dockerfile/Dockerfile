# Obraz na bazie Ubuntu 22.04 z Javą 8, Kotlinem i Gradle'em
FROM ubuntu:22.04

ENV TZ=Europe/Warsaw

# Instalacja Javy 8
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk

# Pobranie paczki JDBC SQLite z repozytorium Maven Central
RUN apt-get install -y wget && \
    wget https://repo1.maven.org/maven2/org/xerial/sqlite-jdbc/3.36.0.3/sqlite-jdbc-3.36.0.3.jar -P /app/libs

# Instalacja Kotlina
RUN apt-get install -y curl unzip zip && \
    curl -s https://get.sdkman.io | bash && \
    /bin/bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk install kotlin"

# Instalacja Gradle'a
RUN apt-get install -y wget && \
    wget https://services.gradle.org/distributions/gradle-7.3.3-bin.zip -P /tmp && \
    unzip -d /opt/gradle /tmp/gradle-*.zip && \
    rm -rf /tmp/*

# Ustawienie środowiska dla Gradle'a
ENV GRADLE_HOME=/opt/gradle/gradle-7.3.3
ENV PATH=$PATH:$GRADLE_HOME/bin

# Skopiowanie plików projektu
WORKDIR /app
COPY . /app

# Budowanie projektu przy użyciu Gradle'a
RUN gradle build

# Dodanie przykładu HelloWorld i uruchomienie aplikacji przez CMD i Gradle
CMD ["/opt/gradle/gradle-7.3.3/bin/gradle", "run"]

