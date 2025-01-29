import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import {
    CAvatar,
    CBadge,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormCheck,
    CFormInput,
    CImage,
    CInputGroup,
    CLink,
    CPagination,
    CPaginationItem,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CToast,
    CToastBody,
    CToastHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
    cilPlus,
    cilHouse,
    cilReload,
    cilInbox,
    cilPen,
    cilTrash,
    cilLinkAlt,
    cilBell,
    cilCog
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../../views/widgets/WidgetsBrand'
import WidgetsDropdown from '../../views/widgets/WidgetsDropdown'
import MainChart from '../../views/dashboard/MainChart'

import { format } from 'timeago.js'
import apiRequest from '../../lib/apiRequest'
import MultiSelect from 'multiselect-react-dropdown'

const Products = () => {
    const [products, setProducts] = useState([])

    // paging
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');

    // Toast
    const [toast, setToast] = useState(null);

    // nút [đăng san pham]
    const [uploadStatusBtn, setUploadStatusBtn] = useState(false);

    // checkbox
    const [selectAll, setSelectAll] = useState(false);

    // search
    const [searchTerm, setSearchTerm] = useState('');

    // enum
    const StatusEnum = {
        PRODUCT_STATUS: [
            { id: 'IN_REVIEW', name: 'IN-REVIEW' },
            { id: 'DRAFT', name: 'DRAFT' },
            { id: 'FAILED', name: 'FAILED' },
            { id: 'ACTIVATE', name: 'ACTIVATE' },
            { id: 'SELLER_DEACTIVATED', name: 'SELLER_DEACTIVATED' },
            { id: 'ACCOUNT_DEACTIVATED', name: 'ACCOUNT_DEACTIVATED' },
            { id: 'FREEZE', name: 'FREEZE' },
            { id: 'DELETED', name: 'DELETED' }
        ],
        PUBLISH_STATUS: [
            { id: 'PENDING', name: 'PENDING' },
            { id: 'PROCESSING', name: 'PROCESSING' },
            { id: 'ERROR', name: 'ERROR' },
            { id: 'NOT_PUBLISHED', name: 'NOT_PUBLISHED' }
        ]
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiRequest.get('/products', {
                    params: {
                        page,
                        limit,
                        sort
                    }
                });

                setProducts(res.data.products);
                setTotal(res.data.total);
                setTotalPages(Math.ceil(res.data.total / limit));
            } catch (error) {
                console.log(error);
            }
        }

        fetchProducts();
    }, [page, limit, sort]);

    useEffect(() => {
        const searchedProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesSearch;
        });
        setProducts(searchedProducts);
    }, [searchTerm]);

    const handleShowToast = (message) => {
        setToast(
            <CToast>
                <CToastHeader closeButton>
                    <CIcon icon={cilBell} className="me-2" />
                    <div className="fw-bold me-auto">Thông báo hệ thống</div>
                    <small>Just now</small>
                </CToastHeader>
                <CToastBody>{message}</CToastBody>
            </CToast>
        )
    }

    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <CPaginationItem key={i} active={i === page} onClick={() => handlePageChange(i)}>{i}</CPaginationItem>
            );
        }
        return pageNumbers;
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }

    const handleLimitChange = (limit) => {
        setLimit(limit);
    }

    const handleSortChange = (sort) => {
        console.log(sort);
        setSort(sort);
        setPage(1);
    }

    const handleSearchChange = (e) => {
        e.preventDefault();
        if (!e.target.value) {
            window.location.reload();
        }
        setSearchTerm(e.target.value);
    }

    // search filter
    const searchBy = (selectedList, selectedItem) => {
        console.log(selectedList);
    }

    // checkbox
    const handleHeaderCheckboxChange = (e) => {
        e.preventDefault();
        const newSelectAll = !selectAll;
        setUploadStatusBtn(newSelectAll);
        setSelectAll(newSelectAll);
        setProducts(products.map(product => {
            return {
                ...product,
                checked: newSelectAll
            }
        }))
    }

    const handleProductCheckboxChange = (e, id) => {
        e.preventDefault();
        const checkProducts = products.map(product => {
            if (product.id === id) {
                return {
                    ...product,
                    checked: !product.checked
                }
            }
            return product;
        });
        setProducts(checkProducts);
        setUploadStatusBtn(checkProducts.some(product => product.checked));
        setSelectAll(checkProducts.every(product => product.checked));
    }

    return (
        <>
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Sản phẩm shop
                        <CButton color="warning" className="ms-2 mb-2" onClick={() => setVisibleCrawl(!visibleCrawl)}>
                            <CIcon icon={cilReload} className="me-1" />
                        </CButton>
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                    <CButton color="primary" className="float-end" disabled={!uploadStatusBtn} onClick={() => callUpload()}>
                        <CIcon icon={cilPlus} /> Đăng sản phẩm
                    </CButton>
                </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder="Tìm theo mã hoặc tên"
                            aria-label="Tìm theo mã hoặc tên"
                            aria-describedby="basic-addon2"
                            onChange={handleSearchChange}
                        />
                    </CInputGroup>
                </CCol>
                <CCol>
                    <MultiSelect
                        displayValue='name'
                        options={StatusEnum.PRODUCT_STATUS}
                        onSelect={searchBy}
                        placeholder='Trạng thái sản phẩm'
                    />
                </CCol>
                <CCol>
                    <CDropdown>
                        <CDropdownToggle color='white'>
                            <CIcon icon={cilCog} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem>
                                <strong>HIỂN THỊ</strong>
                            </CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(10)} className={limit === 10 ? 'active' : ''}>10</CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(20)} className={limit === 20 ? 'active' : ''}>20</CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(50)} className={limit === 50 ? 'active' : ''}>50</CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(100)} className={limit === 100 ? 'active' : ''}>100</CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(500)} className={limit === 500 ? 'active' : ''}>500</CDropdownItem>
                            <CDropdownDivider />
                            <CDropdownItem>
                                <strong>SẮP XẾP THEO</strong>
                            </CDropdownItem>
                            <CDropdownItem onClick={() => handleSortChange("newest")} className={sort === "newest" ? 'active' : ''}>Mới nhất</CDropdownItem>
                            <CDropdownItem onClick={() => handleSortChange("oldest")} className={sort === "oldest" ? 'active' : ''}>Cũ nhất</CDropdownItem>
                            <CDropdownItem onClick={() => handleSortChange("updated_newest")} className={sort === "updated_newest" ? 'active' : ''}>Cập nhật mới nhất</CDropdownItem>
                            <CDropdownItem onClick={() => handleSortChange("updated_oldest")} className={sort === "updated_oldest" ? 'active' : ''}>Cập nhật cũ nhất</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardBody>
                            <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            <CFormCheck
                                                className="form-check-input checkAddListing"
                                                checked={selectAll}
                                                onChange={(e) => handleHeaderCheckboxChange(e)}
                                            />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            <CIcon icon={cilInbox} /> Sản phẩm
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">

                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Giá
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Time</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Cửa hàng
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Trạng thái
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center d-none d-md-table-cell">
                                            SKU
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Chức năng</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {products.map((product, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                <CFormCheck
                                                    className="form-check-input"
                                                    checked={product.checked}
                                                    onChange={(e) => handleProductCheckboxChange(e, product.id)}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CImage
                                                    src={product.listing.images[0]}
                                                    className="img-avatar me-3"
                                                    alt="avatar"
                                                    width={100}
                                                    height={100}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {product.name}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {product.price}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {format(product.createdAt)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {product.shop.name}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {product.listingOnShop && product.listingOnShop.status === 'SUCCESS' ?
                                                    <CBadge color='success'>ACTIVE</CBadge> :
                                                    <>
                                                        <CBadge color='danger'>ERROR</CBadge>
                                                        <CLink color='info' href='#' target="_blank">
                                                            <CIcon icon={cilReload} className="me-2" />
                                                        </CLink>
                                                    </>
                                                }
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {product.listing.sku}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center d-none d-md-table-cell">
                                                <CButtonGroup className='d-flex flex-column'>
                                                    <CButton className='me-2 mb-2' color="warning" size="sm">
                                                        <CIcon icon={cilPen} className="me-2" />
                                                        Sửa
                                                    </CButton>
                                                    <CButton className='me-2 mb-2' color="danger" size="sm">
                                                        <CIcon icon={cilTrash} className="me-2" />
                                                        Xóa
                                                    </CButton>
                                                    <CButton color="info" size="sm">
                                                        <CIcon icon={cilLinkAlt} className="me-2" />
                                                        Xem
                                                    </CButton>
                                                </CButtonGroup>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                            <CPagination className='d-flex justify-content-center mt-3' aria-label="Page navigation example">
                                <CPaginationItem
                                    aria-label="Previous"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                >
                                    <span aria-hidden="true">&laquo;</span>
                                </CPaginationItem>
                                {renderPagination()}
                                <CPaginationItem
                                    aria-label="Next"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    <span aria-hidden="true">&raquo;</span>
                                </CPaginationItem>
                            </CPagination>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Products