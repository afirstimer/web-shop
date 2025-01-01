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
import DropdownSearch from '../../components/dropdownSearch/DropdownSearch';

const AddTemplate = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [compliances, setCompliances] = useState([]);

    const [translator, setTranslator] = useState('');
    const translatorOptions = ['John Doe', 'Jane Smith', 'Alice Johnson'];

    function transformToTree(data) {
        // Map to store nodes by tiktokId for quick lookup
        const nodeMap = new Map();

        // Final tree structure
        const tree = [];

        // Step 1: Initialize nodes with their basic structure
        data.forEach((item) => {
            const node = {
                id: item.id,
                label: item.name,
                tiktokId: item.tiktokId,
                level: item.tiktokParentId === "0" ? 0 : null, // Level will be adjusted later
                children: [],
            };
            nodeMap.set(item.tiktokId, node);
        });

        // Step 2: Build the tree by assigning children to their parents
        data.forEach((item) => {
            const node = nodeMap.get(item.tiktokId);

            if (item.tiktokParentId === "0") {
                // Top-level nodes go directly to the tree
                tree.push(node);
            } else {
                // Find the parent and add this node to its children
                const parent = nodeMap.get(item.tiktokParentId);
                if (parent) {
                    node.level = (parent.level || 0) + 1;
                    parent.children.push(node);
                }
            }
        });

        return tree;
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiRequest.get('/categories');
                const treeData = transformToTree(response.data);
                setCategories(treeData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const fetchAttributes = async (categoryId) => {
        try {
            setAttributes([]);
            setCompliances([]);
            const response = await apiRequest.get(`/categories/attributes?app_key=6eouk0lpquf3t&secret=09c1877519822f00aafbc33b78e9b24737d196d2&access_token=TTP_5lsWywAAAACGD35nn-1nOBdSlf-vOZILHEhx2xvOPmORipHkKr9hf_CrJk-FwaO3IAk5NNhEmYtuu0EOZGvv4SHA30u8RSt3DdT2kn2L7q0rxqhopx5h88bxbiK_vuXyMwXqotEixK3IQluS6jkf1mCcj95xISTnmmy78gdCBJRU6_4LI3D4BA&shop_id=67658ae074770469c66f6b2c&category_version=v2&category_id=${categoryId}`);
            // loop response if item.is_required true add to attributes, otherwise add to compliances
            response.data.forEach(item => {
                if (item.is_required) {
                    setAttributes(prevAttributes => [...prevAttributes, item]);
                } else {
                    setCompliances(prevCompliances => [...prevCompliances, item]);
                }
            })
        } catch (error) {
            console.error('Error fetching attributes:', error);
        }
    };

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
                                    <DropdownSearch
                                        label="Translator"
                                        options={translatorOptions}
                                        value={translator}
                                        setValue={setTranslator}
                                    />
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
                                    <CFormInput id="inputAddress" label="Tên" placeholder="" />
                                </CCol>
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="inputAddress2">Mô tả</CFormLabel>
                                    <ReactQuill theme="snow" />
                                </CCol>
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="inputAddress2">Danh mục</CFormLabel>
                                </CCol>
                                <CCol xs={12}>
                                    <TreeSelect treeData={categories} onCategorySelect={fetchAttributes} />
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
                                {attributes.map((attribute, index) => (
                                    <CCol md={4} key={index}>
                                        <CFormLabel htmlFor="validationDefault01">{attribute.name}</CFormLabel>
                                        <CFormSelect aria-label="Default select example">
                                            {attribute.options && attribute.options.map((value, index) => (
                                                <option key={index}>{value.name}</option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                ))}
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
                                {compliances.map((compliance, index) => (
                                    <CCol md={4} key={index}>
                                        <CFormLabel htmlFor="validationDefault01">{compliance.name}</CFormLabel>
                                        <CFormSelect aria-label="Default select example">
                                            {compliance.options && compliance.options.map((value, index) => (
                                                <option key={index}>{value.name}</option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                ))}
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
                                    <CFormLabel htmlFor="inputPassword4">Attribute</CFormLabel>
                                    <CFormSelect aria-label="Default select example">
                                        <option>Open this select menu</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol md={5}>
                                    <CFormInput type="password" id="inputPassword4" label="Value" />
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
