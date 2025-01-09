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
    cilGroup
} from '@coreui/icons'

import apiRequest from '../../lib/apiRequest'
import AddTeam from './addTeam'
import AddMember from './addMember'
import Toggle from 'react-toggle'
import "react-toggle/style.css";

const Teams = () => {
    const [visibleAddTeam, setVisibleAddTeam] = useState(false)    
    const [selectedTeam, setSelectedTeam] = useState(null)
    const [visibleMember, setVisibleMember] = useState(false)
    const [teams, setTeams] = useState([])
    const [flagAddTeam, setFlagAddTeam] = useState(null)

    useEffect(() => {
        const getTeams = async () => {
            const res = await apiRequest.get('/teams')
            setTeams(res.data)
        }
        getTeams()
        setFlagAddTeam(null)
    }, [flagAddTeam]);

    const handleSelectTeam = (team) => {
        setSelectedTeam(team)
        setVisibleMember(true)
    }    

    const toggleTeamStatus = async (team) => {
        try {
            await apiRequest.put(`/teams/${team.id}`, { isActive: team.isActive ? 0 : 1 });
            setFlagAddTeam(1)
        } catch (error) {
            console.log(error);
        }
    }

    const onChange = () => {
        setFlagAddTeam(1)
    }

    return (
        <>
            <AddTeam visible={visibleAddTeam} setVisible={setVisibleAddTeam} onChange={onChange}/>
            <AddMember visible={visibleMember} setVisible={setVisibleMember} onChange={onChange} team={selectedTeam}/>
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Danh sách nhóm
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block mb-3">
                    <CButton color="primary" className="float-end" onClick={() => setVisibleAddTeam(true)}>
                        <CIcon icon={cilPlus} /> Tạo nhóm
                    </CButton>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardBody>
                            <CTable align="middle" className="mb-0" responsive>
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
                                    {teams.map((team, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                {team.name}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{team.members.length}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <Toggle
                                                    className='mt-2 me-2'
                                                    defaultChecked={team.isActive}
                                                    id="isActive"
                                                    name='isActive'
                                                    value={team.isActive ? "yes" : "no"}   
                                                    onChange={() => toggleTeamStatus(team)}                                                 
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButton color='warning' size="sm" className='ms-2' onClick={() => handleSelectTeam(team)}>
                                                    <CIcon icon={cilGroup} className="me-2 " />
                                                    Thành viên
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
