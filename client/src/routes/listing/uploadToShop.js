import React, { useEffect, useState } from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CForm, CRow, CFormInput, CFormLabel } from "@coreui/react";
import apiRequest from "../../lib/apiRequest";
import MultiSelect from 'multiselect-react-dropdown'

const UploadToShop = ({ visible, setVisible, listings }) => {

    const [shops, setShops] = useState([]);
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const shops = await apiRequest.get(`/shops`);
                setShops(shops.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchShops();
    }, [listings]);

    

    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">Đăng sản phẩm</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm>
                    <CRow className="mb-3" controlId="exampleForm.ControlInput1">
                        <CFormLabel>Chọn cửa hàng</CFormLabel>
                        <MultiSelect
                            displayValue='name'
                            options={shops}
                        />
                    </CRow>
                    <CRow className="mb-3" controlId="exampleForm.ControlInput1">
                        <CFormLabel>Chọn mẫu</CFormLabel>
                    </CRow>
                </CForm>
                <CRow className="mt-5 d-flex justify-content-center" >
                    <CButton type="submit" color="primary" className=" col-5">
                        Đăng sản phẩm
                    </CButton>
                </CRow>
            </CModalBody>            
        </CModal>
    );
};

export default UploadToShop;
