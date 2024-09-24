import { useState, useEffect, memo, useCallback, useRef } from 'react';
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
    const [patientBasicInfo, setPatientBasicInfo] = useState([]);
    const [pageNumber, setPageNumber] = useState(0); // Current page number
    const [hasMore, setHasMore] = useState(true); // If more data is available
    const [isFetching, setIsFetching] = useState(false); // To prevent multiple fetches
    const [pageNoforwhichDataAppended, setPageNoforwhichDataAppended] = useState(-1);
  
    const [isError, setIsError] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteUserData, setDeleteUserData] = useState({});

    const fetchedAllPatients = useSelector((state) => state.getAllPatients.allPatients);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //api function for getting the patients
    const getAllPatients = (page = 0) => {
        if (isFetching) return; // Prevent multiple requests
        setIsFetching(true);
    
        const query = {
        pageNumber: page,
        pageSize: MAXIMUM_RESULTS_ON_ONE_PAGE_ON_HOME_PAGE,
        sortBy: 'id',
        sortDir: 'des',
        };
    
        dispatch(getAllPatientsAction('GET_ALL_PATIENTS', [], query))
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
                resetForGetPatient();
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
                // getAllPatients();
                resetForGetPatient();
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
        !!patientInfo.id && navigate('/patientDetails/' + patientInfo.id + '/0' +'/details');
    };

    //@@@@@@@@@@@@@@@ useEffect @@@@@@@@@@@@@@@@@@@@
    //First time call
    useEffect(() => {
        if(pageNumber>pageNoforwhichDataAppended){
            getAllPatients(pageNumber);
        }
    }, [pageNumber]);

    useEffect(() => {
        if (fetchedAllPatients.result === 'success' && fetchedAllPatients.data !== undefined) {
            const patientList = fetchedAllPatients.data?.content || [];
            const {last} = fetchedAllPatients.data;

            if(pageNoforwhichDataAppended < pageNumber){
                setPatientBasicInfo((prevPatients) => [...prevPatients, ...patientList]);
            }
            setPageNoforwhichDataAppended(page => {
                if(pageNumber>page) return pageNumber;
                else return page;   
            })
            setHasMore(!last); 
            setLoading(false);
            setIsFetching(false);
        } else if (fetchedAllPatients.result === 'error') {
            setErrMsg(somethingWentWrong);
            setLoading(false);
            setIsError(true);
            setIsFetching(false);
        }
    }, [fetchedAllPatients]);

    const resetForGetPatient = () =>{
        setPageNoforwhichDataAppended(-1);
        setPageNumber(0);
        setPatientBasicInfo([]);
        setLoading(true);
        setIsFetching(true);
        setHasMore(true);
        setErrMsg('');
        setIsError(false);
        setTimeout(()=>getAllPatients(0));
    }

    //force relaod after adding/editing patient
    useEffect(() => {
        if (userAdded) {
            resetForGetPatient();
            setUserAdded(() => false);
        }
    }, [userAdded]);

    const closeHandler = () => {
        // setLoading(true);
        setIsError(false);
        setErrMsg('');
        // navigate('/users');
    };

    const observer = useRef();

    const lastPatientElementRef = useCallback(
      (node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore && !isFetching) {
            setPageNumber(page => page+1);
          }
        });
        if (node) observer.current.observe(node);
      },
      [loading, hasMore, pageNumber, isFetching]
    );

    const contentRender =(el,i) =>{
        return <>
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
                        {'Scan Date:' + new Date(el.dateOfScan).toLocaleDateString()}
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
                    </div>
                </div>
            </>
    }

    const patientList = () => {
        return patientBasicInfo.map((el, i) => {            
            if(i === patientBasicInfo.length-4){
                return <div
                    ref={lastPatientElementRef}
                    className='displayFlex home-row-container row-border pointer'
                    key={'patient-container' + i}
                    onClick={(e) => navgationHandler(el)}
                >
                    {contentRender(el,i)}
                </div>
            }else{
                return <div
                    className='displayFlex home-row-container row-border pointer'
                    key={'patient-container' + i}
                    onClick={(e) => navgationHandler(el)}
                >
                    {contentRender(el,i)}
                </div>
            }
        })
    }

    return (
        <>
            {!loading ? (
                !isError ? (
                    patientBasicInfo.length === 0 ? (
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
                <Loader className={'positionRelative top56 center-position'} />
            )}
            <DeleteConfirmationModal
                modalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
                refetchDataFn={resetForGetPatient}
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
