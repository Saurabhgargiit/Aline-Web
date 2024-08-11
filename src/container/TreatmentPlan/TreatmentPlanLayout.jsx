import React from 'react';

import Comments from './ChatComponent';
import TreatmentPlanContainer from './TreatmentPlanContainer/TreatmentPlanContainer';

const TreatmentPlanLayout = () => {
  return (
    <div>
      <TreatmentPlanContainer />
      <Comments />
    </div>
  );
};

export default TreatmentPlanLayout;
