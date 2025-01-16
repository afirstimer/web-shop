import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilExternalLink,
  cilPuzzle,
  cilSpeedometer,
  cilLineWeight,
  cilCart,
  cilCloud,
  cilBook,
  cilGroup,
  cilHouse,
  cilLink,
  cilInbox,
  cilSettings,
  cilKeyboard,
  cilLockLocked,
  cilDoor,
  cibGlassdoor,
  cilFactory,
  cilLibraryBuilding,
  cilMediaRecord,
  cilColumns,
  cilSitemap,
  cilGlobeAlt,
  cilUser
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Shop',
  },
  {
    component: CNavGroup,
    name: 'Sản phẩm',
    to: '/products',
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Listing'}
            <CIcon icon={cilCart} size="sm" className="ms-2" />
          </React.Fragment>
        ),        
        to: '/listings',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Template'}
            <CIcon icon={cilPuzzle} size="sm" className="ms-2" />
          </React.Fragment>
        ),        
        to: '/templates',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Sản phẩm'}
            <CIcon icon={cilCart} size="sm" className="ms-2" />
          </React.Fragment>
        ),        
        to: '/products',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Systems',
    to: '/systems',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Cửa hàng'}
            <CIcon icon={cilLibraryBuilding} size="sm" className="ms-2" />
          </React.Fragment>
        ),        
        to: '/shops',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Nhóm'}
            <CIcon icon={cilGroup} size="sm" className="ms-2" />
          </React.Fragment>
        ),        
        to: '/teams',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'User'}
            <CIcon icon={cilUser} size="sm" className="ms-2" />
          </React.Fragment>
        ),        
        to: '/users',
      },     
    ],
  },
  {
    component: CNavGroup,
    name: 'Tools',    
    icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Proxy'}
            <CIcon icon={cilDoor} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        to: '/proxies'        
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Token'}
            <CIcon icon={cilLockLocked} size="sm" className="ms-2" />
          </React.Fragment>
        ),        
        to: '/tools'
      },
    ]
  }
]

export default _nav
