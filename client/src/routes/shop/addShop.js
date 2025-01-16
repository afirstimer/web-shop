import React from "react";
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CImage,
    CRow,
    CFormLabel,
    CLink,
    CFormText,
    CButtonGroup,
    CButton,
    CFormInput,
    CForm,
    CFormTextarea
} from "@coreui/react";
import DOMPurify from "dompurify";

const AddShop = ({ visible, setVisible }) => {
    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
            alignment="center"
            scrollable
            size="sm"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">Tạo shop</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm>
                    <CRow className="mt-3 d-flex justify-content-center">
                        <div className="col-12">
                            <CFormTextarea placeholder="Nhập link của shop">
                            </CFormTextarea>
                        </div>
                    </CRow>
                    <CRow className="mt-3 d-flex justify-content-center" >
                        <CButtonGroup className="col-6">
                            <CButton color="primary">Authorize</CButton>
                        </CButtonGroup>
                    </CRow>
                </CForm>
            </CModalBody>
        </CModal>
    );
}

export default AddShop;
