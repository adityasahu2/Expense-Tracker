package com.example.expensetracker.repository;

import com.example.expensetracker.model.Expense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class ExpenseRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Expense> expenseRowMapper = (rs, rowNum) -> {
        Expense expense = new Expense();
        expense.setId(rs.getInt("id"));
        expense.setTitle(rs.getString("title"));
        expense.setAmount(rs.getBigDecimal("amount"));
        expense.setCategory(rs.getString("category"));
        expense.setDate(rs.getDate("date").toLocalDate());
        expense.setNotes(rs.getString("notes"));
        return expense;
    };

    @Autowired
    public ExpenseRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Create operation
    public Expense save(Expense expense) {
        String sql = "INSERT INTO expenses (title, amount, category, date, notes) VALUES (?, ?, ?, ?, ?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, expense.getTitle());
            ps.setBigDecimal(2, expense.getAmount());
            ps.setString(3, expense.getCategory());
            ps.setDate(4, Date.valueOf(expense.getDate()));
            ps.setString(5, expense.getNotes());
            return ps;
        }, keyHolder);
        
        expense.setId(keyHolder.getKey().intValue());
        return expense;
    }

    // Read operations
    public List<Expense> findAll() {
        return jdbcTemplate.query("SELECT * FROM expenses ORDER BY date DESC", expenseRowMapper);
    }

    public Optional<Expense> findById(Integer id) {
        String sql = "SELECT * FROM expenses WHERE id = ?";
        List<Expense> results = jdbcTemplate.query(sql, expenseRowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
    
    public List<Expense> findByCategory(String category) {
        String sql = "SELECT * FROM expenses WHERE category = ? ORDER BY date DESC";
        return jdbcTemplate.query(sql, expenseRowMapper, category);
    }

    // Update operation
    public boolean update(Expense expense) {
        String sql = "UPDATE expenses SET title = ?, amount = ?, category = ?, date = ?, notes = ? WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql,
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                Date.valueOf(expense.getDate()),
                expense.getNotes(),
                expense.getId());
        return rowsAffected > 0;
    }

    // Delete operation
    public boolean deleteById(Integer id) {
        String sql = "DELETE FROM expenses WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }
}