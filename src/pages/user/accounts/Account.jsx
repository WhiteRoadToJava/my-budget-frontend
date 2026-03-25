import React, { useEffect, useState } from 'react';
import { getAccounts } from '../../../api/accountService';
import AccountComponent from '../../../components/accounts/AccountComponent';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data);
      } catch (error) {
        console.error("Failed to load accounts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <AccountComponent accounts={accounts}/>
    </div>
  );
};

export default Account;