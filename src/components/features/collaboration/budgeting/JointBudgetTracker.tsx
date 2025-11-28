```tsx
import React, { useState, useMemo, useCallback } from 'react';

// --- TYPE DEFINITIONS ---
interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  addedBy: string;
}

interface Category {
  id: string;
  name: string;
  allocated: number;
  expenses: Expense[];
}

interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Contributor';
}

// --- MOCK DATA ---
const mockUsers: User[] = [
  { id: 'user1', name: 'Alex', role: 'Admin' },
  { id: 'user2', name: 'Bailey', role: 'Contributor' },
];

const mockInitialCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Groceries',
    allocated: 500,
    expenses: [
      { id: 'exp1', description: 'Weekly Shopping', amount: 120.50, date: '2023-10-26', addedBy: 'Alex' },
      { id: 'exp2', description: 'Farmer\'s Market', amount: 45.00, date: '2023-10-28', addedBy: 'Bailey' },
    ],
  },
  {
    id: 'cat2',
    name: 'Utilities',
    allocated: 250,
    expenses: [
      { id: 'exp3', description: 'Electricity Bill', amount: 85.75, date: '2023-10-25', addedBy: 'Alex' },
      { id: 'exp4', description: 'Internet', amount: 60.00, date: '2023-10-20', addedBy: 'Alex' },
    ],
  },
  {
    id: 'cat3',
    name: 'Entertainment',
    allocated: 150,
    expenses: [
      { id: 'exp5', description: 'Movie Tickets', amount: 30.00, date: '2023-10-22', addedBy: 'Bailey' },
    ],
  },
  {
    id: 'cat4',
    name: 'Transportation',
    allocated: 200,
    expenses: [],
  },
];

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// --- SUB-COMPONENTS ---

interface ProgressBarProps {
  value: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const color = percentage > 100 ? '#e53e3e' : percentage > 80 ? '#dd6b20' : '#38a169';

  return (
    <div style={styles.progressBarContainer}>
      <div style={{ ...styles.progressBarFill, width: `${Math.min(percentage, 100)}%`, backgroundColor: color }} />
    </div>
  );
};

// --- MAIN COMPONENT ---

const JointBudgetTracker: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockInitialCategories);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showManageCategoryModal, setShowManageCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const budgetSummary = useMemo(() => {
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
    const totalSpent = categories.reduce((sum, cat) => 
      sum + cat.expenses.reduce((expSum, exp) => expSum + exp.amount, 0), 0);
    return { totalAllocated, totalSpent, remaining: totalAllocated - totalSpent };
  }, [categories]);

  const handleAddExpense = useCallback((categoryId: string, newExpense: Omit<Expense, 'id'>) => {
    const expenseWithId = { ...newExpense, id: `exp-${Date.now()}` };
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, expenses: [...cat.expenses, expenseWithId] }
          : cat
      )
    );
    setShowAddExpenseModal(false);
  }, []);
  
  const handleSaveCategory = useCallback((categoryData: { id?: string; name: string; allocated: number }) => {
    if (categoryData.id) { // Editing existing category
      setCategories(prev => prev.map(cat => cat.id === categoryData.id ? { ...cat, name: categoryData.name, allocated: categoryData.allocated } : cat));
    } else { // Adding new category
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: categoryData.name,
        allocated: categoryData.allocated,
        expenses: []
      };
      setCategories(prev => [...prev, newCategory]);
    }
    setShowManageCategoryModal(false);
    setSelectedCategory(null);
  }, []);

  const handleDeleteCategory = useCallback((categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category and all its expenses?')) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  }, []);

  const switchUser = () => {
    setCurrentUser(prevUser => prevUser.id === 'user1' ? mockUsers[1] : mockUsers[0]);
  };

  const getCategorySpent = (category: Category) => {
    return category.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const isAdmin = currentUser.role === 'Admin';

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Joint Budget Tracker</h1>
        <div style={styles.userControls}>
          <span style={styles.currentUserInfo}>
            Logged in as: <strong>{currentUser.name}</strong> ({currentUser.role})
          </span>
          <button onClick={switchUser} style={styles.switchUserButton}>Switch User</button>
        </div>
      </header>

      {/* --- SUMMARY SECTION --- */}
      <section style={styles.summarySection}>
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Total Allocated</h3>
          <p style={styles.summaryValue}>{formatCurrency(budgetSummary.totalAllocated)}</p>
        </div>
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Total Spent</h3>
          <p style={styles.summaryValue}>{formatCurrency(budgetSummary.totalSpent)}</p>
        </div>
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Remaining</h3>
          <p style={{...styles.summaryValue, color: budgetSummary.remaining >= 0 ? '#38a169' : '#e53e3e'}}>
            {formatCurrency(budgetSummary.remaining)}
          </p>
        </div>
      </section>

      {/* --- CONTROLS --- */}
      <div style={styles.controls}>
        <button onClick={() => setShowAddExpenseModal(true)} style={styles.primaryButton}>Add Expense</button>
        {isAdmin && (
            <button onClick={() => { setSelectedCategory(null); setShowManageCategoryModal(true); }} style={styles.secondaryButton}>
            Add Category
            </button>
        )}
      </div>

      {/* --- CATEGORIES LIST --- */}
      <main style={styles.categoriesList}>
        {categories.map(category => {
          const spent = getCategorySpent(category);
          const remaining = category.allocated - spent;
          return (
            <div key={category.id} style={styles.categoryCard}>
              <div style={styles.categoryHeader}>
                <h3 style={styles.categoryName}>{category.name}</h3>
                {isAdmin && (
                  <div style={styles.categoryActions}>
                    <button onClick={() => { setSelectedCategory(category); setShowManageCategoryModal(true); }} style={styles.editButton}>Edit</button>
                    <button onClick={() => handleDeleteCategory(category.id)} style={styles.deleteButton}>Delete</button>
                  </div>
                )}
              </div>
              <div style={styles.categoryBody}>
                <div style={styles.categoryStats}>
                  <span>{formatCurrency(spent)}</span> / <span>{formatCurrency(category.allocated)}</span>
                </div>
                <ProgressBar value={spent} max={category.allocated} />
                <div style={{ ...styles.categoryRemaining, color: remaining >= 0 ? '#4a5568' : '#e53e3e' }}>
                  {formatCurrency(remaining)} {remaining >= 0 ? 'remaining' : 'overspent'}
                </div>
                <h4 style={styles.expenseListTitle}>Recent Expenses:</h4>
                <ul style={styles.expenseList}>
                  {category.expenses.length > 0 ? (
                    category.expenses
                      .slice(0, 3) // Show last 3
                      .map(exp => (
                        <li key={exp.id} style={styles.expenseItem}>
                          <span>{exp.description} ({exp.addedBy})</span>
                          <span>{formatCurrency(exp.amount)}</span>
                        </li>
                      ))
                  ) : (
                    <li style={styles.noExpenseItem}>No expenses yet.</li>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </main>

      {/* --- MODALS --- */}
      {showAddExpenseModal && (
        <AddExpenseModal
          categories={categories}
          currentUser={currentUser}
          onClose={() => setShowAddExpenseModal(false)}
          onSave={handleAddExpense}
        />
      )}
       {showManageCategoryModal && isAdmin && (
        <ManageCategoryModal
          category={selectedCategory}
          onClose={() => {setShowManageCategoryModal(false); setSelectedCategory(null);}}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
};

// --- MODAL COMPONENTS ---

interface AddExpenseModalProps {
  categories: Category[];
  currentUser: User;
  onClose: () => void;
  onSave: (categoryId: string, newExpense: Omit<Expense, 'id'>) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ categories, currentUser, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories.length > 0 ? categories[0].id : '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || !amount || isNaN(parsedAmount) || parsedAmount <= 0 || !categoryId) {
      setError('Please fill all fields with valid values.');
      return;
    }
    onSave(categoryId, {
      description,
      amount: parsedAmount,
      date: new Date().toISOString().split('T')[0],
      addedBy: currentUser.name,
    });
  };

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <h2>Add New Expense</h2>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
              step="0.01"
              min="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={styles.input}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div style={styles.modalActions}>
            <button type="button" onClick={onClose} style={styles.secondaryButton}>Cancel</button>
            <button type="submit" style={styles.primaryButton}>Add Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ManageCategoryModalProps {
    category: Category | null;
    onClose: () => void;
    onSave: (data: { id?: string; name: string; allocated: number }) => void;
}

const ManageCategoryModal: React.FC<ManageCategoryModalProps> = ({ category, onClose, onSave }) => {
    const [name, setName] = useState(category?.name || '');
    const [allocated, setAllocated] = useState(category?.allocated.toString() || '');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAllocated = parseFloat(allocated);
        if (!name || !allocated || isNaN(parsedAllocated) || parsedAllocated < 0) {
            setError('Please fill all fields with valid values.');
            return;
        }
        onSave({ id: category?.id, name, allocated: parsedAllocated });
    };

    return (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContent}>
                <h2>{category ? 'Edit Category' : 'Add New Category'}</h2>
                {error && <p style={styles.errorMessage}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="categoryName">Category Name</label>
                        <input
                            id="categoryName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="allocatedAmount">Allocated Amount</label>
                        <input
                            id="allocatedAmount"
                            type="number"
                            value={allocated}
                            onChange={(e) => setAllocated(e.target.value)}
                            style={styles.input}
                            step="1"
                            min="0"
                        />
                    </div>
                    <div style={styles.modalActions}>
                        <button type="button" onClick={onClose} style={styles.secondaryButton}>Cancel</button>
                        <button type="submit" style={styles.primaryButton}>Save Category</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- STYLES ---
// Using a simple object for styles to keep it self-contained in one file.
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f4f7fa',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '1200px',
    margin: '2rem auto',
    color: '#2d3748',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#1a202c',
  },
  userControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  currentUserInfo: {
    fontSize: '0.9rem',
    color: '#4a5568',
  },
  switchUserButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    backgroundColor: '#e2e8f0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  summarySection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  summaryTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1rem',
    color: '#718096',
    fontWeight: 500,
  },
  summaryValue: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#2d3748',
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  primaryButton: {
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    color: '#2d3748',
    border: '1px solid #cbd5e0',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  categoriesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  categoryHeader: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
  },
  categoryName: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  categoryActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#4299e1',
    fontSize: '0.875rem',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#e53e3e',
    fontSize: '0.875rem',
  },
  categoryBody: {
    padding: '1.5rem',
  },
  categoryStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: '#4a5568',
  },
  progressBarContainer: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: '9999px',
    height: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.3s ease-in-out',
  },
  categoryRemaining: {
    textAlign: 'right',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  expenseListTitle: {
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
    fontSize: '1rem',
    color: '#2d3748',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '0.5rem',
  },
  expenseList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '150px',
    overflowY: 'auto',
  },
  expenseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #edf2f7',
    fontSize: '0.9rem',
  },
  noExpenseItem: {
    color: '#a0aec0',
    padding: '0.5rem 0',
    fontStyle: 'italic',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  modalActions: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
  },
  errorMessage: {
      color: '#e53e3e',
      backgroundColor: '#fed7d7',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #f56565'
  }
};

export default JointBudgetTracker;
```