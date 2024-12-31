// Inject Bootstrap CSS nếu chưa có
// Kiểm tra xem bootstrapCSS đã được thêm vào chưa
if (!document.getElementById("bootstrap-css")) {
  const bootstrapCSS = document.createElement("link");
  bootstrapCSS.id = "bootstrap-css"; // Đặt ID để dễ kiểm tra sau này
  bootstrapCSS.rel = "stylesheet";
  bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"; // Đường dẫn CSS Bootstrap
  document.head.appendChild(bootstrapCSS);
}

function getLargeImageUrl(smallImageUrl) {
  // Loại bỏ đoạn "_SX..._" hoặc "_CR,..._" trong URL
  if (typeof smallImageUrl !== "string") {
    console.error("Invalid URL: Expected a string but got:", smallImageUrl);
    return ""; // Trả về chuỗi rỗng nếu không hợp lệ
  }
  return smallImageUrl.replace(/(\._[^.]+)?\.[a-z]{3,4}$/, ".jpg");
}

(function () {
  // Xóa modal nếu đã tồn tại
  const existingModal = document.getElementById("amazon-crawler-modal");
  if (existingModal) existingModal.remove();

  // Lấy thông tin sản phẩm
  const getProductInfo = () => {
    const title = document.querySelector("#productTitle")?.innerText.trim() || "No Title";
    const price = document.querySelector(".a-price .a-offscreen")?.innerText || "No Price";
    const crawlUrl = window.location.href;
    const imageElements = [...document.querySelectorAll("#altImages img")]
    const images = imageElements.map(img => {
      const smallImageUrl = img.src;
      const largeImageUrl = getLargeImageUrl(smallImageUrl);

      if (largeImageUrl.includes("360_icon_73x73v2")) {
        return null;
      }
      if (largeImageUrl.includes("dp-play-icon-overlay__")) {
        return null;
      }

      return largeImageUrl;
  }).filter(url => url !== null); // Cào các hình ảnh chất lượng cao

    // Lấy thông tin chi tiết từ bảng
    const details = document.querySelectorAll("#detailBullets_feature_div .a-list-item");
    const productOriginInfo = {};
    const productInfo = {};
    details.forEach(item => {
      const label = item.querySelector(".a-text-bold")?.innerText.trim().replace(/[:&rlm;&lrm;]/g, "");
      const value = item.querySelector("span:not(.a-text-bold)")?.innerText.trim();
      const trimmedLabel = label;
      if (trimmedLabel && value) {
        productOriginInfo[trimmedLabel] = value;

        // Trích xuat thong tin nguon san pham
        if (trimmedLabel.includes("Poduct Diensions")) {
          productInfo['productDimensions'] = value;
        } else if (trimmedLabel.includes("Package Diensions")) {
          productInfo['packageDimensions'] = value;
        } else if (trimmedLabel.includes("Ite ode nube")) {
          productInfo['modelNum'] = value;
        } else if (trimmedLabel.includes("UPC")) {
          productInfo['upc'] = value;
        } else if (trimmedLabel.includes("Manufactue")) {
          productInfo['manufacture'] = value;
        } else if (trimmedLabel.includes("ASIN")) {
          productInfo['asin'] = value;
        } else if (trimmedLabel.includes("County of Oigin")) {
          productInfo['originCountry'] = value;
        }
      }
    });

    // Trích xuất thông tin cụ thể
    const descriptionElement = document.querySelector("#feature-bullets ul");
    let description = "N/A";
    if (descriptionElement) {
      const descriptionItems = descriptionElement.querySelectorAll("li");
      description = Array.from(descriptionItems)
        .map(item => item.textContent.trim())
        .join("\n");
    }

    // Lấy thông tin Shipping & Fee Details    

    // Lấy thông tin Delivery Time
    const deliveryTime = document
      .querySelector("#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE .a-text-bold")
      ?.innerText.trim() || "Delivery info not available";

    return { title, price, images, description, crawlUrl, productInfo, productOriginInfo, deliveryTime };
  };

  // Tạo modal
  const createModal = ({ title, price, images, description, productInfo, deliveryTime }) => {
    const existingModal = document.getElementById("amazon-crawler-modal");
    if (existingModal) existingModal.remove();

    // Tạo modal HTML
    const modalHTML = `
        <div id="amazon-crawler-modal" class="position-fixed bottom-0 end-0 m-3 bg-white border shadow rounded p-3" style="width: 400px; z-index: 9999;">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="text-primary">Cào sản phẩm</h5>
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
      saveProduct({ title, price, images, description, productInfo, deliveryTime });
    });

    document.getElementById("refresh-product").addEventListener("click", () => {
      window.location.reload();
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
    chrome.storage.local.get(["apiToken", "webhookUrl"], (data) => {
      const apiToken = data.apiToken || "";
      const webhookUrl = data.webhookUrl || "";
      const productData = getProductInfo();

      if (!apiToken || !webhookUrl) {
        alert("API token or webhook URL not found.");
        return;
      }

      const payload = {
        title: product.title,
        price: product.price,
        crawlUrl: productData.crawlUrl,
        images: product.images,
        description: productData.description,
        productInfo: productData.productInfo,
        productOriginInfo: productData.productOriginInfo,
        deliveryTime: productData.deliveryTime,
      };

      // Gửi API với token
      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`, // Gửi token trong header
        },
        body: JSON.stringify(payload),
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

