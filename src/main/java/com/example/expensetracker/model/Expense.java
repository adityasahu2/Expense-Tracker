package com.example.expensetracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {
    private Integer id;
    private String title;
    private BigDecimal amount;
    private String category;
    private LocalDate date;
    private String notes;
}