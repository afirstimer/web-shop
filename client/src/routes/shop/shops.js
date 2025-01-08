import React, { use, useEffect, useState } from 'react'
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
    CLink,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormCheck,
    CInputGroup,
    CFormInput,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CDropdownDivider,
    CFormSelect
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
    cilThumbUp,
    cilThumbDown,
    cibGoogleCloud,
    cilArrowCircleTop,
    cilArrowCircleBottom,
    cilDisabled,
    cilToggleOff,
    cilViewQuilt,
    cilPencil,
    cilMagnifyingGlass,
    cilSync,
    cilBuilding,
    cilCog,

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
import avatarDefault from 'src/assets/images/avatars/default.png'
import MultiSelect from 'multiselect-react-dropdown';
import AddShop from './addShop'
import Toggle from 'react-toggle'
import "react-toggle/style.css";


const Shops = () => {
    const [shops, setShops] = useState([]);
    const [activeShops, setActiveShops] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // authorized shop
    const [visibleAuthShop, setVisibleAuthShop] = useState(false);

    // paging
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');

    // enum
    const StatusEnum = {
        SHOP_STATUS: [
            { id: 'CONNECTED', name: 'CONNECTED' },
            { id: 'DISCONNECTED', name: 'DISCONNECTED' },
            { id: 'ACCOUNT_DEACTIVATED', name: 'ACCOUNT DEACTIVATED' }
        ]
    };

    useEffect(() => {
        const fetchShops = async () => {
            apiRequest('shops')
            .then((res) => {                
                apiRequest('shops/active')
                .then((res2) => {
                    const activeIds = [...res2.data.map(shop => shop.id)]
                    setActiveShops(activeIds);
                    res.data.map(shop => {
                        shop.checked = false;
                        if (activeIds.includes(shop.tiktokShopId)) {
                            shop.checked = true;
                        }
                    });
                    setShops(res.data);
                })
            })
            .catch((err) => {
                console.log(err)
            })
        };

        fetchShops();
    }, []);    

    const handleChangeShopStatus = (shopId, status) => {
        try {
            console.log(shopId, status);
        } catch (error) {
            console.log(error);            
        }
    };

    const handleHeaderCheckboxChange = (e) => {
        e.preventDefault();
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setShops(shops.map(shop => {
            return {
                ...shop,
                checked: newSelectAll
            }
        }))
    }

    const handleProductCheckboxChange = (e, id) => {
        e.preventDefault();
        const checkShops = shops.map(shop => {
            if (shop.id === id) {
                return {
                    ...shop,
                    checked: !shop.checked
                }
            }
            return shop;
        });
        setShops(checkShops);
        setSelectAll(checkShops.every(listing => listing.checked));
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

    return (
        <>
            <AddShop visible={visibleAuthShop} setVisible={setVisibleAuthShop} />
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Danh sách Shop
                        <CButton color="" className="ms-2 mb-2 border-1 border-dark">
                            <CIcon icon={cilSync} className="me-1" />
                        </CButton>
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                    <CButton color="warning" className="float-end" onClick={() => setVisibleAuthShop(true)}>
                        <CIcon icon={cilPlus} /> Liên kết shop
                    </CButton>
                </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <CFormSelect>
                        <option value="1">--All--</option>
                        <option value="2">Kích hoạt</option>
                        <option value="3">Tắt shop</option>
                        <option value="4">Assign to</option>
                        <option value="5">Sync đơn hàng</option>
                        <option value="6">Sync sản  phẩm</option>
                        <option value="5">Thêm cửa hàng vào nhóm</option>
                    </CFormSelect>
                </CCol>
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
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder="Manager"
                            aria-label="Manager"
                            aria-describedby="basic-addon2"
                            onChange={handleSearchChange}
                        />
                    </CInputGroup>
                </CCol>
                <CCol>
                    <MultiSelect
                        displayValue='name'
                        options={StatusEnum.SHOP_STATUS}
                        onSelect={searchBy}
                        placeholder='Trạng thái shop'
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
                                            <CIcon icon={cilBuilding} /> Shop
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Profile
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Code
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Người tạo
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Trạng thái
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Chức năng</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {shops.map((item, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                <CFormCheck
                                                    className="form-check-input"
                                                    checked={item.checked}
                                                    onChange={(e) => handleProductCheckboxChange(e, item.id)}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div>{item.name}</div>
                                                <div>{item.defaultShop ? (
                                                    <div className='text-danger small'>
                                                        (Shop mặc định)
                                                    </div>
                                                ) : (
                                                    <div className='text-danger'>
                                                        <CIcon icon={cilArrowCircleBottom} className="text-danger" />
                                                    </div>
                                                )}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.profile}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <code>{item.code}</code>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButton size="sm">
                                                    <CAvatar size="md" src={item.User.avatar || avatarDefault} />
                                                    &nbsp;{item.User.username}
                                                </CButton>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div className='text-success'>
                                                    <Toggle
                                                        className='mt-2 me-2'
                                                        defaultChecked={item.checked}
                                                        id="isActive"
                                                        name='isActive'
                                                        value={item.checked ? "yes" : "no"} 
                                                        onChange={() => handleChangeShopStatus(item.id, item.checked ? "no" : "yes")}                                                       
                                                    />                                                    
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center d-none d-md-table-cell">
                                                <CButton color='warning' size="sm" className='me-2 mb-2'>
                                                    <CIcon icon={cilPencil} className='me-2' />
                                                    Sửa
                                                </CButton>
                                                <CButton color="info" size="sm" className='me-2 mb-2'>
                                                    <CIcon icon={cilViewQuilt} className="me-2 text-white" />
                                                    Xem
                                                </CButton>
                                                <CButton color="primary" size="sm" className='me-2 mb-2'>
                                                    <CIcon icon={cilSync} className='me-2' />
                                                    Sync
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

export default Shops
