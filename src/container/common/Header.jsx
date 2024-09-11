import './Header.scss';
import SearchBar from '../../components/Search';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ReactComponent as MenuListIcon } from '../../assets/icons/menuList.svg'; // Using SVGR
import { ReactComponent as BackIcon } from '../../assets/icons/back.svg'; // Using SVGR
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';

const Header = ({ title, leftBtnHanlder }) => {
    const [headerDetails, setHeaderDetails] = useState({
        leftButton: null,
        title: null,
    });
    const location = useLocation();
    const navigate = useNavigate();

    const getRebootOptions = (len) =>{
        const rebootOptions =[];
        for(let i=0; i<len; i++){
            rebootOptions.push({value: i, key: i, label: Number.toString(i)})
        }
    }
    const [selectedReboot, setSelectedReboot] = useState(0);
    const [patientID, setPatientID] = useState('');

    const [rebootNumbers, setRebootNumbers] = useState(0); //0 means rebootnumbers value is unavailable. even for plan 1, reboot ID will be there.

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
        <div className='app-header'>
            <div className='app-header-menu-button-container'>
                {/* <button className='app-header-button' onClick={leftBtnHanlder}> */}
                {headerDetails.leftButton}
                {/* </button> */}
            </div>
            <div className='app-header-img-container'>
                <img src='/aline-images/logo.png'></img>
            </div>
            <div className='app-header-title font18 font600'>{headerDetails.title}</div>
            <div className='app-header-filter-container'>
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
        </div>
    );
};

export default Header;
