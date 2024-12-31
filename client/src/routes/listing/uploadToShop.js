import React from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CForm, CRow, CFormInput } from "@coreui/react";

const UploadToShop = ({ visible, setVisible, listing }) => {    
    
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
                        <CFormInput type="email" placeholder="Nhập link Shop" />
                    </CRow>
                    <CRow className="mb-3" controlId="exampleForm.ControlInput1">
                        <CFormInput type="email" placeholder="Nhập link Shop" />
                    </CRow>
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                    Đóng
                </CButton>                
            </CModalFooter>
        </CModal>
    );
};

export default UploadToShop;
