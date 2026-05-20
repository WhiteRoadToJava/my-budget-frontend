import React from 'react'

import { getAllSchedule } from '../../api/scheduleService'
import { useQuery } from '@tanstack/react-query'
import Schedule from '../../components/schedule/Schedule';

function SchedulePage() {
const {
  data: schedules = [],
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["schedules"],
  queryFn: getAllSchedule,
});

if (isLoading) {
  return <div>Loading schedules...</div>;
}

if (isError) {
  return <div>Error loading schedules: {error.message}</div>;
}


  return (
    <div>
      <Schedule schedules={schedules} />
      <div>
        
      </div>
      
    </div>
  )
}

export default SchedulePage
