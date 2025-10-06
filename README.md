Ora - Cloud Storage Manager

Full-stack cloud storage application deployed on AWS with secure file management and user authentication.

🔗 Live Demo: http://

Demo Video: [Coming Soon]

Availability: Tuesday-Thursday during active deployment period

Description
Cloud Storage Manager is a secure, full-stack web application that enables users to store, manage, and organize files in the cloud. Built with modern technologies and deployed on AWS infrastructure, it demonstrates enterprise-level architecture patterns and cloud-native development practices.

The application handles user authentication, file uploads/downloads, and metadata management while maintaining security best practices throughout the stack.

Features
    Secure Authentication - User registration and login via AWS Cognito
    File Upload - Upload files directly to AWS S3
    File Download - Secure file retrieval using pre-signed URLs
    File Management - Rename and delete files
    File Preview - In-browser preview for images and PDFs
    Metadata Tracking - View file size, upload date, and type
    Responsive Design - Works seamlessly on desktop and mobile devices

Tech Stack

| Category        |         Technology |
|-----------------|--------------------|
| Frontend        | React, Vite, Tailwind CSS |
| Backend         | Spring Boot, Java, Spring Security, Maven |
| Database        | PostgreSQL (AWS RDS) |
| Storage         | AWS S3 |
| Auth            | AWS Cognito |
| Infrastructure  | AWS EC2, Nginx, systemd, AWS Parameter Store, IAM Roles |
| & DevOps 

Architecture

            ┌─────────────────────────────────────────┐
            │           AWS EC2 Instance              │
            │                                         │
            │  ┌─────────────────────────────────┐   │
            │  │   systemd (Service Manager)     │   │
            │  │                                 │   │
            │  │   ├─ Nginx (Port 80)           │   │
            │  │   └─ Spring Boot (Port 8080)   │   │
            │  └─────────────────────────────────┘   │
            └─────────────────────────────────────────┘
                                │
                    User Request (Port 80)
                                ↓
                        Nginx Web Server
                                │
                    ┌───────────┴───────────┐
                    ↓                       ↓
              Static Files            Reverse Proxy
            (React Frontend)         (/api/* requests)
                                            ↓
                                    Spring-Boot Backend
                                       (Port 8080)
                                            │
                      ┌─────────────────────┼─────────────────────┐
                      ↓                     ↓                     ↓
              AWS RDS PostgreSQL       AWS S3 Bucket         AWS Cognito
            (User & File Metadata)     (File Storage)        (Authentication)


Request Flow
    User accesses application
    Nginx serves React static files for the frontend
    API calls to /api/* are proxied to Spring Boot backend (port 8080)
    Backend authenticates requests with AWS Cognito
    File metadata stored in RDS PostgreSQL
    Actual files stored in AWS S3
    All AWS credentials managed via Parameter Store and IAM roles

Demo & Screenshots

Live Application
Visit: http://

NOTE: The application runs Tuesday-Thursday during active deployment. If offline, please check back or watch the demo video.

Demo Video
Watch Full Demo Video:

The video demonstrates:
    User signup and authentication
    File upload to S3
    File management (download, rename, delete)
    File preview functionality
    AWS infrastructure overview

Screenshots
Login Page: 

Dashboard with Files: 

File Upload: 


Security Highlights
    This application implements enterprise-level security practices:
    No Hardcoded Credentials - All secrets stored in AWS Parameter Store
    IAM Role-Based Access - EC2 instance uses IAM roles to access AWS services
    Secure Authentication - JWT tokens via AWS Cognito
    Input Validation - Server-side validation for all user inputs
    SQL Injection Prevention - Parameterized queries with JPA
    File Access Control - Pre-signed URLs for secure S3 access
    CORS Configuration - Restricted to allowed origins only
    Password Security - Handled by AWS Cognito with industry standards

What I Learned
    Deployed production applications on AWS (EC2, RDS, S3, Cognito, Parameter Store, IAM)
    Built RESTful APIs with Spring Boot and JWT authentication
    Configured Nginx as reverse proxy and systemd for service management
    Designed database schemas with JPA/Hibernate and PostgreSQL
    Implemented secure file storage with S3 pre-signed URLs
    Managed secrets with AWS Parameter Store instead of hardcoding credentials
    Created responsive frontends with React and Tailwind CSS
    Deployed full-stack applications with proper separation of concerns


Future Enhancements
    Image Thumbnails - Auto-generate thumbnails with AWS Lambda
    Virus Scanning - Malware detection for uploads
    Email Notifications - AWS SNS/SES for upload confirmations
    Multi-Factor Authentication (MFA) - AWS Cognito MFA with email/SMS verification
    CloudFront CDN - Faster file delivery globally
    API Gateway - API management and throttling
    CloudWatch - Advanced logging and monitoring
    HTTPS Support - Add SSL/TLS with Let's Encrypt
    File Sharing - Generate shareable links with expiration
    Search Functionality - Search files by name, type, or date
    Folder Organization - Create and manage folder structures
    CI/CD Pipeline - Automated testing and deployment


Contact:

Your Name
    Email: 
    LinkedIn: 
    Portfolio: 
    GitHub: 