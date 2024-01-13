pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://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@github.com/HtetLinMaung/webwand.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    app = docker.build("htetlinmaung/webwand:jenkins-build")
                }
            }
        }
        stage('Push to Docker Registry') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-registry-credentials') {
                        app.push("htetlinmaung/webwand")
                        app.push("jenkins-build")
                    }
                }
            }
        }
        stage('Deploy to VM') {
            steps {
                sshagent(credentials: ['databasevm-ssh-credential-id']) {
                    sh 'ssh mit@172.188.59.224 "cd webwand && docker-compose down && docker-compose up -d"'
                }
            }
        }
    }
}