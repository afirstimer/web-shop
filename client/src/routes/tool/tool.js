import React from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
    CImage,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilCloudDownload } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

const Tool = () => {
    const navigate = useNavigate();

    const redirect = () => {
        navigate('/listings');
    }

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                Tạo Token
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CButton className='mb-2' color="warning" onClick={redirect}>
                                <CIcon icon={cilCloudDownload} className="me-1" /> Tải tiện ích
                            </CButton>
                            <CForm className="row g-3">
                                <CCol xs={12}>
                                    <CFormTextarea
                                        placeholder="Leave a comment here"
                                        id="floatingTextarea2"
                                        floatingLabel="Comments"
                                        style={{ height: '100px' }}
                                    ></CFormTextarea>
                                </CCol>
                                <CCol xs={12} className='d-flex justify-content-center'>
                                    <CButton color="success" type="submit">
                                        Tạo Token
                                    </CButton>
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Tool;
