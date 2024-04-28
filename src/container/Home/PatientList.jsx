import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '../../hoc/withRouter';
import { withReducer } from '../../hoc/withReducer';

import SVG from 'react-inlinesvg';
import Button from '../../components/Button/Button';
import { InformativeErrorModal } from '../../components/Modal/Modal';
import Loader from '../common/Loader/Loader';

import {
    MAXIMUM_RESULTS_ON_ONE_PAGE_ON_HOME_PAGE,
    somethingWentWrong,
} from '../../utils/globalConstants';
import Status from './Status/Status';
import getAllPatientReducer from '../../store/reducers/patientreducer/getAllPatientReducer';
import { getAllPatientsAction } from '../../store/actions/patientaction/getAllPatientAction';

import './PatientList.scss';

const PatientList = () => {
    const [loading, setLoading] = useState(true);
    const [patientBasicInfo, setPatientBasicInfo] = useState([]);
    const [isError, setIsError] = useState(false);
    const [errMsg, setErrMsg] = useState('');

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

    const patientList = Object.values(patientBasicInfo).map((el, i) => (
        <div className='displayFlex home-row-container row-border' key={'patient-container' + i}>
            <div className='img-container'>
                <img
                    src={
                        el.img || 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
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
            <Status id={'status' + i} status={el.status ?? 'scanned'} />
            <div className='mt-2'>
                <div className='home-page-icons'>
                    <Button
                        onClickCallBk={() => {}}
                        tooltip='Edit Patient Basic Info'
                        svg={<SVG src={require('../../assets/icons/edit.svg').default} />}
                        ariaLabel='Edit Patient Basic Info'
                    />{' '}
                    <Button
                        onClickCallBk={() => {}}
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
        setLoading(true);
        setIsError(false);
        setErrMsg('');
        // navigate('/home');
    };

    return !loading ? (
        !isError ? (
            <div className='top-bottom-position-container top56'>{patientList}</div>
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
    );
};

export default withRouter(withReducer('getAllPatients', getAllPatientReducer)(PatientList));
