import React from 'react'
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

const AddTemplate = () => {
    const navigate = useNavigate();

    const redirect = () => {
        navigate('/templates');
    }

    return (
        <>
            <CButton className='mb-3' color="warning" onClick={redirect}>
                <CIcon icon={cilArrowLeft} className="me-1" /> Quay lại
            </CButton>
            <CRow>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                THÔNG TIN TEMPLATE
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row g-3">
                                <CCol md={6}>
                                    <CFormInput type="email" id="inputEmail4" label="Tên" />
                                </CCol>
                                <CCol md={6}>
                                    <CFormSelect aria-label="Default select example" label="Loại">
                                        <option>Danh mục</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </CFormSelect>
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow className='mt-5'>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                THÔNG TIN SẢN PHẨM
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row g-3">
                                <CCol xs={12}>
                                    <CFormInput id="inputAddress" label="Tên" placeholder="1234 Main St" />
                                </CCol>
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="inputAddress2">Mô tả</CFormLabel>
                                    <ReactQuill theme="snow" />
                                </CCol>
                                <CCol xs={12}>
                                    <CFormSelect aria-label="Default select example" label="Danh mục">
                                        <option>Danh mục</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </CFormSelect>
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow className='mt-5'>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                THUỘC TÍNH SẢN PHẨM
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row g-3">
                                <CCol md={4}>
                                    <CFormInput type="email" id="inputEmail4" label="Tên" />
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput type="password" id="inputPassword4" label="Loại" />
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput type="password" id="inputPassword4" label="Loại" />
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow className='mt-5'>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                PRODUCT COMPLIANCE
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row g-3">
                                <CCol md={4}>
                                    <CFormInput type="email" id="inputEmail4" label="Tên" />
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput type="password" id="inputPassword4" label="Loại" />
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput type="password" id="inputPassword4" label="Loại" />
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow className='mt-5'>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                SKUS SẢN PHẨM
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row g-3">
                                <CCol md={5}>
                                    <CFormInput type="email" id="inputEmail4" label="Thuộc tính" />
                                </CCol>
                                <CCol md={5}>
                                    <CFormInput type="password" id="inputPassword4" label="Giá trị" />
                                </CCol>
                                <CCol md={2}>
                                    <CButton className='mt-4 ms-5 circle' color='danger'>
                                        <CIcon icon={cilTrash} className="me-1" />
                                    </CButton>
                                </CCol>
                            </CForm>
                            <CButton className='mt-3 circular' color='warning'>
                                <CIcon icon={cilPlus} className="me-1" /> Tạo SKU
                            </CButton>
                            <hr />
                            <CForm className="row row-cols-lg-auto g-3 align-items-center">
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="inputPassword4">1. Mặc định</CFormLabel>
                                </CCol>
                                <CCol xs={12}>
                                    <CInputGroup className="mb-3">
                                        <CDropdown variant="input-group">
                                            <CDropdownToggle color="secondary" variant="outline">GTIN</CDropdownToggle>
                                            <CDropdownMenu>
                                                <CDropdownItem href="#">EAN</CDropdownItem>
                                                <CDropdownItem href="#">UPC</CDropdownItem>
                                                <CDropdownItem href="#">ISBN</CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>
                                        <CFormInput aria-label="Text input with dropdown button" />
                                    </CInputGroup>
                                </CCol>
                                <CCol xs={12}>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>Giá</CInputGroupText>
                                        <CFormInput aria-label="Amount (to the nearest dollar)" />
                                        <CInputGroupText>$</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                                <CCol xs={12}>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText id="basic-addon3">Số lượng</CInputGroupText>
                                        <CFormInput id="basic-url" aria-describedby="basic-addon3" />
                                    </CInputGroup>
                                </CCol>
                                <CCol xs={12}>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText id="basic-addon3">Seller SKU</CInputGroupText>
                                        <CFormInput id="basic-url" aria-describedby="basic-addon3" />
                                    </CInputGroup>
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow className='mt-5'>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                VẬN CHUYỂN
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row g-3">
                                <CCol md={4}>
                                    <CFormInput type="email" id="inputEmail4" label="Trọng lượng gói hàng (Pound)*" />
                                </CCol>
                                <CCol md={4}>
                                    <CFormCheck className='ms-3 mt-4' id="flexCheckIndeterminate" label="Không bán" indeterminate />
                                </CCol>
                                <CCol md={4}>
                                    <CFormCheck className='ms-3 mt-4' id="flexCheckIndeterminate" label="Thanh toán khi nhận hàng (COD)" indeterminate />
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput type="text" id="inputEmail4" label="Kích thước chiều dài gói hàng (Inch) " />
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput type="text" id="inputEmail4" label="Kích thước chiều rộng gói hàng (Inch)" />
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput type="text" id="inputEmail4" label="Kích thước chiều cao gói hàng (Inch)" />
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow className='mt-3'>
                <CCol xs={12} className='justify-content-center text-center'>
                    <CButton className='mb-5' color="info" onClick={redirect}>
                        Tạo Template
                    </CButton>
                </CCol>
            </CRow>
        </>
    )
}

export default AddTemplate;
