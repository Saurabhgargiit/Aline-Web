import Routers from '../../routers/routers';
import SideSectionLayout from '../SideSection/SideSectionLayout';
import { useState, useCallback, useEffect } from 'react';
import Footer from '../common/Footer';
import Header from '../common/Header';
import WithRouter from '../../hoc/withRouter';
import { CommonConstants } from '../../utils/globalConstants';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/actions/loginaction';
import { getsignedInUserInfo } from '../../store/actions/useraction/userInfoaction';
import Loader from '../common/Loader/Loader';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import { InformativeErrorModal } from '../../components/Modal/Modal';

const SiteLayout = ({ location, navigate }) => {
    const [showSideSection, setShowSideSection] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [getUserErr, setGetUserErr] = useState(false);
    const [errorModal, setErrorModal] = useState(false);

    const { storeUserData } = CommonUtils;

    const { IS_AUTHENTICATED, ACCESS_TOKEN, REFRESH_TOKEN } = CommonConstants;
    const fetchedLoginDetails = useSelector((state) => state.login); //reduxContext
    const fetchedUserInfo = useSelector((state) => state.userInfoReducer?.userInfo);
    const dispatch = useDispatch();
    const sideSectionShowHandler = useCallback(() => {
        setShowSideSection((prevState) => !prevState);
    }, []);

    useEffect(() => {
        if (location.pathname === '/login') {
            navigate('/home');
        }
        if (localStorage.getItem(IS_AUTHENTICATED) === 'true') {
            if (!fetchedLoginDetails?.loggedIn) {
                console.log('entr');
                dispatch(loginAction(true, false));
            }
        }
    }, []);
    console.log(fetchedUserInfo);

    useEffect(() => {
        if (fetchedLoginDetails?.loggedIn) {
            // setTimeout(() => {
            dispatch(getsignedInUserInfo('GET_USER'));
            // }, 2000);
        }
    }, [fetchedLoginDetails?.loggedIn]);

    useEffect(() => {
        console.log(fetchedUserInfo?.data);
        if (fetchedUserInfo?.result === 'success' && fetchedUserInfo?.data !== undefined) {
            const data = fetchedUserInfo?.data;
            storeUserData(data);
            setIsLoading(false);
        } else if (fetchedUserInfo?.result === 'error') {
            setGetUserErr('Something went wrong. Please try again or contact administrator');
            setIsLoading(false);
            setErrorModal(true);
        }
    }, [fetchedUserInfo]);

    const closeHanler = () => {
        setErrorModal(false);
        CommonUtils.clearStorage();
        window.location.path = '/login';
        window.location.reload();
    };

    return isLoading ? (
        <Loader />
    ) : !getUserErr ? (
        <>
            <SideSectionLayout
                open={showSideSection}
                sideSectionShowHandler={sideSectionShowHandler}
            />
            <Header leftBtnHanlder={sideSectionShowHandler} />
            <Routers />
            <Footer />
        </>
    ) : (
        <InformativeErrorModal
            open={errorModal}
            btnFunction={closeHanler}
            className='add-clinic-box'
            errorMsg={getUserErr}
        />
    );
};

export default WithRouter(SiteLayout);
