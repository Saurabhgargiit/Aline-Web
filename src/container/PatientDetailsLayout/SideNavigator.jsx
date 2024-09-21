import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import { getCall } from '../../utils/commonfunctions/apicallactions';
import { getPlanDetailsMapping, toggleSideNavigator } from '../../store/actions/sidenNavigatorAction';

import { ReactComponent as UpIcon } from '../../assets/icons/up-icon.svg';
import { ReactComponent as DownIcon } from '../../assets/icons/down.svg';

import './SideNavigator.scss';

const SideNavigator = ({ sideSectionShowHandler }) => {
  const { removeWhitespace } = CommonUtils;

  const { patientID } = useParams();
  
  const dispatch = useDispatch()

  const userRole = useSelector((state)=>state.userInfoReducer?.userInfo?.data?.role);
  const planDetailsMapping = useSelector((state) =>state.sidenNavigatorReducer?.planDetailsMapping);
  const isSideNavigatorVisible = useSelector((state) =>state.sidenNavigatorReducer?.isSideNavigatorVisible);
  const rebootID = useSelector(state => state.rebootReducer.selectedRebootID);
  const pathname = window.location.pathname;
  const pathNamePrefix = '/patientDetails/' + patientID;
  
  const isLaptopScreen = CommonUtils.isLaptopScreen();

  // State to manage the visibility of subplans
  const [isTreatmentPlanExpanded, setTreatmentPlanExpanded] = useState(false);

  // Navigation data structure
  const navItemsInitial = [
    { name: 'Rx Form', path: '/details' },
    { name: 'Photos and Scans', path: '/photosScans' },
    {
      name: 'Treatment Plan',
      path: '/treatmentPlan',
      plans: [],
    },
    { name: 'Treatment Progress Update', path: '/progress' },
    // { name: 'Reboot Requested', path: '/rebootRequested' },
    // { name: 'Reboot Plan Details', path: '/rebootPlan' },
  ];

  const [navItems, setNavItems] = useState(navItemsInitial);

  useEffect(()=>{
    if(!pathname.includes('treatmentPlan')){
      setTreatmentPlanExpanded(false);
    }
  },[pathname])

  //api function for getting the plan Details Mapping
  // const getPlanDetailsMapping = () => {
  //   dispatch(sidenNavigatorAction('GET_TREATMENTPLAN_MAPPING', [patientID, rebootID||0]));
  // };

  useEffect(() => {
    if(rebootID > -1 && patientID){
      getPlanDetailsMapping(dispatch, patientID, rebootID||0);
    }
  }, [patientID, rebootID]);

  useEffect(() => {
    if (
      planDetailsMapping?.result === 'success' &&
      planDetailsMapping?.data !== undefined
    ) {
      const {treatmentPlanDraft, treatmentPlanHistory, treatmentPlanLatest} = planDetailsMapping?.data;

      let childPlans = [];
      if(treatmentPlanLatest && typeof treatmentPlanLatest ==='object' && Object.keys(treatmentPlanLatest).length >0 ){
        const {id,treatmentPlanStatus} = treatmentPlanLatest;
        childPlans[0] = {name: 'Latest Plan', index: id, value: `latest=${id}`};
      }
      if(treatmentPlanHistory && Array.isArray(treatmentPlanHistory) && typeof treatmentPlanHistory ==='object' && treatmentPlanHistory.length >0){
        const temp = [];
        for(let i=0; i< treatmentPlanHistory.length; i++){
          const {id, treatmentPlanStatus} = treatmentPlanHistory[i];
          temp.push({name: 'History rev0'+ (id+1), index: id, value: `history=${id}`});
        }
        temp.sort((a,b) => b.index - a.index);
        childPlans = [...childPlans, ...temp];
      }
      if((CommonUtils.isAdmin(userRole[0]) || CommonUtils.isLab(userRole[0])) && treatmentPlanDraft && typeof treatmentPlanDraft ==='object' && Object.keys(treatmentPlanDraft).length >0){
        const {id, treatmentPlanStatus} = treatmentPlanDraft;
        childPlans.push({name: 'Draft Plans', index: id, value: `draft=${id}`});
      }

      setNavItems((items) => {
        return items.map(item =>{
          if(item.name === 'Treatment Plan'){
            return {...item, plans: childPlans};
          }
          return item;
        })
      })
      // setPhotosScans(convertFormat(fetchedPhotosScans.data, 'patientID') || {});
      // setIsLoading(false);
      // setErrMsg('');
      // }
    } else if (planDetailsMapping?.result === 'error') {
      // setErrMsg(fetchedPhotosScans.data ?? somethingWentWrong);
      // setIsLoading(false);
    }
  }, [planDetailsMapping]);

  return (
    <div className="displayFlex">
      <aside className={`side-navigator-layout ${isSideNavigatorVisible ? 'visible' : ''}`}>
        <div className="side-navigator-container">
          <div className="side-navigator-links">
            <nav>
              <ul>
                {navItems.map((item, index) => {
                  return(<React.Fragment key={index}>
                    <li>
                      <Link
                        to={
                          item.name === 'Treatment Plan'
                            ?  item.plans.length >0 ? `${pathNamePrefix}${item.path}/${removeWhitespace(item.plans[0]?.name)}?${item.plans[0]?.value}`
                            : `${pathNamePrefix}${item.path}/noPlan`
                              : `${pathNamePrefix}${item.path}`
                        }
                        className={
                          'plan-link ' +
                          (pathname.includes(item.path) ? 'active' : '')
                        }
                        onClick={() => {
                          if (item.name === 'Treatment Plan') {
                            setTreatmentPlanExpanded(!isTreatmentPlanExpanded);
                          } else if(!isLaptopScreen)dispatch(toggleSideNavigator());
                        }}
                      >
                        {item.name}{' '}
                        {item.name === 'Treatment Plan' && item.plans.length >0 && (
                          <span>
                            {isTreatmentPlanExpanded ? (
                              <UpIcon />
                            ) : (
                              <DownIcon />
                            )}
                          </span>
                        )}
                      </Link>
                    </li>
                    {item.name === 'Treatment Plan' &&
                      isTreatmentPlanExpanded &&
                      item.plans.map((plan, planIndex) => (
                        <li key={planIndex} className="subplan">
                          <div className="leftBox"></div>
                          <Link
                            to={`${pathNamePrefix}${item.path}/${removeWhitespace(plan.name)}?${plan.value}`}
                            className={
                              'subplan-link ' +
                              (pathname.includes(
                                `${item.path}/${removeWhitespace(plan.name)}`
                              )
                                ? 'active'
                                : '')
                            }
                            onClick={()=>{
                              if(!isLaptopScreen)dispatch(toggleSideNavigator());
                            }}
                          >
                            {plan.name}
                          </Link>
                        </li>
                      ))}
                  </React.Fragment>)

                
              }
                )}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideNavigator;
