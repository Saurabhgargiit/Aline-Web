import React, { useState, useEffect } from 'react';
import SVG from 'react-inlinesvg';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import Button from '../../../components/Button/Button';
import TreatmentPlanForm from './TreatmentPlanForm';
import TreatmentPlanViewTabs from './TreatmentPlanViewTabs';
import TreatmentPlanModal from './TreatmentPlanModal';
import { getPlanDetailsMapping } from '../../../store/actions/sidenNavigatorAction';

import { CommonUtils } from '../../../utils/commonfunctions/commonfunctions';
import { CommonConstants } from '../../../utils/globalConstants';
import { getPlanDetailsAndCommentsAction } from '../../../store/actions/treatementPlan/treatmentplanAndCommentsAction';
import * as actionTypes from '../../../store/actionTypes';
import FillerPage from '../../FillerPages/FillerPage';

const modalInitialState = {
  isOpen: false,
  title: '',
};

const TreatmentPlanContainer = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [redirectionInfo, setRedirectionInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState([]);
  const [activeKey, setActiveKey] = useState('');

  const [planLoading, setPlanLoading] = useState(true);
  const [planInfo, setPlanInfo] = useState({});

  const [modalDetails, setModalDetails] = useState(modalInitialState);
  
  const { patientID, rebootID, planType } = useParams();
  const {pathname, search} = useLocation();

  const {isLab, isAdmin, checkSanityFailed} =CommonUtils;
  
  const userRole = localStorage.getItem(CommonConstants.USER_ROLE);
  const dispatch = useDispatch();
  const planDetailsMapping = useSelector((state) =>state.sidenNavigatorReducer?.planDetailsMapping);
  const planDetails = useSelector((state) =>state.treatmentplanAndComments?.planDetails);


  useEffect(() => {
    if (
      planDetailsMapping?.result === 'success' &&
      planDetailsMapping.data !== undefined
    ) {
      const {treatmentPlanDraft, treatmentPlanHistory, treatmentPlanLatest} = planDetailsMapping.data;
      const searchParams = new URLSearchParams(search);
      switch (true){
        case searchParams.has('latest'): {
          if(checkSanityFailed(treatmentPlanLatest)) break;
          const {id,treatmentPlanStatus, treatmentPlans} = treatmentPlanLatest;
          setTabs(treatmentPlans);
          setActiveKey(treatmentPlans[0]?.id);
          break;
        }
        case searchParams.has('history'):{
          if(checkSanityFailed(treatmentPlanHistory)) break;
          const paramId = searchParams.get('history')
          const treatmentPlans = treatmentPlanHistory?.find(plan => plan.id === +paramId)?.treatmentPlans;
          setTabs(() => treatmentPlans);
          setActiveKey(treatmentPlans[0]?.id);
          break;
        }
        case searchParams.has('draft'):{
          if(checkSanityFailed(treatmentPlanDraft)) break;
          const {id,treatmentPlanStatus, treatmentPlans} = treatmentPlanDraft;
          setTabs(treatmentPlans);
          let tabActiveKey= treatmentPlans[0]?.id
          if(JSON.stringify(redirectionInfo) !== '{}' && redirectionInfo['draft'] !== undefined){
            tabActiveKey = redirectionInfo['draft'] === 'latest' ? treatmentPlans[treatmentPlans?.length-1]?.id : redirectionInfo['draft'];
          }
          setRedirectionInfo({});
          setActiveKey(tabActiveKey);
          break;
        }
        default:
          break;        
      }
      setLoading(false);
    }
  }, [planDetailsMapping, search]);

  useEffect(()=>{
    setPlanLoading(true);
    getPlanDetails();
  },[activeKey])

  useEffect(()=>{
    if (
      planDetails?.result === 'success' &&
      planDetails.data !== undefined
    ) {
      setPlanLoading(false);
      setPlanInfo(planDetails.data);
    }
  },[planDetails])

  const getPlanDetails =() =>{
    const queryParams ={};
    const searchParams = new URLSearchParams(search);
    
    switch (true){
      case searchParams.has('latest'): {
        queryParams['planType']= 'LATEST';
        break;
      }
      case searchParams.has('history'):{
        queryParams['planType'] = 'HISTORY';
        break;
      }
      case searchParams.has('draft'):{
        queryParams['planType'] = 'DRAFT';
        break;
      }
      default:
        break;
    }
    dispatch(getPlanDetailsAndCommentsAction(actionTypes.SET_PLAN_DETAILS, 'GET_TREATMENT_PLAN_DETAILS', [patientID, activeKey, rebootID],queryParams))
  }

 
  

  const reqModFn = () => {
    setModalDetails(prev => ({
      ...prev,
      isOpen: true,
      title: 'Request for Modification',
    }));
  };

  const approveHandler = () => {
    setModalDetails(prev => ({
      ...prev,
      isOpen: true,
      title: 'Approve Plan',
    }));
  };

  const closeHanlder = () => {
    setModalDetails(prev => modalInitialState);
  };

  const addOptionHandler = () => {
    setIsEdit(true);
  };

  const cancelHandler = () => {
    setIsEdit(false);
  };

  const redirectToCurrentDraft =(planId) =>{
    setRedirectionInfo({draft: planId});
  }
  
  const redirectToLatestDraft =() =>{
    setRedirectionInfo({draft: 'latest'});
  }
  
  useEffect(()=>{
    if(JSON.stringify(redirectionInfo) !== '{}'){
      getPlanDetailsMapping(dispatch, patientID, rebootID||0);
    }
  },[redirectionInfo])

  if(planType === 'noPlan')return <FillerPage message={'No plan shared yet.'}/>

  return (
    <div className="PatientDetailsContainer">
      <div className="patient-details-tabs-container">
        {isEdit ? (
          <TreatmentPlanForm 
            cancelHandler={cancelHandler} 
            dispatch={dispatch} 
            redirectToCurrentDraft ={redirectToCurrentDraft} 
            redirectToLatestDraft ={redirectToLatestDraft}
          />
        ) : (
          <TreatmentPlanViewTabs
            approveHandler={approveHandler}
            reqModFn={reqModFn}
            tabs={tabs}
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            loading={loading}
            planLoading={planLoading}
            planInfo ={planInfo}
          />
        )}
      </div>
      {!isEdit &&
        (isAdmin(userRole) || isLab(userRole)) && (
          <Button
            postionClass={'home-page-button-pos rightPosEdit'}
            className={'home-page-add-button'}
            svg={
              <SVG src={require(`../../../assets/icons/plus.svg`).default} />
            }
            onClickCallBk={addOptionHandler}
            tooltip={'Add Treatment Option'}
          />
        )}
      <TreatmentPlanModal {...modalDetails} closeHanlder={closeHanlder} />
    </div>
  );
};

export default TreatmentPlanContainer;
