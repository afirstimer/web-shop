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

import apiRequest from '../../lib/apiRequest'
import AddTeam from './addTeam'

const Teams = () => {
    const [visibleAddTeam, setVisibleAddTeam] = useState(false)
    const [teams, setTeams] = useState([])

    useEffect(() => {
        const getTeams = async () => {
            const res = await apiRequest.get('/team')
            setTeams(res.data)
        }
        getTeams()
    }, [])

    return (
        <>
            <AddTeam visible={visibleAddTeam} setVisible={setVisibleAddTeam} />
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Danh sách nhóm
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                    <CButton color="primary" className="float-end" onClick={() => setVisibleAddTeam(true)}>
                        <CIcon icon={cilPlus}/> Tạo nhóm
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
                                        <CTableHeaderCell className="bg-body-tertiary">Nhóm</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Số thành viên
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Tình trạng
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {teams.map((item, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                <div>{item.name}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.members.length}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton color={item.isActive ? 'success' : 'danger'} size="sm">
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </CButton>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButton color="info" size="sm">
                                                    <CIcon icon={cilPencil} className="me-2" />
                                                    Sửa nhóm
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

export default Teams
