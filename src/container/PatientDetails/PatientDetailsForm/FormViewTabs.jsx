import react, { useCallback, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SVG from 'react-inlinesvg';

import ComplaintNHistoryForm from './ComplaintNHistoryForm';
import TreatmentGoal from './TreatmentGoal';
import Button from '../../../components/Button/Button';

import { withReducer } from '../../../hoc/withReducer';
import getPatientDetailsReducer from '../../../store/reducers/patientreducer/getPatientDetailsReducer';
import { getPatientDetailsAction } from '../../../store/actions/patientaction/getPatientDetailsAction';

import './FormViewTabs.scss';

function FormViewTabs() {
    const [isEdit, setIsEdit] = useState(false);
    const [tabKey, setTabKey] = useState('home');
    const [isLoading, setisLoading] = useState(true);
    const [cancelFlag, setCancelFlag] = useState(false);

    const [dentalHistory, setDentalHistory] = useState({});
    const [treatmentGoalForm, setTreatmentGoalForm] = useState({});

    const { patientID } = useParams();

    const fetchedPatientDetails = useSelector((state) => state.getPatientDetails.patientDetails);
    const dispatch = useDispatch();

    const firstLoad = useRef(false);
    firstLoad.current = true;

    const editHandler = () => {
        if (!isEdit) {
            setIsEdit(true);
        }
    };

    const cancelHandler = useCallback(() => {
        setIsEdit(false);
        setDentalHistory(fetchedPatientDetails.data?.patientPreviousDentalHistoryDetails ?? {}); //set to redux state value
        setTreatmentGoalForm(fetchedPatientDetails.data?.patientTreatmentGoal ?? {}); //set to redux state value
        setCancelFlag((state) => !state);
    }, [fetchedPatientDetails]);

    const clickHandler = useCallback((key) => {
        setTabKey(key);
    }, []);

    const tabClickHandler = (key) => {
        if (key === tabKey) return;
        clickHandler(key);
    };

    //api function for getting the patient Details
    const getPatientDetails = () => {
        dispatch(getPatientDetailsAction('GET_PATIENT_DETAILS', [patientID]));
    };

    //@@@@@@@@@@@@@@useEffect@@@@@@@@@@@@@
    useEffect(() => {
        getPatientDetails();
    }, []);

    useEffect(() => {
        if (
            fetchedPatientDetails.result === 'success' &&
            fetchedPatientDetails.data !== undefined
        ) {
            const { patientPreviousDentalHistoryDetails, patientTreatmentGoal } =
                fetchedPatientDetails.data;
            // const { patientBasicInfoFromResponse, patientDetailInfoFromResponse } =
            //     separateDetails(userList);
            setDentalHistory(() => patientPreviousDentalHistoryDetails || {});
            setTreatmentGoalForm(patientTreatmentGoal || {});
            // setUserDetailInfo(() => userDetailInfoFromResponse);
            setisLoading(false);
        } else if (fetchedPatientDetails.result === 'error') {
            // setErrMsg(somethingWentWrong);
            setisLoading(false);
            // setIsError(true);
        }
    }, [fetchedPatientDetails]);

    return (
        <>
            <Tabs
                id='justify-tab-example'
                className='patient-details-tabs-container'
                activeKey={tabKey}
                onSelect={(key) => tabClickHandler(key)}
                justify
            >
                <Tab eventKey='home' title='Complaint & History' disabled={isEdit}>
                    <ComplaintNHistoryForm
                        isEdit={isEdit}
                        clickHandler={clickHandler}
                        cancelHandler={cancelHandler}
                        formData={dentalHistory}
                        setFormData={setDentalHistory}
                        cancelFlag={cancelFlag}
                    />
                </Tab>
                <Tab eventKey='profile' title='Treatment Goal' disabled={isEdit}>
                    <TreatmentGoal
                        isEdit={isEdit}
                        clickHandler={clickHandler}
                        formData={treatmentGoalForm}
                        setFormData={setTreatmentGoalForm}
                    />
                </Tab>
            </Tabs>
            <Button
                postionClass={'home-page-button-pos rightPosEdit'}
                className={'home-page-add-button'}
                svg={
                    !isEdit ? (
                        <SVG src={require(`../../../assets/icons/edit-2.svg`).default} />
                    ) : (
                        <SVG src={require(`../../../assets/icons/close.svg`).default} />
                    )
                }
                onClickCallBk={!isEdit ? editHandler : cancelHandler}
                tooltip={!isEdit ? 'Edit' : 'Cancel'}
            />
        </>
    );
}

export default withReducer('getPatientDetails', getPatientDetailsReducer)(FormViewTabs);
