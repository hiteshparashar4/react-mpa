pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'hitesh482/react-mpa-app'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
        IMAGE_TAG = ''
        DEPLOY_YAML_PATH = 'deploy/deployment.yaml'
        PROCESSED_YAML_PATH = 'deploy/deployment.processed.yaml'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Get Commit SHA') {
            steps {
                script {
                    IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.IMAGE_TAG = IMAGE_TAG
                    echo "Resolved image tag: ${DOCKER_IMAGE}:${IMAGE_TAG}"
                }
            }
        }

        stage('Install Dependencies & Build') {
            steps {
                sh "npm ci"
                sh "npm run build"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Patch Deployment YAML') {
            steps {
                script {
                    def content = readFile("${DEPLOY_YAML_PATH}")
                    def patched = content.replace('image: $DEPLOY_IMAGE', "image: ${DOCKER_IMAGE}:${IMAGE_TAG}")
                    writeFile(file: "${PROCESSED_YAML_PATH}", text: patched)
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -n cicd -f ${PROCESSED_YAML_PATH} --kubeconfig=${KUBECONFIG}"
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
        always {
            echo '🧹 Cleaning workspace...'
            deleteDir()
        }
    }
}
