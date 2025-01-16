import React, { useEffect, useState } from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CForm, CRow, CFormInput, CFormLabel, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAvatar, CCol } from "@coreui/react";
import apiRequest from "../../lib/apiRequest";
import MultiSelect from 'multiselect-react-dropdown'
import { ToastNoti } from "../../components/notification/ToastNoti";
import { cilCaretRight, cilPencil, cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import "./uploadToShop.css";
import Toggle from 'react-toggle'
import "react-toggle/style.css";

const UploadToShop = ({ visible, setVisible, listings }) => {

    const [shops, setShops] = useState([]);
    const [templates, setTemplates] = useState([]);
    // step 2 - review listings
    const [isStep2, setIsStep2] = useState(false);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const shops = await apiRequest.get(`/shops`);
                setShops(shops.data.shops);
            } catch (error) {
                console.log(error);
            }
        }
        fetchShops();
        console.log(listings);
    }, [listings]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const templates = await apiRequest.get(`/templates`);
                setTemplates(templates.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchTemplates();
    }, [shops]);

    return (
        <>
            <ChooseTemplate visible={visible} setVisible={setVisible} shops={shops} templates={templates} onChange={() => setIsStep2(true)} />
            <ChooseListings visible={isStep2} setVisible={setIsStep2} listings={listings} />
        </>
    );
};

const ChooseTemplate = ({ visible, setVisible, shops, templates, onChange }) => {

    const goToStep2 = () => {
        setVisible(false);
        onChange();
    }

    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">Đăng sản phẩm</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm>
                    <CRow className="mb-3" controlId="exampleForm.ControlInput1">
                        <CFormLabel>Chọn cửa hàng</CFormLabel>
                        <MultiSelect
                            displayValue='name'
                            options={shops}
                        />
                    </CRow>
                    <CRow className="mb-3" controlId="exampleForm.ControlInput1">
                        <CFormLabel>Chọn mẫu</CFormLabel>
                        <MultiSelect
                            displayValue='name'
                            options={templates}
                        />
                    </CRow>
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton type="submit" color="primary" className="col-8 me-5" onClick={goToStep2}>
                    Đăng sản phẩm
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

const ChooseListings = ({ visible, setVisible, listings }) => {
    const [toast, setToast] = useState(null);
    const [selectedListings, setSelectedListings] = useState([]);

    useEffect(() => {
        listings && setSelectedListings(listings);
    }, [listings]);

    const handleShowToast = () => {
        setToast(
            <CToast>
                <CToastHeader closeButton>
                    <CIcon icon={cilBell} className="me-2" />
                    <div className="fw-bold me-auto">Thông báo hệ thống</div>
                    <small>Just now</small>
                </CToastHeader>
                <CToastBody>Thêm thành viên vào nhóm thanh cong!</CToastBody>
            </CToast>
        )
    }


    const closeModal = () => {
        // onChange();
        setVisible(false)
    };

    return (
        <div className="app">
            <CModal visible={visible} onClose={closeModal} alignment="center" size="xl" scrollable>
                <CModalHeader>
                    <CModalTitle>Quản lý nhóm</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <ToastNoti toast={toast} setToast={setToast} />
                    <div className="modal-body">
                        <div className="column input-section">
                            <h5>Preview</h5>
                            <CRow className="mt-3">
                                <CFormLabel className="col-4" controlId="exampleForm.ControlInput1">
                                    Shop: <code>Shop1, Shop2, Shop3 </code>
                                </CFormLabel>
                            </CRow>
                            <CRow className="mt-3">
                                <CFormLabel className="col-4">
                                    Template: <code>Template1, Template2</code>
                                </CFormLabel>
                            </CRow>
                        </div>
                        <div className="column product-list">
                            <div className="header-fixed">
                                <h5>Listings</h5>
                                <div className="float-end">
                                    <Toggle
                                        className='mt-2 me-2'
                                        defaultChecked={false}
                                        id="iSale"
                                        name='isSale'
                                        value='yes'
                                        // onChange={(e) => setIsSale(e.target.checked)}
                                    />
                                    Sửa tên
                                </div>
                            </div>
                            <div className="scrollable">
                                {selectedListings.length > 0 ? (
                                    <CTable striped>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell></CTableHeaderCell>
                                                <CTableHeaderCell>Tên</CTableHeaderCell>
                                                <CTableHeaderCell></CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {selectedListings.map((listing, index) => (
                                                <CTableRow key={index}>
                                                    <CTableDataCell>
                                                        <CAvatar size="md" src={listing.images[0]} />
                                                    </CTableDataCell>
                                                    <CTableDataCell>{listing.name}</CTableDataCell>
                                                    <CTableDataCell>
                                                        <CRow>
                                                            <CCol>
                                                                <CButton color="warning" onClick={() => addMemberToTeam(listing.id)}>
                                                                    Certificate
                                                                </CButton>
                                                            </CCol>
                                                        </CRow>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                ) : (
                                    <p>Chưa có thành viên</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CModalBody>
            </CModal>
        </div>
    );
};

export default UploadToShop;
