import React, { useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormText,
    CImage,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilPlus, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { auto } from '@popperjs/core';
import TreeSelect from '../../components/TreeSelect';
import apiRequest from '../../lib/apiRequest';

const Setting = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);        

    const redirect = () => {
        navigate('/settings');
    }

    return (
        <>
            <CButton className='mb-3' color="warning" onClick={redirect}>
                <CIcon icon={cilArrowLeft} className="me-1" /> Quay lại
            </CButton>
            <CRow className='mt-5'>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                Tạo Proxy
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row g-3">
                                <CCol xs={12}>
                                    <CFormInput id="name" label="Tên" placeholder="" aria-describedby='helpName' />
                                    <CFormText id="helpName">Tên cho cấu hình Proxy</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="inputAddress">Type</CFormLabel>
                                    <CFormSelect id="type" name='type' aria-describedby='helpType'>
                                        <option>-- Select --</option>
                                        <option value="HTTP">HTTP</option>
                                        <option value="HTTPS">HTTPS</option>
                                        <option value="SOCKS5">SOCKS5</option>
                                    </CFormSelect>
                                    <CFormText id="helpType">Ví dụ: SOCKS5</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput id="hostname" label="Hostname" placeholder="" aria-describedby='helpHostname' />
                                    <CFormText id="helpHostname">Ví dụ: 127.0.0.1</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput id="port" label="Port" placeholder="" aria-describedby='helpPort' />
                                    <CFormText id="helpPort">Ví dụ: 8080</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput id="username" label="Username" placeholder="" aria-describedby='helpUsername' />
                                    <CFormText id="helpUsername">Ví dụ: admin</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput type='password' id="password" label="Password" placeholder="" aria-describedby='helpPassword' />
                                    <CFormText id="helpPassword">Ví dụ: 123456789</CFormText>
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow className='mt-3'>
                <CCol xs={12} className='justify-content-center text-center'>
                    <CButton className='mb-5' color="primary" onClick={redirect}>
                        Lưu cài đặt
                    </CButton>
                </CCol>
            </CRow>
        </>
    )
}

export default Setting;
