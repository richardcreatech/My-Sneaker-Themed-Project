import { useEffect, useRef, useState } from "react";
import { API_BASE_URL, apiFetch } from "../../../config/api";

const MAX_IMAGES = 6;

function CollectionModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);

  const [images, setImages] = useState([]); // [{ file, preview }]
  const fileInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const res = await apiFetch(`${API_BASE_URL}/categories`);
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        if (!cancelled) setCategories(data.categories ?? data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Revoke object URLs on unmount to avoid leaking memory.
    return () => images.forEach((img) => URL.revokeObjectURL(img.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    setFormError(null);

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setFormError(`You can only add up to ${MAX_IMAGES} images.`);
      e.target.value = "";
      return;
    }

    const accepted = picked.slice(0, room);
    if (picked.length > room) {
      setFormError(
        `Only added ${accepted.length} — the limit is ${MAX_IMAGES} images per collection.`,
      );
    }

    const withPreviews = accepted.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...withPreviews]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setFormError("Give the new category a name first.");
      return;
    }

    setCategorySaving(true);
    setFormError(null);

    try {
      const res = await apiFetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          description: newCategoryDescription.trim() || undefined,
        }),
      });

      const data = await res.json();

      // 201 = created, 409 = already exists — either way we get
      // a usable category and an updated list back.
      if (res.status === 201 || res.status === 409) {
        setCategories(data.categories ?? categories);
        setCategoryId(String(data.category.id));
        setAddingCategory(false);
        setNewCategoryName("");
        setNewCategoryDescription("");
      } else {
        setFormError(data.message || "Couldn't create that category.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Couldn't create that category. Check your connection.");
    } finally {
      setCategorySaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) return setFormError("Name your collection.");
    if (!description.trim()) return setFormError("Add a short description.");
    if (!price) return setFormError("Set a price.");
    if (!categoryId) return setFormError("Pick a category, or add a new one.");
    if (images.length === 0) return setFormError("Add at least one image.");

    setSubmitting(true);

    try {
      const body = new FormData();
      body.append("name", name.trim());
      body.append("description", description.trim());
      body.append("price", price);
      body.append("category_id", categoryId);
      images.forEach((img) => body.append("images", img.file));

      const res = await apiFetch(`${API_BASE_URL}/products`, {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Couldn't create the collection.");
        return;
      }

      onCreated(data.product);
    } catch (err) {
      console.error(err);
      setFormError("Couldn't create the collection. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal_backdrop" onMouseDown={onClose}>
      <div className="modal_panel" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal_header">
          <h2>New collection</h2>
          <button className="modal_close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <form className="modal_form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ridge Canvas Tote"
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this one worth stocking?"
              rows={3}
            />
          </label>

          <label className="field">
            <span>Price</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </label>

          <div className="field">
            <span>Category</span>

            {!addingCategory ? (
              <div className="category_row">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={categoriesLoading}
                >
                  <option value="" disabled>
                    {categoriesLoading ? "Loading…" : "Choose a category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="text_btn"
                  onClick={() => setAddingCategory(true)}
                >
                  New category
                </button>
              </div>
            ) : (
              <div className="new_category_box">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                />
                <input
                  type="text"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Description (optional)"
                />
                <div className="new_category_actions">
                  <button
                    type="button"
                    className="text_btn"
                    onClick={() => setAddingCategory(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="text_btn text_btn_accent"
                    onClick={handleCreateCategory}
                    disabled={categorySaving}
                  >
                    {categorySaving ? "Adding…" : "Add category"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="field">
            <span>
              Images ({images.length}/{MAX_IMAGES})
            </span>

            <div className="image_slots">
              {images.map((img, index) => (
                <div className="image_slot filled" key={img.preview}>
                  <img src={img.preview} alt="" />
                  {index === 0 && <span className="cover_badge">Cover</span>}
                  <button
                    type="button"
                    className="remove_image"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  className="image_slot empty"
                  onClick={() => fileInputRef.current?.click()}
                >
                  + Add
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileSelect}
            />
          </div>

          {formError && <p className="form_error">{formError}</p>}

          <div className="modal_actions">
            <button type="button" className="text_btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="createcollection"
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CollectionModal;
