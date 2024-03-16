import Routers from '../../routers/routers';
import SideSectionLayout from '../SideSection/SideSectionLayout';
import { useState, useCallback, useEffect } from 'react';
import Footer from '../common/Footer';
import Header from '../common/Header';
import WithRouter from '../../hoc/withRouter';
import { CommonConstants } from '../../utils/globalConstants';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/actions/loginaction';

const SiteLayout = ({ location, navigate }) => {
    const [showSideSection, setShowSideSection] = useState(false);
    const { IS_AUTHENTICATED } = CommonConstants;
    const dispatch = useDispatch();
    const sideSectionShowHandler = useCallback(() => {
        setShowSideSection((prevState) => !prevState);
    }, []);

    useEffect(() => {
        if (location.pathname === '/login') {
            navigate('/home');
        }
        if (localStorage.getItem(IS_AUTHENTICATED) === 'true') {
            if (!fetchedDetails?.loggedIn) {
                dispatch(loginAction(true, false));
            }
        }
    }, []);
    const fetchedDetails = useSelector((state) => state.login); //reduxContext

    console.log(fetchedDetails);

    return (
        <>
            <SideSectionLayout
                open={showSideSection}
                sideSectionShowHandler={sideSectionShowHandler}
            />
            <Header leftBtnHanlder={sideSectionShowHandler} />
            <Routers />
            <Footer />
        </>
    );
};

export default WithRouter(SiteLayout);
