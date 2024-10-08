import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, Bounce } from 'react-toastify';

import { ReactComponent as MenuListIcon } from '../../assets/icons/menuList.svg'; // Using SVGR
import { ReactComponent as BackIcon } from '../../assets/icons/back.svg'; // Using SVGR
import Button from '../../components/Button/Button';
import SearchBar from '../../components/Search';
import Dropdown from '../../components/Dropdown/Dropdown';

import { toggleSideNavigator } from '../../store/actions/sidenNavigatorAction';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import './Header.scss';
import { rebootAction, setSelectedRebootAction } from '../../store/actions/rebootAction';
import { postCall } from '../../utils/commonfunctions/apicallactions';

const Header = ({ title, leftBtnHanlder }) => {
    const [headerDetails, setHeaderDetails] = useState({
        leftButton: null,
        title: null,
        rightButton: null,
    });
    const [patientID, setPatientID] = useState('');
    const [rebootIDs, setRebootIDs] = useState([]);
    const [selectedReboot, setSelectedReboot] = useState(0);


    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const rebootIDsObject  = useSelector(state => state.rebootReducer.rebootIDs);
      
    const selectedRebootID = useSelector(state => state.rebootReducer.selectedRebootID);
      

    const getRebootOptions = (len) =>{
        return rebootIDs.map(el =>{
            return {value: el, key: el, id:el, label: String(el+1)}}
        )
    }

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

    const createReboot =() =>{
        postCall({}, 'CREATE_REBOOT', [patientID]).then((data) => {
            if (data.result === 'success') {
                toast.success(`Reboot added successully`, {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 2000,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
                // setUserAdded(() => true);
                // closeModal();
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
        })
    }

    const getRebootIDs = () => {
        dispatch(rebootAction('GET_REBOOT_IDS', [patientID]));
    };

    const changeRebootHandler =(selectedValue) =>{
        dispatch(setSelectedRebootAction(selectedValue));
    }
    
    useEffect(()=>{
        if(patientID && location.pathname.includes('patientDetails')){
            getRebootIDs();
        }
    },[patientID])

    useEffect(() => {
        headerDetailsFn();
        if(location.pathname.includes('patientDetails')){
            const pathNameArr = location.pathname.split('/');
            const patientIDURL = pathNameArr[2];
            setPatientID(patientIDURL);
        //     const rebootID = +pathNameArr[3];
        //     if(rebootID !== selectedReboot) setSelectedReboot(rebootID);
        //     if(patientIDURL !== patientID )setPatientID(patientIDURL);
        } else{
            setPatientID('');
            setRebootIDs([]);
            setSelectedReboot(0);
        }
    }, [location.pathname]);

    useEffect(()=>{
        if (
            rebootIDsObject?.result === 'success' &&
            rebootIDsObject?.data !== undefined && rebootIDsObject?.data.length !==0
        ) {
            const rebootIdsArr = rebootIDsObject?.data;
            // setRebootIDs(rebootIdsArr);
            setRebootIDs([...rebootIdsArr]); //for testing only
            setSelectedReboot(rebootIdsArr[rebootIdsArr.length-1]);
        }

    },[rebootIDsObject])

    useEffect(()=>{
        if(selectedRebootID !== null && selectedRebootID !== undefined){
            setSelectedReboot(selectedRebootID);
        }
    },[selectedRebootID])

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
                {location.pathname.includes('patientDetails') && rebootIDs.length>0 &&
                    <div className='reboot-container'>
                        <label className="">Plan Selected</label>
                        <Dropdown 
                            selectedValue={selectedRebootID} 
                            options={getRebootOptions()}
                            onChangeCallBk={changeRebootHandler}
                            className='dropdown'
                        />
                        <Button title='Add Reboot' onClickCallBk={()=>{createReboot()}} className='rebootbtn' type='primary'/>
                    </div>
                }
            </div>
            {!CommonUtils.isLaptopScreen() && <div className='app-header-menu-button-container right-icon'>
                {headerDetails.rightButton}
            </div>}
        </header>
    );
};

export default Header;
