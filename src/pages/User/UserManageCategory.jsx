import React, { useState, useEffect } from 'react';
import '../../styles/UserManageCategory.css';

// Giả lập dữ liệu category và rượu
const initialCategoriesData = [
    { id: 1, name: 'Red Wine', wines: ['Cabernet Sauvignon', 'Merlot'] },
    { id: 2, name: 'White Wine', wines: ['Chardonnay', 'Sauvignon Blanc'] },
];

const UserManageCategory = () => {
    const [categories, setCategories] = useState(initialCategoriesData);
    const [selectedWines, setSelectedWines] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    useEffect(() => {
        // Giả lập việc lấy dữ liệu từ API
        setCategories(initialCategoriesData);
    }, []);

    const handleCategoryClick = (wines) => {
        setSelectedWines(wines);
    };

    const handleAddCategory = () => {
        if (newCategoryName) {
            const newCategory = {
                id: categories.length + 1,
                name: newCategoryName,
                wines: [],
            };
            setCategories([...categories, newCategory]);
            setNewCategoryName('');
        }
    };

    const handleEditCategory = (id) => {
        const category = categories.find(cat => cat.id === id);
        setNewCategoryName(category.name);
        setEditingCategoryId(id);
    };

    const handleUpdateCategory = () => {
        setCategories(categories.map(cat =>
            cat.id === editingCategoryId ? { ...cat, name: newCategoryName } : cat
        ));
        setNewCategoryName('');
        setEditingCategoryId(null);
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa category này?")) {
            setCategories(categories.filter(cat => cat.id !== id));
            if (selectedWines.length > 0) setSelectedWines([]);
        }
    };

    return (
        <div className="user-manage-category">
            <h1>User Manage Category</h1>
            <h2>Categories</h2>
            <ul>
                {categories.map(category => (
                    <li key={category.id} onClick={() => handleCategoryClick(category.wines)}>
                        {category.name}
                        <div className="button-group">
                            <button onClick={() => handleEditCategory(category.id)}>Edit</button>
                            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name"
            />
            {editingCategoryId ? (
                <button className="add-update-button" onClick={handleUpdateCategory}>Update Category</button>
            ) : (
                <button onClick={handleAddCategory}>Add Category</button>
            )}
            {selectedWines.length > 0 && (
                <div>
                    <h2>Wines in Selected Category</h2>
                    <ul>
                        {selectedWines.map((wine, index) => (
                            <li key={index}>{wine}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserManageCategory;
