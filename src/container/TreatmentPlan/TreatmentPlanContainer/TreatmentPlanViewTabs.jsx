import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import TreatmentPlanView from './TreatmentPlanView';
import Loader from '../../common/Loader/Loader';

const TreatmentPlanViewTabs = ({ approveHandler, reqModFn, tabs, activeKey, setActiveKey, loading, planLoading, planInfo }) => {

  // const [loading, setLoading] = useState(true);
  // const [tabs, setTabs] = useState([]);
  // const [activeKey, setActiveKey] = useState('');

  // const {patientID, rebootID }= useParams();

  // const {pathname, search} = useLocation();

  const planDetailsMapping = useSelector((state) =>state.sidenNavigatorReducer?.planDetailsMapping);

  // useEffect(() => {
  //   if (
  //     planDetailsMapping?.result === 'success' &&
  //     planDetailsMapping.data !== undefined
  //   ) {
  //     const {treatmentPlanDraft, treatmentPlanHistory, treatmentPlanLatest} = planDetailsMapping.data;
  //     const searchParams = new URLSearchParams(search);
  //     switch (true){
  //       case searchParams.has('latest'): {
  //         const {id,treatmentPlanStatus, treatmentPlans} = treatmentPlanLatest;
  //         setTabs(treatmentPlans);
  //         setActiveKey(treatmentPlans[0]?.id);
  //         break;
  //       }
  //       case searchParams.has('history'):{
  //         const paramId = searchParams.get('history')
  //         const treatmentPlans = treatmentPlanHistory?.find(plan => plan.id === +paramId)?.treatmentPlans;
  //         setTabs(() => treatmentPlans);
  //         setActiveKey(treatmentPlans[0]?.id);
  //         break;
  //       }
  //       case searchParams.has('draft'):{
  //         const {id,treatmentPlanStatus, treatmentPlans} = treatmentPlanDraft;
  //         setTabs(treatmentPlans);
  //         setActiveKey(treatmentPlans[0]?.id);
  //         break;
  //       }
  //     }
  //     setLoading(false);
  //   }
  // }, [planDetailsMapping, search]);
  
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
            const {id, status } = tab;
            return <Tab eventKey={id} title={`Treatment Option-${i+1}`} key={'tabs'+id}>
              {planLoading ? 
                <Loader/> 
              :
              <TreatmentPlanView
                key={id}
                status = {status}
                approveHandler={approveHandler}
                reqModFn={reqModFn}
                planInfo = {planInfo}
              />}
            </Tab>
          })
        }
      </Tabs>
  );
};

export default TreatmentPlanViewTabs;
