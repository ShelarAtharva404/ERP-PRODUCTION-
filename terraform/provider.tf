terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
  
  # Recommended: Add remote backend configuration here for production
  # backend "s3" {
  #   bucket         = "my-terraform-state"
  #   key            = "erp/terraform.tfstate"
  #   region         = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region
}

# Configure the Kubernetes provider using EKS cluster details
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    # This requires the awscli to be installed locally where Terraform is executed
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}
