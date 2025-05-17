package com.example.expensetracker;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.repository.ExpenseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(ExpenseRepository expenseRepository) {
        return args -> {
            // Add some sample expenses if the database is empty
            // if (expenseRepository.findAll().isEmpty()) {
            //     Expense expense1 = new Expense();
            //     expense1.setTitle("Grocery Shopping");
            //     expense1.setAmount(new BigDecimal("78.50"));
            //     expense1.setCategory("Food");
            //     expense1.setDate(LocalDate.now());
            //     expense1.setNotes("Weekly groceries from Walmart");
            //     expenseRepository.save(expense1);

            //     Expense expense2 = new Expense();
            //     expense2.setTitle("Electric Bill");
            //     expense2.setAmount(new BigDecimal("125.40"));
            //     expense2.setCategory("Utilities");
            //     expense2.setDate(LocalDate.now().minusDays(5));
            //     expense2.setNotes("Monthly electricity payment");
            //     expenseRepository.save(expense2);

            //     Expense expense3 = new Expense();
            //     expense3.setTitle("Movie Tickets");
            //     expense3.setAmount(new BigDecimal("32.00"));
            //     expense3.setCategory("Entertainment");
            //     expense3.setDate(LocalDate.now().minusDays(2));
            //     expense3.setNotes("Weekend movie with friends");
            //     expenseRepository.save(expense3);
            // }
        };
    }
}