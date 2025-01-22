import prisma from "../lib/prisma.js";
import axios from "axios";
import { generateSign } from "../helper/tiktok.api.js";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import { getDefaultShop } from "../helper/helper.js";
import { downloadImage, callTiktokApi } from "./tiktok.service.js";

const app_key = process.env.TIKTOK_SHOP_APP_KEY;
const secret = process.env.TIKTOK_SHOP_APP_SECRET;

export const uploadImageToTiktok = async (req, shop, imageUri, useCase) => {
    if (!imageUri) {
        return false
    }

    try {
        const localFilePath = await downloadImage(imageUri);
        console.log(localFilePath);
        const fileStream = fs.createReadStream(localFilePath);
        const formData = new FormData();
        console.log(path.basename(localFilePath));
        formData.append('data', fileStream, path.basename(localFilePath));
        formData.append('use_case', useCase);

        const response = await callTiktokApi(req, shop, false, formData, "POST", "/product/202309/images/upload", "multipart/form-data");

        console.log(response);
        if (response.data.code == 0) {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            return response.data;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const createTiktokProduct = async (req, listing, template, shop, draftMode) => {
    try {
        // get default shop
        const defaultShop = shop;

        // certificate
        // TODO: hiện tại tạm thời tắt nó đi
        const certificate = await prisma.certificate.findFirst({
            where: {
                listingId: listing.id
            }
        });

        //TODO: Lấy shop access token theo default shop
        const setting = await prisma.setting.findFirst();
        if (!setting) {
            console.error("Setting not found");
            return false;
        }

        // images
        let images = [];
        // loop images in listing.images and call uploadImageToTiktok . then push to images
        for (let i = 0; i < listing.images.length; i++) {
            req.imageUri = listing.images[i];
            const uploadResponse = await uploadImageToTiktok(req, shop, listing.images[i], 'MAIN_IMAGE');
            console.log(uploadResponse);
            if (uploadResponse.message == 'Success') {
                // create Tiktok Image
                let image = await prisma.tiktokImage.create({
                    data: {
                        uri: uploadResponse.data.uri,
                        url: uploadResponse.data.url,
                        useCase: uploadResponse.data.use_case
                    }
                });

                images.push({
                    uri: image.uri
                });
            }
        }

        // template attributes        
        const parsedAttributes = JSON.parse(template.attributes);
        const attributes = parsedAttributes.map(attr => ({
            id: attr.id,
            values: [{
                id: attr.value,
                name: attr.label
            }]
        }));

        // skus
        // sales_attribute
        const parsedSku = JSON.parse(template.skus);
        // loop through parsedSku and add to salesAttributes
        let salesAttributes = [];
        for (const sku of parsedSku) {
            // if has image, upload            
            if (sku.image) {
                console.log(sku.image);
                const uploadResponse = await uploadImageToTiktok(req, shop, sku.image, 'ATTRIBUTE_IMAGE');
                console.log(uploadResponse);
                if (uploadResponse.message == 'Success') {
                    // create Tiktok Image
                    let image = await prisma.tiktokImage.create({
                        data: {
                            uri: uploadResponse.data.uri,
                            url: uploadResponse.data.url,
                            useCase: uploadResponse.data.use_case
                        }
                    });
                    sku.image = image.uri;
                }
            }

            salesAttributes.push({
                id: sku.parentId,
                name: sku.name,
                sku_img: {
                    uri: sku.image
                },
                value_id: sku.parentId,
                value_name: sku.code
            });
        }

        const skus =
        [
            {
                // combined_skus: [
                //     {
                //         product_id: '1729582718312380123',
                //         sku_count: 1,
                //         sku_id: '2729382476852921560'
                //     }
                // ],
                // external_sku_id: '1729592969712207012',
                // external_urls: [
                //     'https://example.com/path1',
                //     'https://example.com/path2'
                // ],
                // extra_identifier_codes: ['00012345678905', '9780596520687'],
                identifier_code: {
                    code: template.identifierValue,
                    type: template.identifierCode
                },
                inventory: [
                    {
                        quantity: 999,
                        warehouse_id: '7386037015142123310' //This is the warehouse id
                    }
                ],
                // pre_sale: {
                //     fulfillment_type: {
                //         handling_duration_days: 7
                //     },
                //     type: 'PRE_ORDER'
                // },
                price: {
                    amount: template.skuPrice,
                    currency: 'USD'
                },
                sales_attributes: salesAttributes,
                seller_sku: listing.sku,
                sku_unit_count: template.skuQty
            }
        ];

        const payload = {
            // brand_id: '7082427311584347905',
            category_id: template.categoryId,
            category_version: 'v2',
            // certifications: [
            //     {
            //         files: [
            //             {
            //                 format: 'PDF',
            //                 id: 'v09ea0g40000cj91373c77u3mid3g1s0',
            //                 name: 'brand_cert.PDF'
            //             }
            //         ],
            //         id: '7182427311584347905',
            //         images: [
            //             {
            //                 uri: 'tos-maliva-i-o3syd03w52-us/c668cdf70b7f483c94dbe'
            //             }
            //         ]
            //     }
            // ],
            // delivery_option_ids: ['1729592969712203232'],
            description: listing.description,
            // external_product_id: '172959296971220002',
            is_cod_allowed: template.isCOD ? true : false,
            is_not_for_sale: template.isSale ? false : true,
            is_pre_owned: false,
            listing_platforms: ['TIKTOK_SHOP'],
            main_images: images,
            // manufacturer_ids: ['172959296971220002'],
            minimum_order_quantity: 1,
            package_dimensions: {
                height: "10",
                length: "10",
                unit: 'CENTIMETER',
                width: "10"
            },
            package_weight: {
                unit: 'KILOGRAM',
                value: template.packageWeight
            },
            // primary_combined_product_id: '1729582718312380123',
            product_attributes: attributes,
            // responsible_person_ids: ['172959296971220003'],
            save_mode: draftMode ? 'AS_DRAFT' : 'LISTING',
            shipping_insurance_requirement: 'REQUIRED',
            // size_chart: {
            //     image: {
            //         uri: 'tos-maliva-i-o3syd03w52-us/c668cdf70b7f483c94dbe'
            //     },
            //     template: {
            //         id: '7267563252536723205'
            //     }
            // },
            skus: skus,
            title: listing.name,
            // video: {
            //     id: 'v09e40f40000cfu0ovhc77ub7fl97k4w'
            // }
        };

        // Build query params
        const extraParams = {
            'shop_cipher': defaultShop.tiktokShopCipher,
            'access_token': setting.shopAccessToken,
            'version': '202309',
            'shop_id': defaultShop.tiktokShopId
        };
        console.log(extraParams);

        console.log(payload);

        const response = await callTiktokApi(req, shop, payload, false, "POST", "/product/202309/products", "application/json", extraParams);

        console.log(response.data);

        if (response.data) {
            return response.data;
        }
        return false;        
    } catch (error) {
        console.log(error);
    }
}

async function getWarehouseDelivery(req) {
    try {

    } catch (error) {
        console.log(error);
    }
}