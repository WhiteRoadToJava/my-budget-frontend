import React from 'react'

import { getAllSchedule } from '../../api/scheduleService'
import { useQuery } from '@tanstack/react-query'
import Schedule from '../../components/schedule/Schedule';
import i18n from '../../configuration/i18n';

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
  return <div>{i18n.t("messages.loadingSchedule")}</div>;
}

if (isError) {
  return <div>{i18n.t("messages.errorLoadingSchedule")} {error.message}</div>;
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
