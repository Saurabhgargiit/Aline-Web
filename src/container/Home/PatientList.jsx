import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '../../hoc/withRouter';
import { withReducer } from '../../hoc/withReducer';

import SVG from 'react-inlinesvg';
import { toast, Bounce } from 'react-toastify';
import Button from '../../components/Button/Button';
import { InformativeErrorModal } from '../../components/Modal/Modal';
import Loader from '../common/Loader/Loader';
import DeleteConfirmationModal from '../../components/Modal/DeleteConfirmationModal';

import {
    MAXIMUM_RESULTS_ON_ONE_PAGE_ON_HOME_PAGE,
    somethingWentWrong,
} from '../../utils/globalConstants';
import Status from './Status/Status';
import getAllPatientReducer from '../../store/reducers/patientreducer/getAllPatientReducer';
import { getAllPatientsAction } from '../../store/actions/patientaction/getAllPatientAction';
import { putCall, deleteCall } from '../../utils/commonfunctions/apicallactions';

import './PatientList.scss';

const PatientList = ({ editPatientHandler, userAdded, setUserAdded }) => {
    const [loading, setLoading] = useState(true);
    const [patientBasicInfo, setPatientBasicInfo] = useState({});
    const [isError, setIsError] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteUserData, setDeleteUserData] = useState({});

    const fetchedAllPatients = useSelector((state) => state.getAllPatients.allPatients);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //api function for getting the patients
    const getAllPatients = () => {
        // const role = CommonUtils.getPayloadRole();
        const query = {
            // role: role,
            pageNumber: 0,
            pageSize: MAXIMUM_RESULTS_ON_ONE_PAGE_ON_HOME_PAGE,
            sortBy: 'id',
            sortDir: 'des',
        };
        dispatch(getAllPatientsAction('GET_ALL_PATIENTS', [], query));
    };

    //api function for changing the status
    const changeStatus = (patientID, status) => {
        const payload = { patientID, status };

        putCall(payload, 'UPDATE_STATUS', [], {}).then((data) => {
            if (data.result === 'success') {
                toast.success(`Patient modified successully`, {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 2000,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
                setLoading(true);
                getAllPatients();
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
        });
    };

    //api function for deleting the patient
    const deletePatient = (basicInfo) => {
        deleteCall('DELETE_PATIENT', [basicInfo.id], {}).then((data) => {
            if (data.result === 'success') {
                toast.success(`Patient deleted successully`, {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 2000,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
                setLoading(true);
                getAllPatients();
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
        });
    };

    const deleteHandler = (e, basicInfo) => {
        e.stopPropagation();
        setDeleteModalOpen(() => true);
        setDeleteUserData(basicInfo);
    };

    const navgationHandler = (patientInfo) => {
        !!patientInfo.id && navigate('/patientDetails/' + patientInfo.id + '/details');
    };

    //@@@@@@@@@@@@@@@ useEffect @@@@@@@@@@@@@@@@@@@@
    //First time call
    useEffect(() => {
        getAllPatients();
    }, []);

    useEffect(() => {
        if (fetchedAllPatients.result === 'success' && fetchedAllPatients.data !== undefined) {
            const patientList = fetchedAllPatients.data;
            // const { patientBasicInfoFromResponse, patientDetailInfoFromResponse } =
            //     separateDetails(userList);
            setPatientBasicInfo(() => patientList || {});
            // setUserDetailInfo(() => userDetailInfoFromResponse);
            setLoading(false);
        } else if (fetchedAllPatients.result === 'error') {
            setErrMsg(somethingWentWrong);
            setLoading(false);
            setIsError(true);
        }
    }, [fetchedAllPatients]);

    //force relaod after adding/editing patient
    useEffect(() => {
        console.log(userAdded);
        if (userAdded) {
            getAllPatients();
            setUserAdded(() => false);
        }
    }, [userAdded]);

    const patientList = () =>
        Object.values(patientBasicInfo).map((el, i) => (
            <div
                className='displayFlex home-row-container row-border pointer'
                key={'patient-container' + i}
                onClick={(e) => navgationHandler(el)}
            >
                <div className='img-container'>
                    <img
                        src={
                            el.img ||
                            'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
                        }
                        alt={el.name + 'Patient'}
                    ></img>
                </div>
                <div className='home-page-name-date mt-2'>
                    <div className='home-page-name font700'>{el.name}</div>
                    <div className='home-page-date font14'>
                        {new Date(el.dateOfScan).toLocaleDateString()}
                    </div>
                </div>
                <Status
                    patientID={el.id}
                    status={el.status ?? 'scanned'}
                    changeStatus={changeStatus}
                />
                <div className='mt-2 icon-container'>
                    <div className='home-page-icons'>
                        <Button
                            onClickCallBk={(e) => {
                                editPatientHandler(e, el);
                            }}
                            tooltip='Edit Patient Basic Info'
                            svg={<SVG src={require('../../assets/icons/edit.svg').default} />}
                            ariaLabel='Edit Patient Basic Info'
                        />{' '}
                        <Button
                            onClickCallBk={(e) => deleteHandler(e, el)}
                            tooltip='Delete Patient'
                            svg={<SVG src={require('../../assets/icons/deleteBin.svg').default} />}
                            ariaLabel='Delete Patient'
                        />{' '}
                        {/* <Button
                        onClickCallBk={() => {}}
                        tooltip='Delete Patient'
                        svg={<SVG src={require('../../assets/icons/deleteBin.svg').default} />}
                        ariaLabel='Delete Patient'
                    />
                    <SVG src={require('../../assets/icons/file.svg').default} /> */}
                        {/* <SVG
                        className='home-page-play'
                        src={require('../../assets/icons/play.svg').default}
                    /> */}
                    </div>
                </div>
            </div>
        ));

    const closeHandler = () => {
        // setLoading(true);
        setIsError(false);
        setErrMsg('');
        // navigate('/users');
    };

    return (
        <>
            {!loading ? (
                !isError ? (
                    Object.keys(patientBasicInfo).length === 0 ? (
                        <div className='top-bottom-position-container top56 center-position'>
                            No patient
                        </div>
                    ) : (
                        <div className='top-bottom-position-container top56'>{patientList()}</div>
                    )
                ) : (
                    <InformativeErrorModal
                        open={isError}
                        btnFunction={closeHandler}
                        className='add-parent-box'
                        errorMsg={errMsg}
                    />
                )
            ) : (
                <Loader />
            )}
            <DeleteConfirmationModal
                modalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
                refetchDataFn={getAllPatients}
                deleteUserHandlerFn={deletePatient}
                dataToDelete={deleteUserData}
                setDataToDelete={setDeleteUserData}
                type={'Patient'}
                setLoading={setLoading}
            />
        </>
    );
};

export default withRouter(withReducer('getAllPatients', getAllPatientReducer)(PatientList));
