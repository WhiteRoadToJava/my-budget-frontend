import React from 'react'
import styles from '../../styles/dashboard/dashboard.module.scss'
import ViewAccounts from '../../components/Dashboard/ViewAccounts'
import ViewTransations from '../../components/Dashboard/ViewTransations'
import Charts from '../../components/Dashboard/Charts'

const UserDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftSide}>
      <ViewAccounts />
      <ViewTransations />
      </div>
      <div className={styles.rightSide}>
        <Charts />
      </div>
    </div>
  )
}

export default UserDashboard
