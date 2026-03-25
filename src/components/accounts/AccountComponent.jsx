



const AccountComponent = ({accounts}) => {
  console.log("Accounts in component:", accounts);
  // Assuming fetchAccounts is a function that retrieves accounts data
  return (
    <div>
      <h2>Accounts</h2>
      <ul>
        {accounts.accounts.map(account => (
          <li key={account.id}>{account.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default AccountComponent
