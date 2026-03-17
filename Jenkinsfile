pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker compose build --no-cache'
            }
        }

        stage('Stop Old Containers') {
            steps {
                echo 'Stopping old containers...'
                sh 'docker compose down || true'
            }
        }

        stage('Start Containers') {
            steps {
                echo 'Starting containers with Docker Compose...'
                sh 'docker compose up -d'
            }
        }

        stage('Wait for Services') {
            steps {
                echo 'Waiting for services to be ready...'
                sh '''
                    echo "Waiting for backend..."
                    for i in $(seq 1 30); do
                        if curl -s http://localhost:3001/api/health | grep -q "ok"; then
                            echo "Backend is ready!"
                            break
                        fi
                        echo "Attempt $i: Backend not ready yet..."
                        sleep 2
                    done
                '''
            }
        }

        stage('Run Integration Tests') {
            steps {
                echo 'Running integration tests...'
                sh '''
                    echo "=== Test 1: Health Check ==="
                    curl -f http://localhost:3001/api/health

                    echo ""
                    echo "=== Test 2: POST a message ==="
                    curl -f -X POST http://localhost:3001/api/messages \
                        -H "Content-Type: application/json" \
                        -d '{"content": "Jenkins CI test message"}'

                    echo ""
                    echo "=== Test 3: GET messages ==="
                    curl -f http://localhost:3001/api/messages

                    echo ""
                    echo "=== Test 4: Frontend accessible ==="
                    curl -f http://localhost:3000

                    echo ""
                    echo "All integration tests passed!"
                '''
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed! Check the logs above.'
            sh 'docker compose logs'
        }
        success {
            echo 'Pipeline succeeded! App is live.'
        }
    }
}
