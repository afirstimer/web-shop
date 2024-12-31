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

const EditListing = ({ visible, setVisible, listing }) => {

    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (listing) {
            setImages(listing.images);
            setDescription(listing.description);
        }
    }, [listing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const res = await apiRequest.put(`/listings/${listing.id}`, {
                name: formData.get('name'),
                description: description,
                price: formData.get('price'),
                images: images
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
                <CModalTitle id="LiveDemoExampleLabel">Sản phẩm #{listing && listing.sku}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className="clearfix">
                    {listing && images && images.map((image, index) => (
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
                            <CFormInput type="text" id="sku" name="sku" label="Mã sản phẩm" value={listing && listing.sku} readOnly disabled />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="price" name="price" label="Giá" value={listing && listing.price} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormTextarea id="name" name="name" label="Tên sản phẩm" value={listing && listing.name} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3 mb-5">
                        <label className="col-12">Mô tả</label>
                        <ReactQuill theme="snow" onChange={setDescription} value={listing && listing.description} />
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

export default EditListing
