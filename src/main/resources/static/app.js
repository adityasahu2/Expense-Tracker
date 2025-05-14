// API URL Configuration
const API_URL = 'http://localhost:8080/api/expenses';

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmountElement = document.getElementById('total-amount');
const filterCategorySelect = document.getElementById('filter-category');
const clearFiltersButton = document.getElementById('clear-filters');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteButton = document.getElementById('confirm-delete');
const cancelDeleteButton = document.getElementById('cancel-delete');
const cancelUpdateButton = document.getElementById('cancel-update');
const themeToggle = document.getElementById('theme-toggle');
const toastContainer = document.getElementById('toast-container');

// Application State
let expenses = [];
let currentExpenseId = null;
let isEditing = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', initializeApp);

// Event Listeners
expenseForm.addEventListener('submit', handleFormSubmit);
filterCategorySelect.addEventListener('change', filterExpenses);
clearFiltersButton.addEventListener('click', clearFilters);
confirmDeleteButton.addEventListener('click', confirmDelete);
cancelDeleteButton.addEventListener('click', closeDeleteModal);
cancelUpdateButton.addEventListener('click', cancelUpdate);
themeToggle.addEventListener('click', toggleTheme);

// Initialize the application
function initializeApp() {
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
    
    // Initialize theme from localStorage or default to light
    initializeTheme();
    
    // Load expenses from the backend
    fetchExpenses();

    // Add input animations
    addInputAnimations();
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcon(savedTheme);
}

// Toggle between light and dark theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply theme transition
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update the icon
    updateThemeToggleIcon(newTheme);

    // Add animation to the toggle button
    themeToggle.classList.add('theme-toggled');
    setTimeout(() => {
        themeToggle.classList.remove('theme-toggled');
    }, 500);
}

// Update theme toggle icon based on current theme
function updateThemeToggleIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Add animations to form inputs
function addInputAnimations() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

// Fetch all expenses from the backend
async function fetchExpenses() {
    try {
        showLoading();
        
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch expenses');
        
        expenses = await response.json();
        renderExpenses(expenses);
        calculateTotal(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        showError('Failed to load expenses. Please try again later.');
    }
}

// Fetch expenses filtered by category
async function fetchExpensesByCategory(category) {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}/category/${category}`);
        if (!response.ok) throw new Error('Failed to fetch expenses by category');
        
        expenses = await response.json();
        renderExpenses(expenses);
        calculateTotal(expenses);
    } catch (error) {
        console.error('Error fetching expenses by category:', error);
        showError('Failed to load expenses. Please try again later.');
    }
}

// Handle form submission (create or update expense)
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(expenseForm);
    const expenseData = {
        title: formData.get('title'),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        date: formData.get('date'),
        notes: formData.get('notes') || ''
    };
    
    if (isEditing) {
        await updateExpense(currentExpenseId, expenseData);
    } else {
        await createExpense(expenseData);
    }
}

// Create a new expense
async function createExpense(expenseData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });
        
        if (!response.ok) throw new Error('Failed to create expense');
        
        const newExpense = await response.json();
        expenses.unshift(newExpense); // Add to the beginning of the array
        renderExpenses(expenses);
        calculateTotal(expenses);
        expenseForm.reset();
        document.getElementById('date').valueAsDate = new Date();
        
        showToast('Success', 'Expense added successfully!', 'success');
    } catch (error) {
        console.error('Error creating expense:', error);
        showToast('Error', 'Failed to add expense. Please try again.', 'error');
    }
}

// Update an existing expense
async function updateExpense(id, expenseData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });
        
        if (!response.ok) throw new Error('Failed to update expense');
        
        // Update the expense in our local array
        const index = expenses.findIndex(exp => exp.id === id);
        if (index !== -1) {
            expenses[index] = { ...expenses[index], ...expenseData };
        }
        
        // Reset the form and state
        resetFormToAddMode();
        
        // Refresh expenses from the server
        fetchExpenses();
        
        showToast('Success', 'Expense updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating expense:', error);
        showToast('Error', 'Failed to update expense. Please try again.', 'error');
    }
}

// Delete an expense
async function deleteExpense(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete expense');
        
        // Remove from our local array
        expenses = expenses.filter(expense => expense.id !== id);
        renderExpenses(expenses);
        calculateTotal(expenses);
        
        showToast('Success', 'Expense deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting expense:', error);
        showToast('Error', 'Failed to delete expense. Please try again.', 'error');
    }
}

// Filter expenses by category
function filterExpenses() {
    const category = filterCategorySelect.value;
    
    if (category) {
        fetchExpensesByCategory(category);
    } else {
        fetchExpenses();
    }
}

// Clear all filters
function clearFilters() {
    filterCategorySelect.value = '';
    fetchExpenses();
}

// Calculate and display the total amount
function calculateTotal(expenses) {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountElement.innerText = `$${total.toFixed(2)}`;
    
    // Add animation to total when it changes
    totalAmountElement.classList.add('highlight');
    setTimeout(() => {
        totalAmountElement.classList.remove('highlight');
    }, 1000);
}

// Render the list of expenses with animation
function renderExpenses(expenses) {
    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No expenses found. Add your first expense above!</p>
            </div>
        `;
        return;
    }
    
    expenseList.innerHTML = expenses.map((expense, index) => `
        <div class="expense-item category-${expense.category}" style="animation-delay: ${index * 0.05}s">
            <div class="expense-details">
                <h3>${expense.title}</h3>
                <p>
                    <span class="expense-category">${expense.category}</span>
                    <span class="expense-date">
                        <i class="far fa-calendar-alt"></i> ${formatDate(expense.date)}
                    </span>
                </p>
                ${expense.notes ? `<p class="expense-notes">${expense.notes}</p>` : ''}
            </div>
            <div class="expense-info">
                <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                <div class="expense-actions">
                    <button class="edit-btn" onclick="editExpense(${expense.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="showDeleteModal(${expense.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Format date to a more readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Edit an expense
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;
    
    // Fill the form with the expense data
    document.getElementById('title').value = expense.title;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('date').value = expense.date;
    document.getElementById('notes').value = expense.notes || '';
    
    // Change form state
    document.querySelector('.btn-primary').innerHTML = '<i class="fas fa-save"></i> Update Expense';
    document.getElementById('cancel-update').classList.remove('hidden');
    
    // Scroll to the form with smooth behavior
    document.querySelector('.expense-form-container').scrollIntoView({ behavior: 'smooth' });
    
    // Set editing state
    isEditing = true;
    currentExpenseId = id;
}

// Cancel the update operation
function cancelUpdate() {
    resetFormToAddMode();
}

// Reset form to "Add" mode
function resetFormToAddMode() {
    expenseForm.reset();
    document.getElementById('date').valueAsDate = new Date();
    document.querySelector('.btn-primary').innerHTML = '<i class="fas fa-plus"></i> Add Expense';
    document.getElementById('cancel-update').classList.add('hidden');
    isEditing = false;
    currentExpenseId = null;
}

// Show delete confirmation modal with animation
function showDeleteModal(id) {
    currentExpenseId = id;
    deleteModal.style.display = 'flex';
    
    // Add animation
    setTimeout(() => {
        deleteModal.classList.add('show');
    }, 10);
}

// Close delete confirmation modal with animation
function closeDeleteModal() {
    deleteModal.classList.remove('show');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        deleteModal.style.display = 'none';
        currentExpenseId = null;
    }, 300);
}

// Confirm expense deletion
function confirmDelete() {
    if (currentExpenseId) {
        deleteExpense(currentExpenseId);
        closeDeleteModal();
    }
}

// Show toast notification
function showToast(title, message, type = 'success') {
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div class="toast-text">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        </div>
        <button class="close-toast">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to DOM
    toastContainer.appendChild(toast);
    
    // Add close event
    toast.querySelector('.close-toast').addEventListener('click', () => {
        removeToast(toastId);
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        removeToast(toastId);
    }, 4000);
}

// Remove toast from DOM
function removeToast(id) {
    const toast = document.getElementById(id);
    if (toast) {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }
}

// Helper Functions
function showLoading() {
    expenseList.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading expenses...
        </div>
    `;
}

function showError(message) {
    expenseList.innerHTML = `
        <div class="empty-state error">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}