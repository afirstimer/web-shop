import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CFormInput,
    CFormSelect,
    CImage,
    CInputGroup,
    CInputGroupText,
    CLink,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
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
    cilPencil,
    cilTrash,
    cilEyedropper,
    cilLinkAlt,
    cilSearch,
    cilFilter
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

import apiRequest from '../../lib/apiRequest'
import DeleteListing from './deleteListing'
import CrawlListing from './crawlListing'
import { useNavigate } from 'react-router-dom'

const Listings = () => {
    const [visible, setVisible] = useState(false)
    const [visibleCrawl, setVisibleCrawl] = useState(false)
    const navigate = useNavigate();

    const tableExample = [
        {
            name: 'Eco Tools',
            image: avatar1,
            price: '1.000.000đ',
            createdAt: '2022-01-01',
            shop: 'ABC Mart'
        },
    ]

    const viewDetail = () => {
        navigate('/listing');
    }

    return (
        <>        
            <DeleteListing visible={visible} setVisible={setVisible} />    
            <CrawlListing visible={visibleCrawl} setVisible={setVisibleCrawl} />
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Sản phẩm cào
                        <CButton color="warning" className="ms-2 mb-2" onClick={() => setVisibleCrawl(!visibleCrawl)}>
                            <CIcon icon={cilReload} className="me-1" />
                        </CButton>
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                    <CButton color="primary" className="float-end" onClick={viewDetail}>
                        <CIcon icon={cilPlus} /> Đăng sản phẩm
                    </CButton>
                </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <CInputGroup className="mb-3">
                        <CFormInput placeholder="Tìm theo mã hoặc tên" aria-label="Tìm theo mã hoặc tên" aria-describedby="basic-addon2" />
                        <CInputGroupText id="basic-addon2">
                            <CIcon icon={cilSearch} />
                        </CInputGroupText>
                    </CInputGroup>
                </CCol>
                <CCol>
                    <CFormSelect
                        aria-label="Trạng thái sản phẩm"
                        options={[
                            'Trạng thái sản phẩm',
                            { label: 'One', value: '1' },
                            { label: 'Two', value: '2' },
                            { label: 'Three', value: '3', disabled: true }
                        ]}
                    />
                </CCol>
                <CCol>
                    <CFormSelect
                        aria-label="Trạng thái đăng sản phẩm"
                        options={[
                            'Trạng thái đăng sản phẩm',
                            { label: 'One', value: '1' },
                            { label: 'Two', value: '2' },
                            { label: 'Three', value: '3', disabled: true }
                        ]}
                    />
                </CCol>
                <CCol>
                    <CButton color="warning">
                        <CIcon icon={cilFilter} /> Lọc
                    </CButton>
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
                                            <CIcon icon={cilHouse} /> Sản phẩm
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">

                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Giá
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            Crawed lúc
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Cửa hàng đăng lên
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Chức năng</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {tableExample.map((item, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                <CAvatar src={item.image} className='rounded' />
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.name}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.price}</div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div>{item.createdAt}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.shop}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center d-none d-md-table-cell">
                                                <CButton className='me-2' color="warning" size="sm" onClick={viewDetail}>
                                                    <CIcon icon={cilPencil} className="me-2" />
                                                    Update
                                                </CButton>
                                                <CButton className='me-2' color="danger" size="sm" onClick={() => setVisible(!visible)}>
                                                    <CIcon icon={cilTrash} className="me-2" />
                                                    Delete
                                                </CButton>
                                                <CButton color="info" size="sm">
                                                    <CIcon icon={cilLinkAlt} className="me-2" />
                                                    View
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Listings