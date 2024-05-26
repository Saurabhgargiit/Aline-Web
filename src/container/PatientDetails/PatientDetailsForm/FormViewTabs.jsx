import react, { useCallback, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SVG from 'react-inlinesvg';
import { toast, Bounce } from 'react-toastify';

import ComplaintNHistoryForm from './ComplaintNHistoryForm';
import TreatmentGoal from './TreatmentGoal';
import Button from '../../../components/Button/Button';
import Loader from '../../common/Loader/Loader';
import { withReducer } from '../../../hoc/withReducer';

import getPatientDetailsReducer from '../../../store/reducers/patientreducer/getPatientDetailsReducer';
import { getPatientDetailsAction } from '../../../store/actions/patientaction/getPatientDetailsAction';
import { somethingWentWrong } from '../../../utils/globalConstants';
import { putCall } from '../../../utils/commonfunctions/apicallactions';

import './FormViewTabs.scss';

function FormViewTabs() {
    const [isEdit, setIsEdit] = useState(false);
    const [tabKey, setTabKey] = useState('home');
    const [isLoading, setisLoading] = useState(true);
    const [cancelFlag, setCancelFlag] = useState(false);
    const [submitFlag, setSubmitFlag] = useState(false);
    const [errMsg, setErrMsg] = useState('');

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

    const convertFormat = (patientTreatmentGoal, fromResp = true) => {
        if (fromResp) {
            const temp = {
                ...patientTreatmentGoal,
                arches: [patientTreatmentGoal?.arches],
                ipr: [patientTreatmentGoal?.ipr],
                attachments: [patientTreatmentGoal?.attachments],
            };
            return temp;
        } else {
            const temp = {
                ...patientTreatmentGoal,
                arches: patientTreatmentGoal?.arches[0],
                ipr: patientTreatmentGoal?.ipr[0],
                attachments: patientTreatmentGoal?.attachments[0],
            };
            return temp;
        }
    };

    const cancelHandler = useCallback(() => {
        setIsEdit(false);
        setDentalHistory(fetchedPatientDetails.data?.patientPreviousDentalHistoryDetails ?? {}); //set to redux state value
        setTreatmentGoalForm(convertFormat(fetchedPatientDetails.data?.patientTreatmentGoal) ?? {}); //set to redux state value
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

    //api function for updating the patient details
    const addPatientDetails = () => {
        debugger;
        const treatmentGoalReqBody = convertFormat(treatmentGoalForm, false);
        let payload = {
            patientPreviousDentalHistoryDetails: { ...dentalHistory, patientID },
            patientTreatmentGoal: { ...treatmentGoalReqBody, patientID },
        };

        let params = {};

        putCall(payload, 'UPDATE_PATIENT_DETAILS', [], params).then((data) => {
            if (data.result === 'success') {
                toast.success(`Patient details modified successully.`, {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 2000,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
                setIsEdit(false);
                setisLoading(true);
                getPatientDetails();
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
            }
            // setLoading(false);
        });
    };

    //@@@@@@@@@@@@@@useEffect@@@@@@@@@@@@@
    useEffect(() => {
        getPatientDetails();
    }, []);

    useEffect(() => {
        console.log(fetchedPatientDetails);
        if (
            fetchedPatientDetails.result === 'success' &&
            fetchedPatientDetails.data !== undefined
        ) {
            // if (String.toString(fetchedPatientDetails.data) !== {}) {
            const { patientPreviousDentalHistoryDetails, patientTreatmentGoal } =
                fetchedPatientDetails.data;

            setDentalHistory(() => patientPreviousDentalHistoryDetails || {});
            setTreatmentGoalForm(patientTreatmentGoal ? convertFormat(patientTreatmentGoal) : {});
            setisLoading(false);
            setErrMsg('');
            // }
        } else if (fetchedPatientDetails.result === 'error') {
            setErrMsg(fetchedPatientDetails?.data ?? somethingWentWrong);
            setisLoading(false);
        }
    }, [fetchedPatientDetails]);

    useEffect(() => {
        if (submitFlag) {
            console.log(dentalHistory, treatmentGoalForm);
            addPatientDetails();
            setSubmitFlag(() => false);
        }
    }, [submitFlag]);

    return !isLoading ? (
        !errMsg ? (
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
                            cancelFlag={cancelFlag}
                            setSubmitFlag={setSubmitFlag}
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
        ) : (
            <div className='positionRelative top56 center-position'>
                <p>{errMsg}</p>
            </div>
        )
    ) : (
        <div className='positionRelative top56 center-position'>
            <Loader />
        </div>
    );
}

export default withReducer('getPatientDetails', getPatientDetailsReducer)(FormViewTabs);
