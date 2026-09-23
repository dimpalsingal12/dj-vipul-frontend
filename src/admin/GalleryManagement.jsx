import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GalleryManagement.css";

function GalleryManagement() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("events");
  const [uploading, setUploading] = useState(false);

  const [editCategory, setEditCategory] = useState("events");
  const [editing, setEditing] = useState(false);

  const [deleting, setDeleting] = useState(false);

  // --------------------------------
  // HERO IMAGE
  // --------------------------------

  const [heroImage, setHeroImage] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [heroUploading, setHeroUploading] = useState(false);

  // --------------------------------
  // FETCH GALLERY
  // --------------------------------

  const fetchGallery = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gallery`
      );

      const data = await response.json();

      if (response.ok) {
        setGallery(data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // FETCH HERO IMAGE
  // --------------------------------

  const fetchHeroImage = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/hero`
      );

      const data = await response.json();

      if (response.ok && data) {
        setHeroImage(data);
      }
    } catch (error) {
      console.error("Error fetching hero image:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
    fetchHeroImage();
  }, []);

  // --------------------------------
  // HERO FILE CHANGE
  // --------------------------------

  const handleHeroFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file.");
      return;
    }

    setHeroFile(file);
  };

  // --------------------------------
  // UPLOAD / CHANGE HERO IMAGE
  // --------------------------------

  const uploadHeroImage = async () => {
    if (!heroFile) return;

    setHeroUploading(true);

    try {
      const formData = new FormData();

      formData.append("heroImage", heroFile);

      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/hero/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Hero image upload failed"
        );
      }

      setHeroImage(data.heroImage);
      setHeroFile(null);

    } catch (error) {
      console.error("Hero image upload error:", error);
    } finally {
      setHeroUploading(false);
    }
  };

  // --------------------------------
  // CATEGORY ITEMS
  // --------------------------------

  const getItems = (category) => {
    return gallery
      .filter((item) => item.category === category)
      .sort((a, b) => a.order - b.order);
  };

  // --------------------------------
  // MOVE UP / DOWN
  // --------------------------------

  const moveItem = (category, index, direction) => {
    const categoryItems = getItems(category);

    if (direction === "up" && index === 0) {
      return;
    }

    if (
      direction === "down" &&
      index === categoryItems.length - 1
    ) {
      return;
    }

    const newItems = [...categoryItems];

    if (direction === "up") {
      [newItems[index - 1], newItems[index]] = [
        newItems[index],
        newItems[index - 1],
      ];
    }

    if (direction === "down") {
      [newItems[index], newItems[index + 1]] = [
        newItems[index + 1],
        newItems[index],
      ];
    }

    const updatedItems = newItems.map(
      (item, newIndex) => ({
        ...item,
        order: newIndex + 1,
      })
    );

    const otherItems = gallery.filter(
      (item) => item.category !== category
    );

    setGallery([
      ...otherItems,
      ...updatedItems,
    ]);

    setSaved(false);
  };

  // --------------------------------
  // SAVE ORDER
  // --------------------------------

  const saveOrder = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const items = gallery.map((item) => ({
        id: item._id,
        order: item.order,
      }));

      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gallery/order/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ items }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save order");
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // ADD MEDIA
  // --------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const uploadMedia = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("media", selectedFile);
      formData.append("category", uploadCategory);

      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gallery/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Upload failed"
        );
      }

      setGallery((prev) => [
        ...prev,
        data.galleryItem,
      ]);

      setSelectedFile(null);
      setUploadCategory("events");
      setShowAddModal(false);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // --------------------------------
  // EDIT
  // --------------------------------

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditCategory(item.category);
    setShowEditModal(true);
  };

  const updateCategory = async () => {
    if (!selectedItem) return;

    setEditing(true);

    try {
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gallery/${selectedItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            category: editCategory,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Update failed"
        );
      }

      setGallery((prev) =>
        prev.map((item) =>
          item._id === selectedItem._id
            ? data.galleryItem
            : item
        )
      );

      setShowEditModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setEditing(false);
    }
  };

  // --------------------------------
  // DELETE
  // --------------------------------

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const deleteMedia = async () => {
    if (!selectedItem) return;

    setDeleting(true);

    try {
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gallery/${selectedItem._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Delete failed"
        );
      }

      setGallery((prev) =>
        prev.filter(
          (item) =>
            item._id !== selectedItem._id
        )
      );

      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  // --------------------------------
  // MEDIA PREVIEW
  // --------------------------------

  const renderMedia = (item) => {
    if (item.mediaType === "video") {
      return (
        <video
          src={item.mediaUrl}
          controls
          preload="metadata"
        />
      );
    }

    return (
      <img
        src={item.mediaUrl}
        alt="Gallery"
      />
    );
  };

  // --------------------------------
  // GALLERY SECTION
  // --------------------------------

  const renderSection = (title, category) => {
    const items = getItems(category);

    return (
      <section className="gallery-management-section">

        <div className="gallery-management-title">

          <div>
            <span>GALLERY</span>
            <h2>{title}</h2>
          </div>

          <small>
            {items.length} items
          </small>

        </div>

        <div className="admin-gallery-grid">

          {items.map((item, index) => (
            <div
              className="admin-gallery-card"
              key={item._id}
            >

              <div className="admin-media">

                {renderMedia(item)}

                <div className="media-position">
                  {index + 1}
                </div>

              </div>

              <div className="admin-gallery-info">

                <span>
                  {item.mediaType === "video"
                    ? "VIDEO"
                    : "PHOTO"}
                </span>

                <div className="card-actions">

                  <div className="order-controls">

                    <button
                      title="Move Up"
                      disabled={index === 0}
                      onClick={() =>
                        moveItem(
                          category,
                          index,
                          "up"
                        )
                      }
                    >
                      ↑
                    </button>

                    <button
                      title="Move Down"
                      disabled={
                        index === items.length - 1
                      }
                      onClick={() =>
                        moveItem(
                          category,
                          index,
                          "down"
                        )
                      }
                    >
                      ↓
                    </button>

                  </div>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      openEditModal(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      openDeleteModal(item)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>
    );
  };

  return (
    <div className="gallery-management">

      {/* =========================
          HEADER
      ========================= */}

      <header className="gallery-management-header">

        <Link
          to="/admin"
          className="back-dashboard"
        >
          ← Back to Dashboard
        </Link>

        <div>

          <span>ADMIN PANEL</span>

          <h1>Gallery Management</h1>

          <p>
            Manage photos, videos and gallery
            arrangement.
          </p>

        </div>

        <button
          className="add-media-btn"
          onClick={() => {
            setSelectedFile(null);
            setShowAddModal(true);
          }}
        >
          + Add Media
        </button>

      </header>


      {/* =========================
          HERO IMAGE MANAGEMENT
      ========================= */}

      <section className="gallery-management-section">

        <div className="gallery-management-title">

          <div>
            <span>HOME PAGE</span>
            <h2>Hero Image</h2>
          </div>

          <small>
            Background Image
          </small>

        </div>

        <div className="hero-management-box">

          <div className="hero-management-preview">

            {heroImage ? (
              <img
                src={heroImage.imageUrl}
                alt="Current Hero"
              />
            ) : (
              <div className="hero-default-preview">
                <img
                  src="/src/assets/djvipul-hero.jpeg"
                  alt="Default Hero"
                />
              </div>
            )}

          </div>

          <div className="hero-management-info">

            <span>HERO IMAGE</span>

            <h3>
              Current Home Page Background
            </h3>

            <p>
              This image is displayed as the
              background of the main Home page
              hero section.
            </p>

            <label className="file-upload hero-file-upload">

              <input
                type="file"
                accept="image/*"
                onChange={handleHeroFileChange}
              />

              <strong>
                {heroFile
                  ? heroFile.name
                  : "Choose New Hero Image"}
              </strong>

              <small>
                JPG, PNG, JPEG and other image
                formats
              </small>

            </label>

            {heroFile && (
              <div className="selected-file">

                <span>Selected:</span>

                <strong>
                  {heroFile.name}
                </strong>

              </div>
            )}

            <button
              className="modal-primary hero-upload-btn"
              disabled={
                !heroFile || heroUploading
              }
              onClick={uploadHeroImage}
            >
              {heroUploading
                ? "Uploading..."
                : "CHANGE HERO IMAGE"}
            </button>

          </div>

        </div>

      </section>


      {/* =========================
          GALLERY ORDER
      ========================= */}

      <div className="gallery-toolbar">

        <div>

          <strong>Arrange Gallery</strong>

          <p>
            Use the arrows to change the display
            order.
          </p>

        </div>

        <button
          className="save-order-btn"
          onClick={saveOrder}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : saved
            ? "✓ Order Saved"
            : "SAVE ORDER"}
        </button>

      </div>


      {/* =========================
          GALLERY
      ========================= */}

      {loading ? (
        <div className="gallery-loading">
          Loading gallery...
        </div>
      ) : gallery.length === 0 ? (
        <div className="gallery-empty">
          No gallery media found.
        </div>
      ) : (
        <>
          {renderSection(
            "Events & Setups",
            "events"
          )}

          {renderSection(
            "DJ Vipul",
            "dj"
          )}

          {renderSection(
            "Live Moments",
            "live"
          )}
        </>
      )}


      {/* =========================
          ADD MEDIA MODAL
      ========================= */}

      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            !uploading &&
            setShowAddModal(false)
          }
        >

          <div
            className="gallery-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                !uploading &&
                setShowAddModal(false)
              }
            >
              ×
            </button>

            <span>GALLERY</span>

            <h2>Add Media</h2>

            <p className="modal-description">
              Upload a new photo or video to
              your gallery.
            </p>

            <label className="file-upload">

              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />

              <strong>
                {selectedFile
                  ? selectedFile.name
                  : "Choose Photo or Video"}
              </strong>

              <small>
                JPG, PNG, JPEG, MP4 and other
                supported formats
              </small>

            </label>

            <label className="modal-label">
              Category

              <select
                value={uploadCategory}
                onChange={(e) =>
                  setUploadCategory(
                    e.target.value
                  )
                }
              >
                <option value="events">
                  Events & Setups
                </option>

                <option value="dj">
                  DJ Vipul
                </option>

                <option value="live">
                  Live Moments
                </option>
              </select>

            </label>

            {selectedFile && (
              <div className="selected-file">

                <span>Selected:</span>

                <strong>
                  {selectedFile.name}
                </strong>

              </div>
            )}

            <div className="modal-buttons">

              <button
                className="modal-cancel"
                disabled={uploading}
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="modal-primary"
                disabled={
                  !selectedFile || uploading
                }
                onClick={uploadMedia}
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Media"}
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =========================
          EDIT MODAL
      ========================= */}

      {showEditModal && selectedItem && (
        <div
          className="modal-overlay"
          onClick={() =>
            !editing &&
            setShowEditModal(false)
          }
        >

          <div
            className="gallery-modal small-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                !editing &&
                setShowEditModal(false)
              }
            >
              ×
            </button>

            <span>GALLERY</span>

            <h2>Edit Media</h2>

            <p className="modal-description">
              Change the category of this media.
            </p>

            <div className="edit-preview">
              {renderMedia(selectedItem)}
            </div>

            <label className="modal-label">
              Category

              <select
                value={editCategory}
                onChange={(e) =>
                  setEditCategory(
                    e.target.value
                  )
                }
              >
                <option value="events">
                  Events & Setups
                </option>

                <option value="dj">
                  DJ Vipul
                </option>

                <option value="live">
                  Live Moments
                </option>

              </select>

            </label>

            <div className="modal-buttons">

              <button
                className="modal-cancel"
                disabled={editing}
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="modal-primary"
                disabled={editing}
                onClick={updateCategory}
              >
                {editing
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =========================
          DELETE MODAL
      ========================= */}

      {showDeleteModal && selectedItem && (
        <div
          className="modal-overlay"
          onClick={() =>
            !deleting &&
            setShowDeleteModal(false)
          }
        >

          <div
            className="gallery-modal delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="delete-icon">
              !
            </div>

            <h2>Delete Media?</h2>

            <p className="modal-description">
              This will permanently remove this
              media from your gallery.
            </p>

            <p className="delete-warning">
              This action cannot be undone.
            </p>

            <div className="modal-buttons">

              <button
                className="modal-cancel"
                disabled={deleting}
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="modal-delete"
                disabled={deleting}
                onClick={deleteMedia}
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default GalleryManagement;