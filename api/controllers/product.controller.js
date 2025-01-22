import prisma from "../lib/prisma.js";
import { 
    uploadImageToTiktok,
    createTiktokProduct
} from "../services/product.service.js";

export const getProducts = async (req, res) => { }

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
        let results = [];
        listings.forEach(async (listing) => {
            shops.forEach(async (shop) => {
                // console.log(listing, existingTemplate, shop, draftMode);
                let response = createTiktokProduct(req, listing, existingTemplate, shop, draftMode);

                // if success, create ListingOnShop
                const listingOnShop = await prisma.listingOnShop.create({
                    data: {
                        listingId: listing.id,
                        shopId: shop.id,
                        status: response ? 'SUCCESS' : 'FAILURE',
                    }
                });
                console.log(listingOnShop);

                // create product
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

                // update listing.shops and listing.products
                const newestListing = await prisma.listing.update({
                    where: {
                        id: listing.id
                    },
                    data: {
                        shops: {
                            connect: {
                                id: shop.id
                            }
                        },
                        products: {
                            connect: {
                                id: product.id
                            }
                        }
                    }
                })
                console.log(newestListing);

                results.push(response);
            })
        })        

        if (results.length > 0) {
            res.status(200).json({ message: "Success" });
        } else {
            res.status(500).json({ message: "Failed to create products" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}




