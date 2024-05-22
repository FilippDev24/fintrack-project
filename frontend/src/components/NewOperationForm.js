import React, { useState, useEffect } from 'react';

const NewOperationForm = ({ categories, addOperation }) => {
    const [newOperation, setNewOperation] = useState({
        date: '',
        amount: '',
        category: '',
        description: '',
        type: 'income',
        isForecast: false,
    });

    useEffect(() => {
        if (categories.length > 0) {
            setNewOperation(prevState => ({
                ...prevState,
                category: categories[0]._id
            }));
        }
    }, [categories]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewOperation(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
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
            isForecast: false,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Создать новую операцию</h2>
            <input type="date" name="date" value={newOperation.date} onChange={handleInputChange} required />
            <input type="number" name="amount" value={newOperation.amount} onChange={handleInputChange} required />
            <select name="category" value={newOperation.category} onChange={handleInputChange} required>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
            <input type="text" name="description" value={newOperation.description} onChange={handleInputChange} />
            <select name="type" value={newOperation.type} onChange={handleInputChange} required>
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
            </select>
            <label>
                <input
                    type="checkbox"
                    name="isForecast"
                    checked={newOperation.isForecast}
                    onChange={handleInputChange}
                />
                Это прогноз?
            </label>
            <button type="submit">Добавить операцию</button>
        </form>
    );
};

export default NewOperationForm;
