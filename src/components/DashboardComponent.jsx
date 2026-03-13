import React from 'react'
import Sidebar from './sidebar/Sidebar'
import { getAdminMenuItems } from '../utils/admin/getAdminMenuItems'

const DashboardComponent = () => {
  return (
    <div>
        <Sidebar menuItems={getAdminMenuItems} />
    </div>
  )
}

export default DashboardComponent
