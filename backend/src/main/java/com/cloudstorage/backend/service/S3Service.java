package com.cloudstorage.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PreDestroy;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import java.time.Duration;

import java.io.IOException;
import java.util.UUID;


// Handles all AWS S3 file storage operations (upload, download, delete)
// Similar to how CognitoService handles authentication - this handles file storage
@Service
public class S3Service {

    // AWS credentials and configuration from application.properties
    @Value("${aws.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.secretKey}")
    private String secretKey;

    @Value("${aws.region}")
    private String region;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    // AWS S3 clients - created once, reused for all operations
    private S3Client s3Client;        // Does actual file operations (upload, download, delete)
    private S3Presigner s3Presigner;  // Creates temporary secure URLs that expire after a set time

    // Initialize S3 client with AWS credentials when service is created
    // Lazy initialization - only creates when first needed
    private S3Client getS3Client() {
        if (s3Client == null) {
            AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretKey);
            s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                    .build();
        }
        return s3Client;
    }

    // Creates S3 presigner for generating secure URLs
    // Presigner = creates temporary URLs that expire after set time 
    private S3Presigner getS3Presigner() {
        if (s3Presigner == null) {
            AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretKey);
            s3Presigner = S3Presigner.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                    .build();
        }
        return s3Presigner;
    }

    // Test S3 connectivity
    // Tests if we can connect to AWS S3 bucket
    // Returns true if connection works, false if it fails
    public boolean testConnection() {
        try {
            S3Client client = getS3Client();
            HeadBucketRequest request = HeadBucketRequest.builder()
                    .bucket(bucketName)
                    .build();
            client.headBucket(request);
            return true;
        } catch (Exception e) {
            System.err.println("S3 Connection failed: " + e.getMessage());
            return false;
        }
    }

    // Upload file to S3 and return the S3 key (file path in S3)
    // S3 key format: files/uuid-originalfilename.ext
    // Example: files/123e4567-e89b-12d3-a456-426614174000-document.pdf
    public String uploadFile(MultipartFile file) throws IOException {
        try {
            // Create unique S3 key (to prevent filename conflicts): files/uuid-originalname
            String s3Key = "files/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
            
            S3Client client = getS3Client();
            
            // Build the upload request with file metadata
            // Think of this as: Filling out a detailed form telling AWS 
            // exactly what you want to upload and where!
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)                 // Which S3 bucket to store in
                    .key(s3Key)                         // File path/name in the bucket
                    .contentType(file.getContentType()) // File type: PDF, image, etc.
                    .contentLength(file.getSize())      // File size in bytes
                    .build();

            // Actually upload the file bytes to S3
            client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            
            System.out.println("File uploaded successfully to S3: " + s3Key);
            return s3Key; // Return S3 key to save in database
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to S3: " + e.getMessage(), e);
        }
    }

    // Download a file from S3 by its S3 key
    // Returns file as byte array that can be sent to frontend
    public byte[] downloadFile(String s3Key) {
        try {
            S3Client client = getS3Client();
            
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();

            return client.getObject(getObjectRequest).readAllBytes();
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to download file from S3: " + e.getMessage(), e);
        }
    }

    // Delete a file from S3 by its S3 key
    // Permanent deletion - cannot be undone
    // "touches file" (bytes)
    public void deleteFile(String s3Key) {
        try {
            S3Client client = getS3Client();
            
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();

            client.deleteObject(deleteObjectRequest);
            System.out.println("File deleted from S3: " + s3Key);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from S3: " + e.getMessage(), e);
        }
    }

    // Generate pre-signed URL for secure file download that expires after set time
    // Forces browser to download file (not view it)
    // Used for: Download buttons, API file downloads
    // just generates a url
    public String generateDownloadUrl(String s3Key, String originalFilename, int expirationMinutes) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    // // "attachment" = forces download, doesn't open in browser
                    .responseContentDisposition("attachment; filename=\"" + originalFilename + "\"")
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(expirationMinutes))
                    .getObjectRequest(getObjectRequest)
                    .build();

            return getS3Presigner().presignGetObject(presignRequest).url().toString();
            
        } catch (Exception e) {
            // For production, use monitoring for any S3 failures 
            System.err.println("Failed to generate pre-signed URL: " + e.getMessage());
            throw new RuntimeException("Failed to generate download URL: " + e.getMessage(), e);
        }
    }

    // Generate pre-signed URL for file viewing - that expires after set time
    // Opens file in browser (for images, PDFs, etc.)
    // Used for: File previews, viewing files without downloading
    public String generateViewUrl(String s3Key, String originalFilename, int expirationMinutes) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    // "inline" = opens in browser, doesn't force download
                    .responseContentDisposition("inline; filename=\"" + originalFilename + "\"")
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(expirationMinutes))
                    .getObjectRequest(getObjectRequest)
                    .build();

            return getS3Presigner().presignGetObject(presignRequest).url().toString();
            
        } catch (Exception e) {
            System.err.println("Failed to generate pre-signed view URL: " + e.getMessage());
            throw new RuntimeException("Failed to generate view URL: " + e.getMessage(), e);
        }
    }

    // Cleanup method - closes AWS connections when app shuts down
    // Spring calls this automatically when service is destroyed
    @PreDestroy
    public void cleanup() {
        if (s3Presigner != null) {
            s3Presigner.close();
        }
    }

}