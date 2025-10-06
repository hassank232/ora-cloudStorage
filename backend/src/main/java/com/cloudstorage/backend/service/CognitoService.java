package com.cloudstorage.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
// AWS SDK classes for Cognito
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;

import java.util.Map;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HashMap;

@Service
public class CognitoService {

    // AWS Cognito configuration - these should come from a.p
    @Value("${aws.cognito.region}")
    private String awsRegion;               // AWS region where your Cognito pool lives

    @Value("${aws.cognito.userPoolId}")
    private String userPoolId;              // Your Cognito User Pool ID 

    @Value("${aws.cognito.clientId}")
    private String clientId;                // Your Cognito App Client ID

    @Value("${aws.cognito.clientSecret}")
    private String clientSecret;            // Your Cognito App Client Secret

    
    // AWS SDK client - handles all API calls to Cognito
    private CognitoIdentityProviderClient client;
    
    // Constructor - Sets up the connection to AWS Cognito (runs after @Value injection)
    @PostConstruct
    public void init() {
        this.client = CognitoIdentityProviderClient.builder()
            .region(Region.of(awsRegion))
            .build();
    }

    // Cognito requires a special hash for authentication - this calculates it
    // This creates the security hash AWS requires for login
    private String calculateSecretHash(String userName) {
        final String HMAC_SHA256 = "HmacSHA256";
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            SecretKeySpec secretKey = new SecretKeySpec(clientSecret.getBytes(), HMAC_SHA256);
            mac.init(secretKey);
            mac.update(userName.getBytes());
            byte[] rawHmac = mac.doFinal(clientId.getBytes());
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating SECRET_HASH", e);
        }
    }
    
    // Creates a new user in Cognito and returns their unique Cognito ID
    public String registerUser(String email, String password, String username){

        // Create the request object that tells Cognito what user to create
        AdminCreateUserRequest request = AdminCreateUserRequest.builder()
            .userPoolId(userPoolId)                    // Which Cognito pool to add user to
            .username(email)                           // Use email as the username
            .temporaryPassword(password)               // Initial password for the account
            .messageAction(MessageActionType.SUPPRESS) // Don't send welcome email (testing)
            .userAttributes(                           // Additional user info for Cognito
                AttributeType.builder()
                    .name("email")
                    .value(email)
                    .build(),
                AttributeType.builder()
                    .name("email_verified") 
                    .value("true")               // Skip email verification for testing
                    .build()
            )
            .build();
        
        // Make the API call to Cognito - create the user in Cognito
        AdminCreateUserResponse response = client.adminCreateUser(request);

        // Make the password permanent (not temporary)
        AdminSetUserPasswordRequest passwordRequest = AdminSetUserPasswordRequest.builder()
            .userPoolId(userPoolId)
            .username(email)
            .password(password)
            .permanent(true)
            .build();
        
        client.adminSetUserPassword(passwordRequest);
        
        // Return the Cognito user ID (we'll store this in our database)
        return response.user().username(); 

    }
    
    // Logs in a user and returns their JWT access token that comes from cognito
    public String loginUser(String email, String password){

        // Cognito requires this special hash for security
        String secretHash = calculateSecretHash(email);
        
        // Build auth (login) parameters including SECRET_HASH
        Map<String, String> authParams = new HashMap<>();
        authParams.put("USERNAME", email);
        authParams.put("PASSWORD", password);
        authParams.put("SECRET_HASH", secretHash); // This is the critical-Required for authentication
        

        // Build the login request
        AdminInitiateAuthRequest request = AdminInitiateAuthRequest.builder()
        .userPoolId(userPoolId)       
        .clientId(clientId)               
        .authFlow(AuthFlowType.ADMIN_NO_SRP_AUTH)  // Simple username/password login
        .authParameters(authParams) 
        .build();
            

        // Make the API call - // Actually log the user in
        AdminInitiateAuthResponse response = client.adminInitiateAuth(request);

        // Return the JWT token (proves the user is logged in)
        return response.authenticationResult().accessToken(); 
    }
    
}
