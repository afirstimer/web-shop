import prisma from "../lib/prisma.js";
import {
    uploadImageToTiktok,
    createTiktokProduct
} from "../services/product.service.js";

export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = process.env.DEFAULT_LIMIT, name, sku, sort } = req.query;

        const pageNum = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        const where = {
            ...(name && {
                name: {
                    contains: name,
                    mode: "insensitive",
                },
            }),
            ...(sku && {
                sku: {
                    contains: sku,
                    mode: "insensitive",
                },
            }),
            isActive: 1
        };

        const orderBy = (() => {
            switch (sort) {
                case "newest":
                    return { createdAt: "desc" };
                case "oldest":
                    return { createdAt: "asc" };
                case "updated_newest":
                    return { updatedAt: "desc" };
                case "updated_oldest":
                    return { updatedAt: "asc" };
                default:
                    return { createdAt: "desc" };
            }
        })();

        const total = await prisma.product.count({
            where
        });

        const products = await prisma.product.findMany({
            where,
            include: {
                shop: true,
                listing: true
            },
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            orderBy
        });

        // loop products and add ListingOnShop        
        for (const product of products) {
            const listingOnShop = await prisma.listingOnShop.findFirst({
                where: {
                    listingId: product.listingId,
                    shopId: product.shopId
                }
            })

            if (listingOnShop) {
                product.listingOnShop = listingOnShop;
            }
        }

        res.status(200).json({
            total,
            page: pageNum,
            limit: pageSize,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getProduct = async (req, res) => { }

export const createProduct = async (req, res) => { }

export const editProduct = async (req, res) => { }

export const uploadCert = async (req, shop, uriImage, res) => {
    try {
        // upload image to tiktok
        const result = await uploadImageToTiktok(req, shop, uriImage, 'CERTIFICATION_IMAGE');
        let image = null;
        if (result.message == 'Success') {
            // create Tiktok Image
            image = await prisma.tiktokImage.create({
                data: {
                    uri: result.data.uri,
                    url: result.data.url,
                    useCase: result.data.use_case
                }
            });
        }

        // upload pdf files to tiktok

        // update certificate with images
        // find existing certificate
        const existingCertificate = await prisma.certificate.findFirst({
            where: {
                listingId: req.body.listingId
            }
        })

        // update listing isCertUpload = 1
        await prisma.listing.update({
            where: {
                id: req.body.listingId
            },
            data: {
                isCertUpload: 1
            }
        });

        if (!existingCertificate) {
            // create new certificate
            const newCertificate = await prisma.certificate.create({
                data: {
                    listingId: req.body.listingId,
                    images: [image.id]
                }
            })
            res.status(200).json(newCertificate);
        } else {
            const updatedCertificate = await prisma.certificate.update({
                where: {
                    id: existingCertificate.id
                },
                data: {
                    images: [...existingCertificate.images, image.id]
                }
            })
            res.status(200).json(updatedCertificate);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create certificate' });
    }
}

export const uploadTiktokProducts = async (req, res) => {
    try {
        const { listings, shops, template, draftMode } = req.body;

        // Get existing template
        const existingTemplate = await prisma.template.findFirst({
            where: {
                id: template.id
            }
        })

        // Update template
        let user = await prisma.user.findUnique({
            where: {
                id: req.userId
            }
        });
        console.log(user);

        console.log(existingTemplate);
        console.log(listings);
        console.log(shops);
        console.log(template);
        console.log(draftMode);

        // Loop listings, and submit to tiktok
        // Biến theo dõi trạng thái upload
        let uploadStatus = false;

        // Tạo một mảng promises cho tất cả các thao tác upload
        const uploadTasks = listings.flatMap((listing) =>
            shops.map(async (shop) => {
                try {
                    const response = await createTiktokProduct(req, listing, existingTemplate, shop, draftMode);

                    // status
                    const exportStatus = 'PENDING';
                    let tiktokProductId = null;
                    if (response.code == 0) {
                        tiktokProductId = response.data.product_id;
                        exportStatus = draftMode ? 'DRAFT' : 'SUCCESS';
                    } else {
                        exportStatus = 'FAILURE';
                    }

                    // Tạo ListingOnShop
                    const listingOnShop = await prisma.listingOnShop.create({
                        data: {
                            listingId: listing.id,
                            shopId: shop.id,
                            status: exportStatus,
                        }
                    });
                    console.log(listingOnShop);

                    // Tạo product
                    const product = await prisma.product.create({
                        data: {
                            name: listing.name,
                            description: listing.description,
                            price: listing.price,
                            listingId: listing.id,
                            shopId: shop.id
                        }
                    });
                    console.log(product);

                    // Tạo log
                    const logg = await prisma.log.create({
                        data: {
                            shopId: shop.id,
                            listingId: listing.id,
                            productTiktokId: tiktokProductId,
                            code: response.code,
                            status: exportStatus,
                            payload: JSON.stringify(response)
                        }
                    })
                    console.log(logg);

                    return response;
                } catch (err) {
                    console.error("Error uploading product:", err);
                    return null; // Xử lý lỗi từng shop
                }
            })
        );

        // Đợi tất cả các promises hoàn tất
        const results = await Promise.allSettled(uploadTasks);

        // Kiểm tra trạng thái upload
        uploadStatus = results.some((result) => result.status === 'fulfilled' && result.value);

        // Chờ uploadStatus hoặc timeout sau 20s
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout waiting for uploads to complete")), 20000)
        );

        // Đợi upload hoàn thành hoặc timeout
        await Promise.race([Promise.resolve(uploadStatus), timeout]);

        if (uploadStatus) {
            res.status(200).json({ message: "Success" });
        } else {
            res.status(500).json({ message: "Failed to create products" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId, shopId } = req.body;
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }        

        const shop = await prisma.shop.findUnique({
            where: {
                id: shopId
            }
        });
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        const listingOnShop = await prisma.listingOnShop.findUnique({
            where: {
                listingId_shopId: {
                    listingId: product.listingId,
                    shopId: shopId
                }
            }
        });
        if (!listingOnShop) {
            return res.status(404).json({ message: "Listing on shop not found" });
        }

        const extraParams = {
            'shop_cipher': shop.tiktokShopCipher,
            'listing_platforms': ['TIKTOK_SHOP'],
            'product_ids': [product.id],
            'version': '202309',
            'shop_id': defaultShop.tiktokShopId
        }

        const response = await callTiktokApi(req, shop, payload, false, "POST", "/product/202309/products/deactivate", "application/json", extraParams);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}



