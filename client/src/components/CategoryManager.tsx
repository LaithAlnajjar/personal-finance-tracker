import { useState, type FormEvent, type ChangeEvent } from "react";
import { api } from "../lib/api";
import { Trash2, Edit, Check, X, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface EditingState {
  id: string;
  name: string;
}

interface CategoryManagerProps {
  categories: Category[];
  refetchCategories: () => Promise<void>;
}

export default function CategoryManager({
  categories,
  refetchCategories,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<EditingState | null>(
    null
  );

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.post("/api/categories", { name: newCategoryName });
      setNewCategoryName("");
      await refetchCategories();
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      await api.delete(`/api/categories/${id}`);
      await refetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    try {
      await api.put(`/api/categories/${editingCategory.id}`, {
        name: editingCategory.name,
      });
      setEditingCategory(null);
      await refetchCategories();
    } catch (error) {
      console.error("Failed to update category", error);
    }
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, name: e.target.value });
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Manage Categories
      </h2>

      <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="flex-grow text-base p-2 h-10 border border-gray-300 rounded-lg focus:border-primary"
        />
        <button
          type="submit"
          className="flex-shrink-0 flex items-center justify-center gap-2 bg-primary text-white font-medium h-10 px-4 rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Plus size={18} />
          Add
        </button>
      </form>

      <ul className="flex flex-col gap-3">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
          >
            {editingCategory?.id === cat.id ? (
              <>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={handleEditChange}
                  className="text-base p-2 h-10 border border-gray-300 rounded-lg focus:border-primary"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateCategory}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="font-medium text-gray-700">{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setEditingCategory({ id: cat.id, name: cat.name })
                    }
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
