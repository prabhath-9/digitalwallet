package com.wallet.service;

import com.wallet.dto.AddMoneyRequest;
import com.wallet.dto.TransferRequest;
import com.wallet.dto.WalletResponse;
import com.wallet.exception.ApiException;
import com.wallet.model.Transaction;
import com.wallet.model.User;
import com.wallet.repository.TransactionRepository;
import com.wallet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public WalletResponse addMoney(Long userId, AddMoneyRequest request) {
        log.info("Adding {} to user {} balance", request.getAmount(), userId);

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("Amount must be greater than 0");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", 404));

        // Update balance
        BigDecimal newBalance = user.getBalance().add(request.getAmount());
        user.setBalance(newBalance);
        userRepository.save(user);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType(Transaction.TransactionType.ADD);
        transaction.setAmount(request.getAmount());
        Transaction savedTransaction = transactionRepository.save(transaction);

        log.info("Successfully added {} to user {}. New balance: {}. Transaction ID: {}", 
                request.getAmount(), userId, newBalance, savedTransaction.getId());

        return new WalletResponse(true, newBalance, savedTransaction.getId());
    }

    @Transactional
    public WalletResponse transferMoney(Long fromUserId, TransferRequest request) {
        log.info("Transfer request: {} from user {} to {}", 
                request.getAmount(), fromUserId, request.getToEmail());

        // Validate amount
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("Amount must be greater than 0");
        }

        // Get sender
        User fromUser = userRepository.findById(fromUserId)
                .orElseThrow(() -> new ApiException("User not found", 404));

        // Get recipient
        User toUser = userRepository.findByEmail(request.getToEmail())
                .orElseThrow(() -> new ApiException("Recipient not found with email: " + request.getToEmail(), 404));

        // Prevent self-transfer
        if (fromUser.getId().equals(toUser.getId())) {
            throw new ApiException("Cannot transfer to yourself");
        }

        // Check sufficient balance
        if (fromUser.getBalance().compareTo(request.getAmount()) < 0) {
            log.warn("Insufficient balance for user {}. Balance: {}, Required: {}", 
                    fromUserId, fromUser.getBalance(), request.getAmount());
            throw new ApiException("Insufficient balance");
        }

        // Update balances
        fromUser.setBalance(fromUser.getBalance().subtract(request.getAmount()));
        toUser.setBalance(toUser.getBalance().add(request.getAmount()));
        
        userRepository.save(fromUser);
        userRepository.save(toUser);

        // Create SEND transaction for sender
        Transaction sendTransaction = new Transaction();
        sendTransaction.setUser(fromUser);
        sendTransaction.setType(Transaction.TransactionType.SEND);
        sendTransaction.setAmount(request.getAmount());
        sendTransaction.setToUser(toUser);
        Transaction savedSendTransaction = transactionRepository.save(sendTransaction);

        // Create RECEIVE transaction for recipient
        Transaction receiveTransaction = new Transaction();
        receiveTransaction.setUser(toUser);
        receiveTransaction.setType(Transaction.TransactionType.RECEIVE);
        receiveTransaction.setAmount(request.getAmount());
        receiveTransaction.setToUser(fromUser);
        transactionRepository.save(receiveTransaction);

        log.info("Transfer successful. Transaction ID: {}. Sender new balance: {}, Recipient new balance: {}", 
                savedSendTransaction.getId(), fromUser.getBalance(), toUser.getBalance());

        return new WalletResponse(true, fromUser.getBalance(), savedSendTransaction.getId());
    }
}
