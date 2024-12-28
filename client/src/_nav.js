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
  cibGlassdoor
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
    icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Products Listing'}
            <CIcon icon={cilCart} size="sm" className="ms-2" />
          </React.Fragment>
        ),        
        to: '/listings',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Templates'}
            <CIcon icon={cilCloud} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        to: '/templates',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Products'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
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
    icon: <CIcon icon={cilLink} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Shops'}
            <CIcon icon={cilHouse} size="sm" className="ms-2" />
          </React.Fragment>
        ),        
        to: '/shops',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Users'}
            <CIcon icon={cilGroup} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        to: '/users',
      },      
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Token'}
            <CIcon icon={cilLockLocked} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        to: '/tools',
      },
    ],
  }, 
  {
    component: CNavItem,
    name: 'Proxy',
    to: '/settings',
    icon: <CIcon icon={cilDoor} customClassName="nav-icon" />    
  }
]

export default _nav
