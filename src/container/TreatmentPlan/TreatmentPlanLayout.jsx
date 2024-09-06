import React from 'react';

import Comments from './ChatComponent';
import TreatmentPlanContainer from './TreatmentPlanContainer/TreatmentPlanContainer';

import treatmentplanAndCommentsReducer from '../../store/reducers/treatmentplanAndCommentsReducer/treatmentplanAndCommentsReducer';
import { withReducer } from '../../hoc/withReducer';

const TreatmentPlanLayout = () => {
  return (
    <div>
      <TreatmentPlanContainer />
      <Comments />
    </div>
  );
};

export default withReducer('treatmentplanAndComments',treatmentplanAndCommentsReducer)(TreatmentPlanLayout);
