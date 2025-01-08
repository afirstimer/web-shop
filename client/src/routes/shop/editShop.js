import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormText,
    CFormTextarea,
    CImage,
    CLink,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import DOMPurify from "dompurify";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilTrash, cilX } from "@coreui/icons";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import UploadWidget from "../../components/uploadWidget/UploadWidget";

const EditShop = ({ visible, setVisible, shop }) => {

    const [images, setImages] = useState([]);    

    useEffect(() => {
        setImages(shop.images);        
    }, [shop]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const res = await apiRequest.put(`/shops/${shop.id}`, {
                name: formData.get('name'),
                profile: formData.get('profile'),
                code: formData.get('code'),                
                priceDiff: formData.get('priceDiff'),
                shopItems: formData.get('shopItems'),
                price: formData.get('price'),
                images: images,
                status: formData.get('status'),
            });

            setVisible(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
            alignment="center"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">Cập nhật shop #{shop.sku}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className="clearfix">
                    {shop && images && images.map((image, index) => (
                        <CCol xs={3} key={index} className="position-relative">
                            <CImage
                                className="m-2 img-thumbnail"
                                rounded
                                src={image}
                                width={100}
                                height={100}
                            />
                            <CIcon icon={cilX} className="position-absolute top-0 float-start text-danger fw-bold"
                                onClick={() => {
                                    const newImages = images.filter((img, i) => i !== index);
                                    setImages(newImages);
                                }} />
                        </CCol>
                    ))}
                    <div className="text-center">
                        <UploadWidget
                            uwConfig={{
                                multiple: true,
                                cloudName: "dg5multm4",
                                uploadPreset: "estate_3979",
                                folder: "posts",
                            }}
                            setState={setImages}
                        />
                    </div>
                </CRow>
                <CForm method='post' onSubmit={handleSubmit}>
                    <CRow className="mt-3">
                        <CCol md={6}>
                            <CFormInput type="text" id="name" name="name" label="Shop name" value={shop && shop.name} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="profile" name="profile" label="Profile name" value={shop && shop.user && shop.user.email} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={6}>
                            <CFormInput type="text" id="code" name="code" label="Shop code" value={shop && shop.code} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="createdBy" name="createdBy" label="Created by" value={shop && shop.profile} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3 mb-5">
                        <CCol md={12}>
                            <CFormInput type="text" id="priceDiff" name="priceDiff" label="Team" value={shop && shop.priceDiff} />
                        </CCol>
                    </CRow>
                    <div className="clearfix"></div>
                    <CRow className="mt-5 d-flex justify-content-center" >
                        <CButton type="submit" color="primary" className=" col-3">
                            Cập nhật sản phẩm
                        </CButton>
                    </CRow>
                </CForm>
            </CModalBody>
        </CModal>
    );
};

export default EditShop
