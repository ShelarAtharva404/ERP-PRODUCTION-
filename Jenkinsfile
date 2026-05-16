pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = credentials('aws-account-id')
        AWS_REGION     = 'us-east-1'
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        FRONTEND_REPO  = 'erp-frontend'
        BACKEND_REPO   = 'erp-backend'
        CLUSTER_NAME   = 'erp-production-cluster'
        // Create an AWS credentials binding in Jenkins named 'aws-credentials'
        // that contains your AWS Access Key ID and Secret Access Key
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('AWS Authentication') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                    // Update kubeconfig for the EKS cluster
                    sh "aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME}"
                }
            }
        }

        stage('Build & Push Backend Image') {
            steps {
                script {
                    def backendImage = docker.build("${ECR_REGISTRY}/${BACKEND_REPO}:${env.BUILD_ID}", "./Backend")
                    backendImage.push()
                    backendImage.push('latest')
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                script {
                    def frontendImage = docker.build("${ECR_REGISTRY}/${FRONTEND_REPO}:${env.BUILD_ID}", "./Frontend")
                    frontendImage.push()
                    frontendImage.push('latest')
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    // Update the image tag in the Kubernetes manifests
                    sh "sed -i 's|<ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/erp-backend:latest|${ECR_REGISTRY}/${BACKEND_REPO}:${env.BUILD_ID}|g' k8s/backend.yaml"
                    sh "sed -i 's|<ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/erp-frontend:latest|${ECR_REGISTRY}/${FRONTEND_REPO}:${env.BUILD_ID}|g' k8s/frontend.yaml"
                    
                    // Apply the manifests
                    sh "kubectl apply -f k8s/backend.yaml"
                    sh "kubectl apply -f k8s/frontend.yaml"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            sh "docker logout ${ECR_REGISTRY} || true"
        }
        success {
            echo "Pipeline completed successfully."
        }
        failure {
            echo "Pipeline failed."
        }
    }
}
