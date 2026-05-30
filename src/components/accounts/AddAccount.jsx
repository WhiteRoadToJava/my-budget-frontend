import React from 'react'
import { getAccounts } from '../../api/accountService'

const AddAccount = async () => {
  const accounts = await getAccounts()

  // Assuming fetchAccounts is a function that retrieves accounts data
  return (
    <div>
      
    </div>
  )
}

export default AddAccount
