import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/categories', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      return;
    }

    try {
      if (editingCategory) {
        const response = await axios.put(`http://localhost:5001/api/categories/${editingCategory._id}`, newCategory, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setCategories(categories.map((cat) => (cat._id === editingCategory._id ? response.data : cat)));
        setEditingCategory(null);
      } else {
        const response = await axios.post('http://localhost:5001/api/categories', newCategory, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setCategories([...categories, response.data]);
      }
      setNewCategory({
        name: '',
        description: '',
      });
    } catch (error) {
      console.error('Error creating or updating category:', error);
    }
  };

  const handleEdit = (category) => {
    setNewCategory({
      name: category.name,
      description: category.description,
    });
    setEditingCategory(category);
  };

  const handleDelete = async (categoryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/categories/${categoryId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCategories(categories.filter((cat) => cat._id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div>
      <h1>Categories</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newCategory.name}
          onChange={handleInputChange}
          placeholder="Category Name"
          required
        />
        <input
          type="text"
          name="description"
          value={newCategory.description}
          onChange={handleInputChange}
          placeholder="Category Description"
        />
        <button type="submit">{editingCategory ? 'Update Category' : 'Add Category'}</button>
      </form>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            {category.name}: {category.description}
            {!category.isSystem && (
              <>
                <button onClick={() => handleEdit(category)}>Edit</button>
                <button onClick={() => handleDelete(category._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
