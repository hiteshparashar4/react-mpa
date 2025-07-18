pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'hitesh482/react-mpa-app'
        KUBECONFIG = '/home/ubuntu/.kube/config'
    }

    stages {

        stage('Get Commit SHA') {
            steps {
                script {
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    env.DEPLOY_IMAGE = "${env.DOCKER_IMAGE}:${env.IMAGE_TAG}"
                    echo "Resolved image tag: ${env.DEPLOY_IMAGE}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${env.DEPLOY_IMAGE} .
                    docker tag ${env.DEPLOY_IMAGE} ${env.DOCKER_IMAGE}:latest
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
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${env.DEPLOY_IMAGE}
                        docker push ${env.DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Patch and Deploy to Kubernetes') {
            steps {
                script {
                    def inputFile = 'deploy/deployment.yaml'
                    def outputFile = 'deploy/deployment.processed.yaml'

                    sh """
                        sed 's|\\$DEPLOY_IMAGE|${env.DEPLOY_IMAGE}|' ${inputFile} > ${outputFile}
                        cat ${outputFile}
                        kubectl apply -f ${outputFile} --kubeconfig=${KUBECONFIG}
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
        always {
            cleanWs()
        }
    }
}
