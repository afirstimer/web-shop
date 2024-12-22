import React, { useEffect } from 'react'
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
    CImage,
    CLink,
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
    cilInbox,
    cilPen,
    cilTrash,
    cilLinkAlt
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

const Products = () => {
    const tableExample = [
        {
            name: 'Icons',
            SKU: '123456789',
            avatar: avatar1,
            price: '1000.000đ',
            shop: {
                name: 'Sieu thi tien loi',
                code: '123456789',
            },
            user: {
                name: 'Nguyen Van A',
                avatar: avatar1,
                email: 'afiV7@example.com',
            },
            status: 'success',
        },
    ]

    return (
        <>
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Sản phẩm shop
                        <CButton color="warning" className="fw-semibold ms-2 mb-2" to="#">
                            <CIcon icon={cilReload} className="me-1" />
                        </CButton>
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                    <CButton color="primary" className="float-end">
                        <CIcon icon={cilPlus} /> Đăng sản phẩm
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
                                            <CIcon icon={cilInbox} /> Sản phẩm
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">

                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Giá
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Người Tạo/Thời gian tạo</CTableHeaderCell>
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
                                    {tableExample.map((item, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                <CAvatar
                                                    src={item.avatar}
                                                    className="img-avatar me-3"
                                                    alt="avatar"
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {item.name}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {item.price}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton color="default" size="sm">
                                                    <CAvatar
                                                        src={item.user.avatar}
                                                        className="img-avatar me-3"
                                                        alt="avatar"
                                                    />
                                                    {item.user.name}
                                                </CButton>
                                                <br />
                                                Ngày tạo: {item.createdAt}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {item.shop.name} - {item.shop.code}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton color={item.status} size="sm">{item.status}</CButton>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {item.SKU}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center d-none d-md-table-cell">
                                                <CButtonGroup>
                                                    <CButton className='me-2' color="warning" size="sm">
                                                        <CIcon icon={cilPen} className="me-2" />
                                                        Edit
                                                    </CButton>
                                                    <CButton className='me-2' color="danger" size="sm">
                                                        <CIcon icon={cilTrash} className="me-2" />
                                                        Delete
                                                    </CButton>
                                                    <CButton color="info" size="sm">
                                                        <CIcon icon={cilLinkAlt} className="me-2" />
                                                        View
                                                    </CButton>
                                                </CButtonGroup>
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

export default Products