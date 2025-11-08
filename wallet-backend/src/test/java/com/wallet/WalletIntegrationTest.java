package com.wallet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wallet.dto.AddMoneyRequest;
import com.wallet.dto.AuthRequest;
import com.wallet.dto.AuthResponse;
import com.wallet.dto.RegisterRequest;
import com.wallet.dto.TransferRequest;
import com.wallet.dto.UserDto;
import com.wallet.dto.WalletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WalletIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;
    private String userEmail = "test@example.com";

    @BeforeEach
    void setUp() throws Exception {
        // Register a test user
        RegisterRequest registerRequest = new RegisterRequest(
                "Test User",
                userEmail,
                "password123"
        );

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Login and get token
        AuthRequest authRequest = new AuthRequest(userEmail, "password123");
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(response, AuthResponse.class);
        token = authResponse.getToken();
    }

    @Test
    void testAddMoney() throws Exception {
        // Add money
        AddMoneyRequest addRequest = new AddMoneyRequest(new BigDecimal("100.00"));

        MvcResult result = mockMvc.perform(post("/api/wallet/add")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.balance").value(100.00))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        WalletResponse walletResponse = objectMapper.readValue(response, WalletResponse.class);
        
        assertNotNull(walletResponse.getTransactionId());
        assertEquals(new BigDecimal("100.00"), walletResponse.getBalance());
    }

    @Test
    void testTransferMoney() throws Exception {
        // Register recipient
        RegisterRequest recipientRequest = new RegisterRequest(
                "Recipient User",
                "recipient@example.com",
                "password123"
        );

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recipientRequest)))
                .andExpect(status().isOk());

        // Add money to sender
        AddMoneyRequest addRequest = new AddMoneyRequest(new BigDecimal("200.00"));
        mockMvc.perform(post("/api/wallet/add")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addRequest)))
                .andExpect(status().isOk());

        // Transfer money
        TransferRequest transferRequest = new TransferRequest(
                "recipient@example.com",
                new BigDecimal("50.00")
        );

        mockMvc.perform(post("/api/wallet/transfer")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transferRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.balance").value(150.00));
    }

    @Test
    void testInsufficientBalance() throws Exception {
        // Register recipient
        RegisterRequest recipientRequest = new RegisterRequest(
                "Recipient User 2",
                "recipient2@example.com",
                "password123"
        );

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recipientRequest)))
                .andExpect(status().isOk());

        // Try to transfer without sufficient balance
        TransferRequest transferRequest = new TransferRequest(
                "recipient2@example.com",
                new BigDecimal("100.00")
        );

        mockMvc.perform(post("/api/wallet/transfer")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transferRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Insufficient balance"));
    }
}
