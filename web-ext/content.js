// Inject Bootstrap CSS nếu chưa có
// Kiểm tra xem bootstrapCSS đã được thêm vào chưa
if (!document.getElementById("bootstrap-css")) {
  const bootstrapCSS = document.createElement("link");
  bootstrapCSS.id = "bootstrap-css"; // Đặt ID để dễ kiểm tra sau này
  bootstrapCSS.rel = "stylesheet";
  bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"; // Đường dẫn CSS Bootstrap
  document.head.appendChild(bootstrapCSS);
}

(function () {
    // Xóa modal nếu đã tồn tại
    const existingModal = document.getElementById("amazon-crawler-modal");
    if (existingModal) existingModal.remove();
  
    // Lấy thông tin sản phẩm
    const getProductInfo = () => {
      const title = document.querySelector("#productTitle")?.innerText.trim() || "No Title";      
      const price = document.querySelector(".a-price .a-offscreen")?.innerText || "No Price";
      const images = [...document.querySelectorAll("#altImages img")].map(img => img.src.replace('_SS40_', '_SX300_')); // Cào các hình ảnh chất lượng cao
      return { title, price, images };
    };
  
    // Tạo modal
    const createModal = ({ title, price, images }) => {        
      const existingModal = document.getElementById("amazon-crawler-modal");
      if (existingModal) existingModal.remove();

      // Tạo modal HTML
      const modalHTML = `
        <div id="amazon-crawler-modal" class="position-fixed bottom-0 end-0 m-3 bg-white border shadow rounded p-3" style="width: 400px; z-index: 9999;">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="text-primary">Product Details</h5>
            <button id="close-modal" class="btn-close" aria-label="Close"></button>
          </div>
          <div class="mb-3">
            <p id="product-title" class="text-break">${title}</p>
            <p id="product-price" class="text-muted" contenteditable="false">${price}</p>
          </div>
          <div id="product-images" class="mb-3">
            ${images.map((img, index) => `
              <div class="d-inline-block position-relative me-2 mb-2">
                <img src="${img}" alt="Product Image" class="img-thumbnail" style="width: 80px; height: 80px;">
                <button class="btn btn-danger btn-sm position-absolute top-0 end-0" data-index="${index}" style="font-size: 0.7rem;">X</button>
              </div>
            `).join("")}
          </div>
          <div class="d-flex justify-content-end">
            <button id="edit-product" class="btn btn-warning btn-sm me-2">Edit</button>
            <button id="refresh-product" class="btn btn-secondary btn-sm me-2">Refresh</button>
            <button id="save-product" class="btn btn-success btn-sm">Save</button>
          </div>
        </div>
      `;
      const div = document.createElement("div");
      div.innerHTML = modalHTML;
      document.body.appendChild(div);
  
      // Gắn sự kiện cho các nút
      document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("amazon-crawler-modal").remove();
      });
  
      document.getElementById("save-product").addEventListener("click", () => {
        saveProduct({ title, price, images });
      });
  
      document.getElementById("refresh-product").addEventListener("click", () => {
        window.location.reload();
        const updatedInfo = getProductInfo();
        document.getElementById("amazon-crawler-modal").remove();
        createModal(updatedInfo);
      });
  
      document.getElementById("edit-product").addEventListener("click", () => {
        toggleEditMode(true);
      });
  
      document.querySelectorAll("#product-images .btn-danger").forEach(button => {
        button.addEventListener("click", (e) => {
          const index = parseInt(e.target.getAttribute("data-index"), 10);
          images.splice(index, 1); // Xóa hình từ danh sách
          createModal({ title, price, images });
        });
      });
    };
  
    // Hàm bật/tắt chế độ chỉnh sửa
    const toggleEditMode = (isEditing) => {
      const priceElement = document.getElementById("product-price");
      const editButton = document.getElementById("edit-product");
  
      // Không cho phép sửa tiêu đề
      const titleElement = document.getElementById("product-title");      
  
      if (isEditing) {
        priceElement.contentEditable = true; // Chỉ cho sửa giá
        titleElement.contentEditable = true;
        editButton.textContent = "Save Edits";
        editButton.classList.remove("btn-warning");
        editButton.classList.add("btn-primary");
        editButton.addEventListener("click", () => {
          toggleEditMode(false);
        });
      } else {
        priceElement.contentEditable = false;
        titleElement.contentEditable = false;
        editButton.textContent = "Edit";
        editButton.classList.remove("btn-primary");
        editButton.classList.add("btn-warning");
      }
    };
  
    // Hàm gọi API lưu sản phẩm
    const saveProduct = (product) => {
    // Lấy token từ storage
    chrome.storage.local.get("apiToken", (data) => {
      const apiToken = data.apiToken || "";      

      // Gửi API với token
      fetch("http://localhost:8800/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`, // Gửi token trong header
        },
        body: JSON.stringify(product),
      })
        .then((response) => {
          if (response.ok) {
            alert("Product saved successfully!");
          } else {
            alert("Failed to save product.");
          }
        })
        .catch((error) => {
          console.error("Error saving product:", error);
          alert("Error saving product.");
        });
    });
  };
  
    // Hiển thị modal
    const productInfo = getProductInfo();
    createModal(productInfo);
  })();
  
  