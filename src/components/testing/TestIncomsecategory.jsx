import React, { useState }from 'react'
import IncomseCategoryList from '../categories/IncomseCategoryList.jsx'


const TestIncomsecategory = () => {
  const [category, setCategory] = useState(null);

  const handleChooseCategory = (id) => {
    setCategory(id);
  };

  return (
    <div>
        <IncomseCategoryList incomseItem={handleChooseCategory} />
    </div>
  )
}

export default TestIncomsecategory