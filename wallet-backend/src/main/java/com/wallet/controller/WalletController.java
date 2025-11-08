package com.wallet.controller;

import com.wallet.config.JwtTokenProvider;
import com.wallet.dto.AddMoneyRequest;
import com.wallet.dto.TransactionDto;
import com.wallet.dto.TransferRequest;
import com.wallet.dto.WalletResponse;
import com.wallet.service.TransactionService;
import com.wallet.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final TransactionService transactionService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/add")
    public ResponseEntity<WalletResponse> addMoney(
            @Valid @RequestBody AddMoneyRequest request,
            @RequestHeader("Authorization") String token) {
        
        Long userId = extractUserIdFromToken(token);
        WalletResponse response = walletService.addMoney(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transfer")
    public ResponseEntity<WalletResponse> transferMoney(
            @Valid @RequestBody TransferRequest request,
            @RequestHeader("Authorization") String token) {
        
        Long userId = extractUserIdFromToken(token);
        WalletResponse response = walletService.transferMoney(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions")
    public ResponseEntity<Page<TransactionDto>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("Authorization") String token) {
        
        Long userId = extractUserIdFromToken(token);
        Page<TransactionDto> transactions = transactionService.getUserTransactions(userId, page, size);
        return ResponseEntity.ok(transactions);
    }

    private Long extractUserIdFromToken(String token) {
        String jwt = token.substring(7); // Remove "Bearer " prefix
        return jwtTokenProvider.extractUserId(jwt);
    }
}
