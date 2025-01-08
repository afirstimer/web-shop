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
    name: 'Products',
    to: '/products',
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Products Listing',
        icon: <CIcon icon={cilGlobeAlt} customClassName="nav-icon" />,
        to: '/listings',
      },
      {
        component: CNavItem,
        name: 'Templates',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        to: '/templates',
      },
      {
        component: CNavItem,
        name: 'Products',
        icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
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
        name: 'Shops',
        icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
        to: '/shops',
      },
      {
        component: CNavItem,
        name: 'Teams',
        icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
        to: '/teams',
      },
      {
        component: CNavItem,
        name: 'Users',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
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
        name: 'Proxy',
        to: '/proxies',
        icon: <CIcon icon={cilDoor} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Token',
        icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
        to: '/tools',
      },
    ]
  }
]

export default _nav
