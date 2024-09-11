import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ReactComponent as MenuListIcon } from '../../assets/icons/menuList.svg'; // Using SVGR
import { ReactComponent as BackIcon } from '../../assets/icons/back.svg'; // Using SVGR
import Button from '../../components/Button/Button';
import SearchBar from '../../components/Search';
import Dropdown from '../../components/Dropdown/Dropdown';

import { toggleSideNavigator } from '../../store/actions/sidenNavigatorAction';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import './Header.scss';

const Header = ({ title, leftBtnHanlder }) => {
    const [headerDetails, setHeaderDetails] = useState({
        leftButton: null,
        title: null,
        rightButton: null,
    });
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getRebootOptions = (len) =>{
        const rebootOptions =[];
        for(let i=0; i<len; i++){
            rebootOptions.push({value: i, key: i, label: Number.toString(i)})
        }
    }
    const [selectedReboot, setSelectedReboot] = useState(0);
    const [patientID, setPatientID] = useState('');

    const [rebootNumbers, setRebootNumbers] = useState(0); //0 means rebootnumbers value is unavailable. even for plan 1, reboot ID will be there.

    const menuToggler = () =>{
        dispatch(toggleSideNavigator())
    }

    const iconVar = (key, Icon, label, iconClass = '', handler) => (
        <Button
            className='app-header-button'
            svg={<Icon className={iconClass} />}
            tooltip={label}
            onClickCallBk={handler}
            placement='bottom'
            ariaLabel={label}
        />
    );

    const headerDetailsFn = () => {
        if (location.pathname === '/home' || location.pathname === '/users') {
            setHeaderDetails((prevState) => {
                return {
                    ...prevState,
                    leftButton: iconVar('menuList', MenuListIcon, 'Menu', '', leftBtnHanlder),
                    title: location.pathname === '/home' ? 'Patient List' : 'Users',
                    rightButton: null,
                };
            });
            return;
        }

        const paths = location.pathname.split('/');
        if (paths.includes('patientDetails')) {
            let title = '';
            switch (true) {
                case paths[paths.length - 1] === 'details': {
                    title = 'Patient Details';
                    break;
                }
                case paths[paths.length - 1] === 'photosScans': {
                    title = 'Photos and Scans';
                    break;
                }
                case location.pathname.includes('treatmentPlan'):{
                    title = 'Treatment Plan';
                    break;
                }
                default: {
                    title = 'Aline Patient Manager';
                    break;
                }
            }
            setHeaderDetails((prevState) => {
                return {
                    ...prevState,
                    leftButton: iconVar('back', BackIcon, 'Back', '', () => navigate('/home')),
                    title: title,
                    rightButton: iconVar('menuList', MenuListIcon, 'Menu', '', menuToggler)
                };
            });
            return;
        }
    };

    useEffect(() => {
        headerDetailsFn();
        if(location.pathname.includes('patientDetails')){
            const pathNameArr = location.pathname.split('/');
            const patientIDURL = pathNameArr[2];
            const rebootID = +pathNameArr[3];
            if(rebootID !== selectedReboot) setSelectedReboot(rebootID);
            if(patientIDURL !== patientID )setPatientID(patientIDURL);
        }
    }, [location.pathname]);

    return (
        <header className='app-header'>
            <div className='app-header-menu-button-container left-icon'>
                {headerDetails.leftButton}
            </div>
            <div className='logo-title-container'>
                <div className='app-header-img-container'>
                    <img src='/aline-images/logo.png'></img>
                </div>
                <span className='app-header-title font18 font600'>{headerDetails.title}</span>
                </div>
            <div className='growing-container'>
                {location.pathname === '/home' && <SearchBar />}
                {/* <button className='app-header-button'>
                    <SVG src={require('../../assets/icons/search.svg').default} />
                </button>
                <button className='app-header-button'>
                    <SVG src={require('../../assets/icons/checksquare.svg').default} />
                </button>
                <button className='app-header-button'>
                    <SVG src={require('../../assets/icons/reload.svg').default} />
                </button> */}
                {/* {location.pathname.includes('patientDetails') && <Dropdown/>} */}
            </div>
            {!CommonUtils.isLaptopScreen() && <div className='app-header-menu-button-container right-icon'>
                {headerDetails.rightButton}
            </div>}
        </header>
    );
};

export default Header;
