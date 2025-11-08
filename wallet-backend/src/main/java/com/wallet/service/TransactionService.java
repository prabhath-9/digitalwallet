package com.wallet.service;

import com.wallet.dto.TransactionDto;
import com.wallet.model.Transaction;
import com.wallet.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Page<TransactionDto> getUserTransactions(Long userId, int page, int size) {
        log.debug("Fetching transactions for user: {}, page: {}, size: {}", userId, page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Transaction> transactions = transactionRepository.findByUserIdOrderByTimestampDesc(userId, pageable);
        
        return transactions.map(this::mapToTransactionDto);
    }

    private TransactionDto mapToTransactionDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setType(transaction.getType());
        dto.setAmount(transaction.getAmount());
        dto.setTimestamp(transaction.getTimestamp());
        
        if (transaction.getToUser() != null) {
            if (transaction.getType() == Transaction.TransactionType.SEND) {
                dto.setToEmail(transaction.getToUser().getEmail());
            } else if (transaction.getType() == Transaction.TransactionType.RECEIVE) {
                dto.setFromEmail(transaction.getToUser().getEmail());
            }
        }
        
        return dto;
    }
}
