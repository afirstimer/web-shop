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
    CRow,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableDataCell,
    CTableRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import DOMPurify from "dompurify";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilTrash, cilX } from "@coreui/icons";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import UploadWidget from "../../components/uploadWidget/UploadWidget";

const AddTeam = ({ visible, setVisible }) => {

    const [members, setMembers] = useState([]);

    useEffect(() => {

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {

            setVisible(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="teamMemberLabel"
            alignment="center"
            size="xl"
        >
            <CModalHeader>
                <CModalTitle id="teamMemberLabel">Tạo Nhóm</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className="mt-3">
                    <CCol sm={3}>
                        <CForm method='post' onSubmit={handleSubmit}>
                            <CRow className="mt-3">
                                <CCol col={12}>
                                    <CFormInput type="text" id="sku" name="sku" label="Mã sản phẩm" value="" readOnly disabled />
                                </CCol>
                            </CRow>
                            <CRow className="mt-5 d-flex justify-content-center" >
                                <CButton type="submit" color="primary" className=" col-3">
                                    Tạo
                                </CButton>
                            </CRow>
                        </CForm>
                    </CCol>
                    <CCol sm={9}>
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Tên người dùng</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Team hiện tại</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Thao tác</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow>
                                    <CTableDataCell>Nguyen Van A</CTableDataCell>
                                    <CTableDataCell>afiV7@example.com</CTableDataCell>
                                    <CTableDataCell>Team 1</CTableDataCell>
                                    <CTableDataCell>Thao tác</CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CCol>
                </CRow>
            </CModalBody>
        </CModal>
    );
};

export default AddTeam
