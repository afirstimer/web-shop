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

        const response = await callTiktokApi(req, shop, formData, "POST", "/product/202309/images/upload", "multipart/form-data");

        console.log(response.data);
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
            values: {
                id: attr.value,
                name: attr.label
            }
        }));

        // skus
        // sales_attribute

        

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
                height: template.packageHeight,
                length: template.packageLength,
                unit: 'CENTIMETER',
                width: template.packageWidth
            },
            package_weight: {
                unit: 'POUND',
                value: template.packageWeight
            },
            // primary_combined_product_id: '1729582718312380123',
            product_attributes: attributes,
            // responsible_person_ids: ['172959296971220003'],
            save_mode: draftMode ? 'DRAFT' : 'PUBLISHED',
            shipping_insurance_requirement: 'REQUIRED',
            // size_chart: {
            //     image: {
            //         uri: 'tos-maliva-i-o3syd03w52-us/c668cdf70b7f483c94dbe'
            //     },
            //     template: {
            //         id: '7267563252536723205'
            //     }
            // },
            // skus: [
            //     {
            //         combined_skus: [
            //             {
            //                 product_id: '1729582718312380123',
            //                 sku_count: 1,
            //                 sku_id: '2729382476852921560'
            //             }
            //         ],
            //         external_sku_id: '1729592969712207012',
            //         external_urls: [
            //             'https://example.com/path1',
            //             'https://example.com/path2'
            //         ],
            //         extra_identifier_codes: ['00012345678905', '9780596520687'],
            //         identifier_code: {
            //             code: '10000000000000',
            //             type: 'GTIN'
            //         },
            //         inventory: [
            //             {
            //                 quantity: 999,
            //                 warehouse_id: '7068517275539719942'
            //             }
            //         ],
            //         pre_sale: {
            //             fulfillment_type: {
            //                 handling_duration_days: 7
            //             },
            //             type: 'PRE_ORDER'
            //         },
            //         price: {
            //             amount: '1.21',
            //             currency: 'USD'
            //         },
            //         sales_attributes: [
            //             {
            //                 id: '100089',
            //                 name: 'Color',
            //                 sku_img: {
            //                     uri: 'tos-maliva-i-o3syd03w52-us/c668cdf70b7f483c94dbe'
            //                 },
            //                 value_id: '1729592969712207000',
            //                 value_name: 'Red'
            //             }
            //         ],
            //         seller_sku: 'Color-Red-XM001',
            //         sku_unit_count: '100.00'
            //     }
            // ],
            title: listing.name,
            // video: {
            //     id: 'v09e40f40000cfu0ovhc77ub7fl97k4w'
            // }
        };
        
        // Build query params
        const extraParams = {
            'shop_cipher': defaultShop.tiktokShopCipher
        };

        console.log(payload);

        const response = await callTiktokApi(req, shop, payload, "POST", "/product/202309/products", "application/json", extraParams);

        console.log(response.data);
        return response.data;
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