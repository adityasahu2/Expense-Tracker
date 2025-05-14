package com.example.expensetracker.controller;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // CREATE - Add a new expense
    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Expense savedExpense = expenseService.createExpense(expense);
        return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
    }

    // READ - Get all expenses
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    // READ - Get a specific expense by ID
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Integer id) {
        Optional<Expense> expense = expenseService.getExpenseById(id);
        return expense
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // READ - Get expenses by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(@PathVariable String category) {
        List<Expense> expenses = expenseService.getExpensesByCategory(category);
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    // UPDATE - Update an existing expense
    @PutMapping("/{id}")
    public ResponseEntity<String> updateExpense(@PathVariable Integer id, @RequestBody Expense expenseDetails) {
        boolean updated = expenseService.updateExpense(id, expenseDetails);
        
        if (updated) {
            return new ResponseEntity<>("Expense updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Expense not found", HttpStatus.NOT_FOUND);
        }
    }

    // DELETE - Delete an expense
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Integer id) {
        boolean deleted = expenseService.deleteExpense(id);
        
        if (deleted) {
            return new ResponseEntity<>("Expense deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Expense not found", HttpStatus.NOT_FOUND);
        }
    }
}