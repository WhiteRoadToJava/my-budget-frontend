import React from 'react'
import styles from '../../styles/dashboard/dashboard.module.scss'
import ViewAccounts from '../../components/Dashboard/ViewAccounts'
import ViewTransations from '../../components/Dashboard/ViewTransations'

const UserDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <ViewAccounts />
      <ViewTransations />
    </div>
  )
}

export default UserDashboard
