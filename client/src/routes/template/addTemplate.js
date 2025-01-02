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
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import ImageUpload from 'react-image-easy-upload';

const AddTemplate = () => {
    const navigate = useNavigate();

    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [compliances, setCompliances] = useState([]);
    const [sku, setSku] = useState([]);

    // Logistic
    const [isSale, setIsSale] = useState(false);
    const [isCOD, setIsCOD] = useState(false);

    const [templateDescription, setTemplateDescription] = useState('{{description}}');

    const [formFields, setFormFields] = useState([]);

    // SKU Fields
    const [skuFields, setSkuFields] = useState([]);
    const [skuTempAttribute, setSkuTempAttribute] = useState(null);
    const [skuImage, setSkuImage] = useState("");

    const handleFieldChange = (fieldKey, value) => {
        const isExisting = formFields.some(item => item.id === fieldKey);
        if (!isExisting) {
            return setFormFields([...formFields, { id: fieldKey, value }]);
        } else {
            const updatedFormFields = formFields.map(item => {
                if (item.id === fieldKey) {
                    return { ...item, value };
                }
                return item;
            });
            return setFormFields(updatedFormFields);
        }
    };

    const handleAddSku = () => {
        if (!skuTempAttribute) {
            return;
        }
        const isExisting = skuFields.some(item => item.name === skuTempAttribute);
        if (isExisting) {
            return;
        }

        return setSkuFields([...skuFields, {
            id: Date.now().toString(),
            name: skuTempAttribute,
        }]);
    }

    const handleDeleteSku = (id) => {
        setSkuFields(skuFields.filter(item => item.id !== id));
    }

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
            setSku([]);
            setCategoryId(categoryId);
            const response = await apiRequest.get(`/categories/attributes?category_id=${categoryId}`);
            // loop response if item.is_required true add to attributes, otherwise add to compliances
            response.data.forEach(item => {
                if (item.type == 'PRODUCT_PROPERTY') {
                    if (item.is_customizable) {
                        setAttributes(prevAttributes => [...prevAttributes, {
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            options: item.values
                        }]);
                    } else {
                        setCompliances(prevCompliances => [...prevCompliances, {
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            options: item.values
                        }])
                    }
                } else {
                    setSku(prevSku => [...prevSku, {
                        id: item.id,
                        name: item.name,
                        type: item.type
                    }])
                }
            })
        } catch (error) {
            console.error('Error fetching attributes:', error);
        }
    };

    const redirect = () => {
        navigate('/templates');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            formData.append('formFields', JSON.stringify(formFields));
            formData.append('skuFields', JSON.stringify(skuFields));
            console.log(formData.get('formFields'));
            // redirect();
        } catch (error) {
            console.error('Error adding template:', error);
        }
    };

    return (
        <>
            <CButton className='mb-3' color="warning" onClick={redirect}>
                <CIcon icon={cilArrowLeft} className="me-1" /> Quay lại
            </CButton>
            <CForm method='post' onSubmit={handleSubmit}>
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
                                        <CFormInput id="name" name="name" type="email" label="Tên" required />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Loại</CFormLabel>
                                        <CFormSelect id='type' name='type' aria-label='Loại'>
                                            <option value='Dropshipping' selected>Dropshipping</option>
                                            <option value='POD'>POD</option>
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
                                        <CFormInput id="productTemplate" name='productTemplate' label="Tên" placeholder="" value='{{name}}' />
                                    </CCol>
                                    <CCol xs={12}>
                                        <CFormLabel>Mô tả</CFormLabel>
                                        <ReactQuill
                                            theme="snow"
                                            value={templateDescription}
                                            onChange={setTemplateDescription}
                                        />
                                    </CCol>
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="inputAddress2">Danh mục</CFormLabel>
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
                                    {attributes.map(field => (
                                        <>
                                            <DropdownSearch
                                                md={4}
                                                key={field.id}
                                                fieldData={field}
                                                value={formFields[field.id] || ''}
                                                onChange={(data) => handleFieldChange(data.id, data.value)}
                                                style='col-4'
                                            />
                                        </>
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
                                            <CFormLabel>{compliance.name}</CFormLabel>
                                            <CFormSelect aria-label="Product Compliance">
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
                                    {sku && sku.map((sku) => (
                                        <CRow className='mt-2'>
                                            <CCol md={4}>
                                                <CFormInput type="text" value={sku.name} label="Thuộc tính" disabled />
                                            </CCol>
                                            <CCol md={4}>
                                                <CFormInput type="text" value={skuTempAttribute} onChange={(e) => setSkuTempAttribute(e.target.value)} label="Giá trị" />
                                            </CCol>
                                            <CCol md={2}>
                                                <CButton className='mt-4 ms-5 circle float-start' color='warning' onClick={() => handleAddSku()} >
                                                    <CIcon icon={cilPlus} className="me-1" />
                                                    Tạo
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    ))}
                                </CForm>
                                {skuFields && skuFields.map(row => (
                                    <CRow key={row.id} className="mb-3 border p-3 rounded">
                                        <CRow>
                                            <ImageUpload
                                                setImage={setSkuImage}
                                                width="150px"
                                                height="150px"
                                                shape="square"
                                            />
                                            <CCol col='auto'>
                                                {row.name && <CFormLabel>{row.name}</CFormLabel>}
                                            </CCol>
                                            <CCol col={3}>
                                                <CInputGroup className="mt-5">
                                                    <CInputGroupText>Giá</CInputGroupText>
                                                    <CFormInput aria-label="Amount (to the nearest dollar)" value='0' />
                                                    <CInputGroupText>$</CInputGroupText>
                                                </CInputGroup>
                                            </CCol>
                                            <CCol col={3}>
                                                <CInputGroup className="mt-5">
                                                    <CInputGroupText id="basic-addon3">Số lượng</CInputGroupText>
                                                    <CFormInput id="basic-url" value='0' aria-describedby="basic-addon3" />
                                                </CInputGroup>
                                            </CCol>
                                            <CCol col={3}>
                                                <CInputGroup className="mt-5">
                                                    <CInputGroupText id="basic-addon3">SKU</CInputGroupText>
                                                    <CFormInput id="basic-url" aria-describedby="basic-addon3" value='{{code}}' />
                                                </CInputGroup>
                                            </CCol>
                                            <CCol col={2}>
                                                <CButton color="danger" className="mt-5" onClick={() => handleDeleteSku(row.id)}>
                                                    <CIcon icon={cilTrash} className="me-1" /> Xóa
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CRow>
                                ))}
                                <CForm className="row row-cols-lg-auto g-3 align-items-center mt-3">
                                    <CRow col={12}>
                                        <CFormLabel htmlFor="inputPassword4">Mặc định</CFormLabel>
                                    </CRow>
                                    <CRow>
                                        <CCol col={3}>
                                            <CInputGroup className="mb-3">
                                                <CDropdown variant="input-group">
                                                    <CDropdownToggle color="secondary" variant="outline">GTIN</CDropdownToggle>
                                                    <CDropdownMenu>
                                                        <CDropdownItem>EAN</CDropdownItem>
                                                        <CDropdownItem>UPC</CDropdownItem>
                                                        <CDropdownItem>ISBN</CDropdownItem>
                                                    </CDropdownMenu>
                                                </CDropdown>
                                                <CFormInput aria-label="Text input with dropdown button" />
                                            </CInputGroup>
                                        </CCol>
                                        <CCol col={3}>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>Giá</CInputGroupText>
                                                <CFormInput aria-label="Amount (to the nearest dollar)" value='0' />
                                                <CInputGroupText>$</CInputGroupText>
                                            </CInputGroup>
                                        </CCol>
                                        <CCol col={3}>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText id="basic-addon3">Số lượng</CInputGroupText>
                                                <CFormInput id="basic-url" value='0' aria-describedby="basic-addon3" />
                                            </CInputGroup>
                                        </CCol>
                                        <CCol col={3}>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText id="basic-addon3">Seller SKU</CInputGroupText>
                                                <CFormInput id="basic-url" aria-describedby="basic-addon3" value='{{code}}' />
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
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
                                        <CFormInput type="email" id="inputEmail4" label="Trọng lượng gói hàng (Pound)*" value='1' />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel className='col-12'>Đang giảm giá</CFormLabel>
                                        <Toggle
                                            className='mt-2 me-2'
                                            defaultChecked={isSale}
                                            name='isSale'
                                            value='yes'
                                            onChange={(e) => setIsSale(e.target.checked)}
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel className='col-12'>Thanh toán khi nhận hàng (COD)</CFormLabel>
                                        <Toggle
                                            className='mt-2 me-2'
                                            defaultChecked={isCOD}
                                            name='isCOD'
                                            value='yes'
                                            onChange={(e) => setIsCOD(e.target.checked)}
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormInput type="text" id="inputEmail4" label="Kích thước chiều dài gói hàng (Inch) " value='1' />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormInput type="text" id="inputEmail4" label="Kích thước chiều rộng gói hàng (Inch)" value='1' />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormInput type="text" id="inputEmail4" label="Kích thước chiều cao gói hàng (Inch)" value='1' />
                                    </CCol>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow className='mt-3'>
                    <CCol xs={12} className='justify-content-center text-center'>
                        <CButton type='submit' className='mb-5' color="primary">
                            Tạo Template
                        </CButton>
                    </CCol>
                </CRow>
            </CForm>
        </>
    )
}

export default AddTemplate;
