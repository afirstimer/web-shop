import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
    CRow,
    CCol,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CButton,
    CFormLabel,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import ImageUpload from "react-image-easy-upload";
import { uploadToCloudinary } from "../../services/cloudinaryService";

const Sku = ({ parentId, skuFields, onChangeImage, onChangeSkuImage }) => {

    const [rows, setRows] = useState([]);
    
    useEffect(() => {
        // loop skuFields and create array rows with id match parentId
        const rows = skuFields.filter(row => row.id === parentId);        
        setRows(rows);
    }, [skuFields]);

    const handleDeleteSku = (idSku) => {
        const updateDeleteSkus = skuFields.filter(item => item.idSku !== idSku);
        setRows(
            updateDeleteSkus.filter(row => row.id === parentId)
        );
    }    

    const handleAddImage = (idSku) => {
        onChangeSkuImage(idSku);
    }

    const handleImageUpload = async (file) => {
        try {
            const imageUrl = await uploadToCloudinary(file);
            onChangeImage(imageUrl);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {rows && rows.map(row => (
                <CRow key={row.idSku} className="mb-3 border p-3 rounded">
                    <CRow>
                        <ImageUpload
                            onChange={handleAddImage(row.idSku)}
                            setImage={handleImageUpload}                            
                            width="150px"
                            height="150px"
                            shape="square"
                        />
                        <CCol col='auto'>
                            {row.name && <CFormLabel color='danger'>{row.name}</CFormLabel>}
                        </CCol>
                        <CCol col={3}>
                            <CInputGroup className="mt-5">
                                <CInputGroupText>Giá</CInputGroupText>
                                <CFormInput id="skuAttributePrice" name="skuAttributePrice" aria-label="Amount (to the nearest dollar)" />
                                <CInputGroupText>$</CInputGroupText>
                            </CInputGroup>
                        </CCol>
                        <CCol col={3}>
                            <CInputGroup className="mt-5">
                                <CInputGroupText id="basic-addon3">Số lượng</CInputGroupText>
                                <CFormInput id="skuAttributeQuantity" name="skuAttributeQuantity" aria-describedby="basic-addon3" />
                            </CInputGroup>
                        </CCol>
                        <CCol col={3}>
                            <CInputGroup className="mt-5">
                                <CInputGroupText id="basic-addon3">SKU</CInputGroupText>
                                <CFormInput id="basic-url" aria-describedby="basic-addon3" value='{{code}}' />
                            </CInputGroup>
                        </CCol>
                        <CCol col={2}>
                            <CButton color="danger" className="mt-5" onClick={() => handleDeleteSku(row.idSku)}>
                                <CIcon icon={cilTrash} className="me-1" /> Xóa
                            </CButton>
                        </CCol>
                    </CRow>
                </CRow>
            ))}
        </>
    );
};

export default Sku;