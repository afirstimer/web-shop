import prisma from "../lib/prisma.js";
import axios from "axios";
import { generateSign } from "../helper/tiktok.api.js";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import { createFolder, getDefaultShop, readJSONFile, writeJSONFile } from "../helper/helper.js";
import { downloadImage, callTiktokApi } from "./tiktok.service.js";

const ORDER_FOLDER = "./dummy/tiktok/orders/shop/";

export const setDefaultShopForUser = async( user, shopId ) => {
    try {
        // If default shop, get one
        const defaultShop = await prisma.user.findUnique({
            where: {
                id: user.defaultShop
            }
        });

        if (!defaultShop) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    defaultShop: shopId
                }
            });
        }

        return true;
    } catch (error) {
        console.log(error);
        return true;
    }
}

export const createOrders = async (data, fileName = null) => {
    try {
        if (fileName) {            
            const filePath = path.join(ORDER_FOLDER, fileName);            
            await writeJSONFile(filePath, data);
            return true;
        }        

        const orders = data.orders;
        // loop orders and insert db
        for (const order of orders) {
            // check if order exist
            const existingOrder = await prisma.order.findFirst({
                where: {
                    orderId: order.id
                }
            });
            if (existingOrder) {
                continue;
            }

            const newOrder = await prisma.order.create({
                data: {
                    buyerEmail: order.buyer_email,
                    buyerMessage: order.buyer_message,
                    cancelOrderSlaTime: order.cancel_order_sla_time,
                    collectionTime: order.collection_time || order.create_time,
                    createTime: order.create_time,
                    deliveryOptionId: order.delivery_option_id,
                    deliveryOptionName: order.delivery_option_name,                        
                    deliverySlaTime: order.delivery_sla_time,
                    deliveryTime: order.delivery_time || 0,
                    deliveryType: order.delivery_type,
                    fulfillmentType: order.fulfillment_type,
                    hasUpdatedRecipientAddress: order.has_updated_recipient_address,
                    orderId: order.id,
                    isCod: order.is_cod,
                    isOnHoldOrder: order.is_on_hold_order,
                    isReplacementOrder: order.is_replacement_order,
                    isSampleOrder: order.is_sample_order,
                    paidTime: order.paid_time,
                    paymentMethodName: order.payment_method_name,
                    recipientAddress: order.recipient_address,
                    rtsSlaTime: order.rts_sla_time,
                    shippingDueTime: order.shipping_due_time,
                    shippingProvider: order.shipping_provider || 'n/a',
                    shippingProviderId: order.shipping_provider_id || 'n/a',
                    shippingType: order.shipping_type || 'n/a',
                    status: order.status,
                    trackingNumber: order.tracking_number,
                    updateTime: order.update_time,
                    userId: order.user_id,
                    warehouseId: order.warehouse_id,
                    packages: order.packages,
                    payment: order.payment
                }
            });

            // Create Order Item
            for (const item of order.line_items) {
                await prisma.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        orderItemId: item.id,
                        currency: item.currency,
                        displayStatus: item.display_status,
                        itemTax: item.item_tax,
                        originalPrice: item.original_price,
                        packageId: item.package_id,
                        packageStatus: item.package_status,
                        platformDiscount: item.platform_discount,
                        productId: item.product_id,
                        productName: item.product_name,
                        rtsTime: item.rts_time,
                        salePrice: item.sale_price,
                        sellerDiscount: item.seller_discount,
                        sellerSku: item.seller_sku,
                        shippingProviderId: item.shipping_provider_id,
                        shippingProviderName: item.shipping_provider_name,
                        skuId: item.sku_id,
                        skuImage: item.sku_image,
                        skuName: item.sku_name,
                        skuType: item.sku_type,
                        trackingNumber: item.tracking_number                            
                    }
                });
            }
        }

        return true;
    } catch (error) {
        console.log(error);
        return false
    }
}