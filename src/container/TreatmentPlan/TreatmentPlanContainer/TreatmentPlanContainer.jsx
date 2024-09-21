import React, { useState, useEffect, useCallback } from 'react';
import SVG from 'react-inlinesvg';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';

import Button from '../../../components/Button/Button';
import TreatmentPlanForm from './TreatmentPlanForm';
import TreatmentPlanViewTabs from './TreatmentPlanViewTabs';
import TreatmentPlanModal from './TreatmentPlanModal';
import { getPlanDetailsMapping } from '../../../store/actions/sidenNavigatorAction';

import { CommonUtils } from '../../../utils/commonfunctions/commonfunctions';
import { CommonConstants } from '../../../utils/globalConstants';
import { getPlanDetailsAndCommentsAction } from '../../../store/actions/treatementPlan/treatmentplanAndCommentsAction';
import { putCall } from '../../../utils/commonfunctions/apicallactions';
import * as actionTypes from '../../../store/actionTypes';
import FillerPage from '../../FillerPages/FillerPage';
import Loader from '../../common/Loader/Loader';

const modalInitialState = {
  isOpen: false,
  title: '',
};

const TreatmentPlanContainer = () => {
  const [isEdit, setIsEdit] = useState(false);      //When add plan is clicked to 
  const [redirectionInfo, setRedirectionInfo] = useState({}); //when edit/add plans are done
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState([]);
  const [activeKey, setActiveKey] = useState(''); 
  
  const [planLoading, setPlanLoading] = useState(true);
  const [planInfo, setPlanInfo] = useState({});
  const [planEdit, setPlanEdit] = useState(false);  //when edit plan button is clicked, it is flag to decide for put/post call in form

  const [modalDetails, setModalDetails] = useState(modalInitialState);
  
  const { patientID, planType } = useParams();
  const {pathname, search} = useLocation();
  const navigate = useNavigate();

  const {isLab, isAdmin, checkSanityFailed} =CommonUtils;
  const userRole = localStorage.getItem(CommonConstants.USER_ROLE);
  const showAddEditPlanButton = isLab(userRole) || isAdmin(userRole);

  const dispatch = useDispatch();
  const planDetailsMapping = useSelector((state) =>state.sidenNavigatorReducer?.planDetailsMapping);
  const planDetails = useSelector((state) =>state.treatmentplanAndComments?.planDetails); //source of truth for loaded plan
  const rebootID = useSelector(state => state.rebootReducer.selectedRebootID);

  //api Handler
  const saveHandler = useCallback((key) => {
    closeModalHandler();
    settoLoading();
    let successMsg, url;
    let callFn = putCall;
    switch (key) {
      case 'sharePlan' : {
        successMsg = 'Treatment Plan Shared.'
        url = 'SHARE_PLAN_WITH_DOCTOR';
        break;
      }
      case 'reqMod' : {
        successMsg = 'Modification requested successfully.'
        url = 'REQUEST_FOR_MODIFICATION';
        break;
      }
      case 'approve' : {
        successMsg = 'Treatment Plan Appoved successfully.'
        url = 'APPROVE_PLAN';
        break;
      }
      default:
        break;
    }
    const payload ={};
    callFn(payload, url, [patientID, rebootID, activeKey]).then((data) => {
        if (data.result === 'success') {
            toast.success(successMsg, {
                position: 'top-right',
                hideProgressBar: false,
                autoClose: 2000,
                closeOnClick: true,
                // pauseOnHover: true,
                theme: 'light',
                transition: Bounce,
            });
            // isEdit? redirectToCurrentDraft(planId) : redirectToLatestDraft()
            redirectToLatest(activeKey);

        } else if (data.result === 'error') {
            toast.error(data.error ?? 'data.error', {
                position: 'top-right',
                hideProgressBar: false,
                autoClose: 2000,
                closeOnClick: true,
                // pauseOnHover: true,
                theme: 'light',
                transition: Bounce,
            });
            setLoading(false);
        }
        // setLoading(false);
    });
  },[activeKey])

  //Modal Handlers
  const openModal = useCallback((title, msg, type) =>{
    setModalDetails(prev => ({
      ...prev,
      isOpen: true,
      title: title,
      msg: msg,
      type: type,
      saveHandler: saveHandler,
    }));
  },[saveHandler])

  const closeModalHandler = () => {
    setModalDetails(prev => modalInitialState);
  };

  //Action Handlers
  const actionHandler = useCallback((type) =>{
    let title, msg;
    switch(type){
      case 'sharePlan' : {
        title = 'Share Plan with Clinic';
        msg = 'Do you want to share the plan with clinic?';
        break;
      }
      case 'reqMod' : {
        title = 'Request for Modification';
        msg = 'Are you sure that modification in plan is required?';
        break;
      }
      case 'approve' : {
        title = 'Approve Plan';
        msg = 'Do you want to approve the plan?';
        break;
      }
      default:
        break;  
    }
    openModal(title,msg,type);
  },[activeKey]);

  //Add edit handler
  const addOptionHandler = () => {
    setIsEdit(true);
  };

  const editOptionHandler = () => {
    setIsEdit(true);
    setPlanEdit(true);
  };

  const cancelHandler = useCallback(() => {
    setIsEdit(false);
    setPlanEdit(false);
  },[]);

  const settoLoading = useCallback(() =>{
    setIsEdit(false);
    setPlanEdit(false);
    setLoading(true);
  },[]);

  // Redirection Hanlders
  const redirectToCurrentDraft =useCallback((planId) =>{
    settoLoading();
    setRedirectionInfo({draft: planId});
  },[])
  
  const redirectToLatestDraft = useCallback(() => {
    settoLoading();
    setRedirectionInfo({draft: 'latest'});
  },[])

  const redirectToLatest = useCallback((planId) =>{
    setRedirectionInfo({latest: planId});
  },[])

  console.log(activeKey);




  const getPlanDetails =(activeKeyId) =>{
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
    dispatch(getPlanDetailsAndCommentsAction(actionTypes.SET_PLAN_DETAILS, 'GET_TREATMENT_PLAN_DETAILS', [patientID, activeKeyId, rebootID],queryParams))
  }
  
  // useEffects
  useEffect(()=>{
    if(JSON.stringify(redirectionInfo) !== '{}'){
      getPlanDetailsMapping(dispatch, patientID, rebootID||0);
    }
  },[redirectionInfo])

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
          if(JSON.stringify(redirectionInfo) !== '{}' && redirectionInfo['latest'] !== undefined){
            const tabActiveKey = redirectionInfo['latest'];
            getPlanDetails(tabActiveKey);
            setActiveKey(tabActiveKey);
            setRedirectionInfo({});
            break;
          }
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
          if(JSON.stringify(redirectionInfo) !== '{}' && redirectionInfo['latest'] !== undefined){
            navigate(`/patientDetails/${patientID}/${rebootID}/treatmentPlan/LatestPlan?latest=0`);
          }
          if(checkSanityFailed(treatmentPlanDraft)) break;
          const {id,treatmentPlanStatus, treatmentPlans} = treatmentPlanDraft;
          setTabs(treatmentPlans);
          let tabActiveKey= treatmentPlans[0]?.id;
          if(JSON.stringify(redirectionInfo) !== '{}' && redirectionInfo['draft'] !== undefined){
            tabActiveKey = redirectionInfo['draft'] === 'latest' ? treatmentPlans[treatmentPlans?.length-1]?.id : redirectionInfo['draft'];
            if(redirectionInfo['draft'] !== 'latest') getPlanDetails(tabActiveKey);
          }
          setRedirectionInfo({});
          setActiveKey(tabActiveKey);
          break;
        }
        case (pathname.includes('noPlan') && JSON.stringify(redirectionInfo) !== '{}' && redirectionInfo['draft'] !== undefined):{
          navigate(`/patientDetails/${patientID}/${rebootID}/treatmentPlan/DraftPlans?draft=0`);
          break;
        } 
        default:
          break;        
      }
      setLoading(false);
    }
  }, [planDetailsMapping.data, search]);

  useEffect(()=>{
    setPlanLoading(true);
    if(activeKey){
      getPlanDetails(activeKey);
    }
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

  if(planType === 'noPlan' && !isEdit){
    let btnDetails = {};
    if(showAddEditPlanButton){
      btnDetails ={
        title : "Add Plan",
        onClickCallBk : addOptionHandler,
        type: 'primary',
      }
    }
    return <FillerPage message={'No plan shared yet.'} btnDetails={btnDetails}/>
  }

  return (
    <div className="PatientDetailsContainer">
      <div className="patient-details-tabs-container">
        {
        loading ? 
          <Loader/> 
          :
          isEdit ?  <TreatmentPlanForm 
                      cancelHandler={cancelHandler} 
                      dispatch={dispatch} 
                      redirectToCurrentDraft ={redirectToCurrentDraft} 
                      redirectToLatestDraft ={redirectToLatestDraft}
                      existingData={planEdit ? planDetails?.data :{} }
                      isEdit={planEdit}
                      planId={activeKey}
                      patientID = {patientID}
                      rebootID ={rebootID}
                    />
                  : <TreatmentPlanViewTabs
                      actionHandler={actionHandler}
                      tabs={tabs}
                      activeKey={activeKey}
                      setActiveKey={setActiveKey}
                      loading={loading}
                      planLoading={planLoading}
                      planInfo ={planInfo}
                      isLabSideUser = {showAddEditPlanButton}
                      editOptionHandler={editOptionHandler}
                    />
        } 
      </div>
      {!isEdit &&
        showAddEditPlanButton && (
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
        {/* {!isEdit &&
        showAddEditPlanButton && (
          <Button
            postionClass={'home-page-button-pos rightPosEdit marginBottom56'}
            className={'home-page-add-button'}
            svg={
              <SVG src={require(`../../../assets/icons/edit.svg`).default} />
            }
            onClickCallBk={editOptionHandler}
            tooltip={'Edit Treatment Plan'}
          />
        )} */}
      <TreatmentPlanModal {...modalDetails} closeHanlder={closeModalHandler}/>
    </div>
  );
};

export default TreatmentPlanContainer;
