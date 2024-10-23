import React, { memo } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { planStatus } from '../treatmentPlanConstants';

import TreatmentPlanView from './TreatmentPlanView';
import Loader from '../../common/Loader/Loader';

const TreatmentPlanViewTabs = ({ 
    actionHandler,
    tabs, 
    activeKey, 
    setActiveKey, 
    loading, 
    planLoading, 
    planInfo, 
    isLabSideUser, 
    editOptionHandler,
   }) => {

  
  return (
    loading ? 
      <Loader/> :
      <Tabs
        id="justify-tab-example"
        className="patient-details-tabs-container"
        activeKey={activeKey}
        onSelect={key => {setActiveKey(key)}}
        justify
      >
        {
          tabs.length > 0 && tabs.map((tab, i)=>{
            const {id, status, label } = tab;
            let statusLabel;
            if(status){
               statusLabel = planStatus.find(el => el.value === status)?.label;
            }
            return (
            <Tab 
              eventKey={id} 
              title={`${label || 'Option-'+(i+1)} (${statusLabel || ''})`} 
              key={'tabs'+id} 
              tabClassName={activeKey ==id ? 'tab-active' : 'tab-inactive'}
            >
              {planLoading ? 
                <Loader/> 
              :
              <TreatmentPlanView
                key={id}
                status = {status}
                actionHandler={actionHandler}
                planInfo = {planInfo}
                isLabSideUser={isLabSideUser}
                editOptionHandler={editOptionHandler}
              />}
            </Tab>)
          })
        }
      </Tabs>
  );
};

export default memo(TreatmentPlanViewTabs);
