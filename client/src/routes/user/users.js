import React, { useEffect, useState } from 'react'

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
    cilPencil,
    cilTrash
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
import EditUser from './editUser'

import apiRequest from '../../lib/apiRequest'
import {format} from 'timeago.js'

const Users = () => {
    const [users, setUsers] = useState([])
    const [teams, setTeams] = useState([])

    const [visibleEdit, setVisibleEdit] = useState(false)
    const [selectUser, setSelectUser] = useState({})

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiRequest.get('/users');                    
                setUsers(response.data)
            } catch (error) {
                console.log(error);
            }
        }

        fetchUsers();
    }, []);

    const handleEditUser = (user) => {
        setVisibleEdit(true)
        setSelectUser(user)
    }

    return (
        <>
            <EditUser visible={visibleEdit} setVisible={setVisibleEdit} user={selectUser} />
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Danh sách user
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                    <CButton color="primary" className="float-end mb-2">
                        <CIcon icon={cilPlus} /> Tạo mới tài khoản
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
                                            Account
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className='bg-body-tertiary'>
                                            Email
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            Ngày tạo
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            Nhóm
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            #
                                        </CTableHeaderCell>                                        
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {users.map((user, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                <div>{user.username}</div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div>{user.email}</div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div>{format(user.createdAt)}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="">
                                                {user.Team && user.Team.name ? user.Team.name : "Chưa có nhóm"}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton color="info" size="sm" className='text-white' onClick={() => handleEditUser(user)}>
                                                    <CIcon icon={cilPencil} className="me-2" />
                                                    Sửa tài khoản
                                                </CButton>
                                                <CButton color="danger" size="sm" className="ms-2 text-white">
                                                    <CIcon icon={cilTrash} className="me-2" />
                                                    Xóa
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

export default Users
