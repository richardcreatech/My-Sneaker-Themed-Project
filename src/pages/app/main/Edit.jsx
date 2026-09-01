import { useEffect, useState, useCallback } from "react";
import CollectionModal from "./CollectionModal";
import { API_BASE_URL } from "../../../config/api";

function Edit() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/getproducts`);
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.error(err);
      setLoadError(
        "Couldn't load your collections. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Prepend the newly created product so it shows up immediately
  // without waiting on a full refetch.
  const handleCreated = (product) => {
    setCollections((prev) => [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        images: (product.images || []).map((img) => img.image_url),
      },
      ...prev,
    ]);
    setModalOpen(false);
  };

  return (
    <section id="collection_section">
      <section id="collection_controls">
        <div className="controls_text">
          <h1>Collections</h1>
          <p>Every product you stock, one card each.</p>
        </div>
        <button className="createcollection" onClick={() => setModalOpen(true)}>
          New collection
        </button>
      </section>

      <section id="my_collections">
        {loading && (
          <div className="state_message">Loading your collections…</div>
        )}

        {!loading && loadError && (
          <div className="state_message state_error">
            {loadError}
            <button className="retry_btn" onClick={fetchCollections}>
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && collections.length === 0 && (
          <div className="state_message state_empty">
            <p>Nothing here yet.</p>
            <span>Add your first collection to start filling the shelf.</span>
          </div>
        )}

        {!loading && !loadError && collections.length > 0 && (
          <div className="collection_grid">
            {collections.map((item) => {
              const images = item.images || [];
              const mainImage = images[0] ?? null;
              // Always render 3 thumbnail slots so cards line up even
              // when a product has fewer than 4 images.
              const thumbs = [
                images[1] ?? null,
                images[2] ?? null,
                images[3] ?? null,
              ];

              return (
                <article className="collection_card" key={item.id}>
                  <div className="collection_image_wrap">
                    <div className="collection_main_image">
                      {mainImage ? (
                        <img src={mainImage} alt={item.name} loading="lazy" />
                      ) : (
                        <div className="collection_image_fallback">
                          No image
                        </div>
                      )}

                      {item.category?.name && (
                        <span className="collection_category_tag">
                          {item.category.name}
                        </span>
                      )}
                    </div>

                    <div className="collection_thumbs">
                      {thumbs.map((thumb, i) =>
                        thumb ? (
                          <div className="collection_thumb" key={i}>
                            <img src={thumb} alt="" loading="lazy" />
                          </div>
                        ) : (
                          <div className="collection_thumb empty" key={i} />
                        ),
                      )}
                    </div>

                    {item.description && (
                      <div className="collection_description_overlay">
                        <p>{item.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="collection_meta">
                    <h3>{item.name}</h3>
                    {item.price != null && (
                      <span className="collection_price">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {modalOpen && (
        <CollectionModal
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </section>
  );
}

export default Edit;
