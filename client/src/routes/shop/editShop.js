import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormText,
    CFormTextarea,
    CImage,
    CLink,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CToast,
    CToastBody,
    CToastHeader
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import DOMPurify from "dompurify";
import CIcon from "@coreui/icons-react";
import { cilBell, cilPlus, cilTrash, cilX } from "@coreui/icons";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import MultiSelect from "multiselect-react-dropdown";
import { ToastNoti } from "../../components/notification/ToastNoti";

const EditShop = ({ visible, setVisible, shop }) => {

    // set noti
    const [toast, setToast] = useState(null);

    const [images, setImages] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const STATUS_ENUMS = ['CONNECTED', 'DISCONNECTED'];

    const [shopName, setShopName] = useState(shop.name);
    const [shopTeamId, setShopTeamId] = useState(shop.teamId);
    const [shopProfile, setShopProfile] = useState(shop.profile || "");
    const [shopCode, setShopCode] = useState(shop.code);
    const [shopCreatedBy, setShopCreatedBy] = useState(shop.createdBy);
    const [shopPriceDiff, setShopPriceDiff] = useState(shop.priceDiff);
    const [shopItems, setShopItems] = useState(shop.shopItems);
    const [shopStatus, setShopStatus] = useState(shop.status);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                apiRequest.get('/teams')
                    .then(res => {
                        setTeams(res.data.teams);
                    })
            } catch (error) {
                console.log(error);
            }
        }

        fetchTeams();
        setImages(shop.images);
    }, [shop]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (selectedTeam === null) {
                    return;
                }
                apiRequest.get(`/users/ids/${selectedTeam}`).then(res => {
                    if (res.data.length === 0) {
                        handleShowToast("Chưa có user nào trong nhóm");
                        setUsers([]);
                    }
                    setUsers(res.data);
                })
            } catch (error) {
                console.log(error);
            }
        }

        setUsers([]);
        fetchUsers();
    }, [selectedTeam, shopTeamId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: shopName || shop.name,
                profile: shopProfile || shop.profile,
                code: shopCode || shop.code,
                priceDiff: shopPriceDiff || shop.priceDiff,
                shopItems: shopItems || shop.shopItems,                
                images: JSON.stringify(images),
                teamId: selectedTeam,
                managers: JSON.stringify(selectedUsers),
                status: shopStatus || shop.status,
            }
            
            const res = await apiRequest.put(`/shops/${shop.id}`, payload);
            setVisible(false);
        } catch (error) {
            console.log(error);
        }
    }

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

    const handleSelectUsers = (selectedList, selectedItem) => {
        setSelectedUsers(selectedList.map(item => item.id));
    }

    return (
        <>
            <ToastNoti toast={toast} setToast={setToast} />
            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
                alignment="center"
                size="lg"
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel">Cập nhật shop #{shop.sku}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mt-3">
                        <CCol md={6}>
                            <CFormInput type="text" id="name" name="name" label="Shop name" value={shop && shop.name} onChange={(e) => setShopName(e.target.value)}/>
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="profile" name="profile" label="Profile name" value={shopProfile} onChange={(e) => setShopProfile(e.target.value)}/>
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={6}>
                            <CFormInput type="text" id="code" name="code" label="Shop code" value={shop && shop.code}  onChange={(e) => setShopCode(e.target.value)}/>
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="createdBy" name="createdBy" label="Created by" value={shop && shop.User && shop.User.username} readOnly disabled/>
                        </CCol>
                    </CRow>
                    <CRow className="mt-3 mb-5">
                        <CCol md={12}>
                            <CFormLabel className="col-2 col-form-label">
                                Nhóm
                            </CFormLabel>
                            <CFormSelect aria-label="Default select example" value={selectedTeam} defaultValue={shop.teamId} onChange={(e) => setSelectedTeam(e.target.value)}>
                                <option>--Chọn team--</option>
                                {teams && teams.map((team, index) => (
                                    <option key={index} value={team.id}>{team.name}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mt-3 mb-5">
                        <CCol md={12}>
                            <CFormLabel className="col-2 col-form-label">
                                Người quản lý
                            </CFormLabel>
                            <MultiSelect
                                options={users}
                                displayValue="username"
                                onSelect={handleSelectUsers}
                                onRemove={handleSelectUsers}
                                placeholder="Select Status"
                                selectedValues={selectedUsers}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={6}>
                            <CFormInput type="text" id="priceDiff" name="priceDiff" label="Price List" value={shopPriceDiff}  onChange={(e) => setShopPriceDiff(e.target.value)}/>
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="shopItems" name="shopItems" label="Quantity" value={shopItems} onChange={(e) => setShopItems(e.target.value)} />
                        </CCol>
                    </CRow>
                    <CRow className="clearfix">
                        <CFormLabel className="col-2 col-form-label">
                            Images Frames
                        </CFormLabel>
                        {shop && images && images.map((image, index) => (
                            <CCol xs={3} key={index} className="position-relative">
                                <CImage
                                    className="m-2 img-thumbnail"
                                    rounded
                                    src={image}
                                    width={100}
                                    height={100}
                                />
                                <CIcon icon={cilX} className="position-absolute top-0 float-start text-danger fw-bold"
                                    onClick={() => {
                                        const newImages = images.filter((img, i) => i !== index);
                                        setImages(newImages);
                                    }} />
                            </CCol>
                        ))}
                        <div className="text-center">
                            <UploadWidget
                                uwConfig={{
                                    multiple: true,
                                    cloudName: "dg5multm4",
                                    uploadPreset: "estate_3979",
                                    folder: "posts",
                                }}
                                setState={setImages}
                            />
                        </div>
                    </CRow>
                    <CRow className="mt-3 mb-5">
                        <CCol md={12}>
                            <CFormLabel>
                                Status
                            </CFormLabel>
                            <CFormSelect aria-label="Default select example" defaultValue={shop && shop.status} onChange={(e) => setShopStatus(e.target.value)}>
                                <option>--Chọn status--</option>
                                {STATUS_ENUMS.map((status, index) => (
                                    <option key={index} value={status}>{status}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <div className="clearfix"></div>
                    <CRow className="mt-5 d-flex justify-content-center" >
                        <CButton color="primary" className=" col-3" onClick={handleSubmit}>
                            Cập nhật
                        </CButton>
                    </CRow>
                </CModalBody>
            </CModal>
        </>
    );
};

export default EditShop
