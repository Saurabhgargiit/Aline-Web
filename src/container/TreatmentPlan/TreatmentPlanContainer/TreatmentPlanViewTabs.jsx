import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import TreatmentPlanView from './TreatmentPlanView';

const TreatmentPlanViewTabs = ({ tabs, approveHandler, reqModFn }) => {
  const [activeKey, setActiveKey] = useState('plan1');
  return (
    <Tabs
      id="justify-tab-example"
      className="patient-details-tabs-container"
      activeKey={activeKey}
      onSelect={key => {
        activeKey === 'plan1' ? setActiveKey('plan2') : setActiveKey('plan1');
      }}
      justify
    >
      <Tab eventKey="plan1" title="Treatment Option-1">
        <TreatmentPlanView
          key={'plan1'}
          approveHandler={approveHandler}
          reqModFn={reqModFn}
        />
      </Tab>
      <Tab eventKey="plan2" title="Treatment Option-2">
        <TreatmentPlanView
          key={'plan2'}
          approveHandler={approveHandler}
          reqModFn={reqModFn}
        />
      </Tab>
    </Tabs>
  );
};

export default TreatmentPlanViewTabs;
