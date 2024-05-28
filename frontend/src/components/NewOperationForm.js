import React, { useState, useEffect } from 'react';

const NewOperationForm = ({ categories, addOperation }) => {
    const [newOperation, setNewOperation] = useState({
        date: '',
        amount: '',
        category: '',
        description: '',
        type: 'income', // 'income' или 'expense'
        operationType: 'transaction', // 'transaction' или 'forecast'
    });

    useEffect(() => {
        if (categories.length > 0) {
            const defaultCategory = categories.find(cat => cat.defaultFor === 'transaction');
            setNewOperation(prevState => ({
                ...prevState,
                category: defaultCategory ? defaultCategory._id : categories[0]._id
            }));
        }
    }, [categories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOperation(prevState => ({
            ...prevState,
            [name]: value,
        }));

        // Автоматическое изменение категории при выборе типа операции "Прогноз"
        if (name === 'operationType') {
            const defaultCategory = categories.find(cat => cat.defaultFor === value);
            if (defaultCategory) {
                setNewOperation(prevState => ({
                    ...prevState,
                    category: defaultCategory._id
                }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting operation:', newOperation); // Добавлено логирование
        addOperation(newOperation);
        setNewOperation({
            date: '',
            amount: '',
            category: categories.length > 0 ? categories[0]._id : '',
            description: '',
            type: 'income',
            operationType: 'transaction',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Создать новую операцию</h2>
            <select name="operationType" value={newOperation.operationType} onChange={handleInputChange} required>
                <option value="transaction">Транзакция</option>
                <option value="forecast">Прогноз</option>
            </select>
            <input type="date" name="date" value={newOperation.date} onChange={handleInputChange} required placeholder="Дата" />
            <input type="number" name="amount" value={newOperation.amount} onChange={handleInputChange} required placeholder="Сумма" />
            <select name="category" value={newOperation.category} onChange={handleInputChange} required>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
            <input type="text" name="description" value={newOperation.description} onChange={handleInputChange} placeholder="Описание" />
            <select name="type" value={newOperation.type} onChange={handleInputChange} required>
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
            </select>
            <button type="submit">Добавить операцию</button>
        </form>
    );
};

export default NewOperationForm;
