package com.wallet.dto;

import com.wallet.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {
    private Long id;
    private Transaction.TransactionType type;
    private BigDecimal amount;
    private String toEmail;
    private String fromEmail;
    private LocalDateTime timestamp;
}
