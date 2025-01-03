import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useState } from 'react'

import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
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
    cilTrash,
    cilLinkAlt,
    cilPencil
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
import DeleteTemplate from './deleteTemplate'

import apiRequest from '../../lib/apiRequest'
import { useNavigate } from 'react-router-dom'

const Templates = () => {
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const tableExample = [
        {
            name: 'BABY BOOK',
            type: 'DROPSHIPPING',
            category: 'Picture Books',
            user: {
                name: 'Nguyen Van A',
                avatar: avatar1,
                email: 'afiV7@example.com',
            }
        },
    ]    

    const addTemplate = () => {
        navigate('/template/add')
    }

    return (
        <>
            <DeleteTemplate visible={visible} setVisible={setVisible} />
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Danh sách template
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                    <CButton color="primary" className="float-end" onClick={() => addTemplate()}>
                        <CIcon icon={cilPlus} /> Thêm mới Template
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
                                            <CIcon icon={cilHouse} /> Template
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Loại
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Danh mục
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Người Tạo</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Chức năng</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {tableExample.map((item, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                <div>{item.name}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.type}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton color={item.status} size="sm">
                                                    {item.category}
                                                </CButton>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButton color="info" size="sm">
                                                    <CAvatar size="md" src={item.user.avatar} />
                                                    {item.user.name}
                                                </CButton>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center d-none d-md-table-cell">
                                                <CButton className='me-2' color="warning" size="sm">
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

export default Templates