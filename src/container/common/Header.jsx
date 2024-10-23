import { useEffect, useState, useCallback } from 'react';
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
import {
  rebootAction,
  setSelectedRebootAction,
} from '../../store/actions/rebootAction';
import { setSearchDataAction } from '../../store/actions/searchAction';
import { postCall } from '../../utils/commonfunctions/apicallactions';
import GeneralModal from '../../components/Modal/GeneralModal';

import './Header.scss';

const modalInitialState = {
  isOpen: false,
  title: '',
};

const Header = ({ title, leftBtnHanlder }) => {
  const [headerDetails, setHeaderDetails] = useState({
    leftButton: null,
    title: null,
    rightButton: null,
  });
  const [patientID, setPatientID] = useState('');
  const [rebootIDs, setRebootIDs] = useState([]);
  const [selectedReboot, setSelectedReboot] = useState(0);
  const [modalDetails, setModalDetails] = useState(modalInitialState);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rebootIDsObject = useSelector((state) => state.rebootReducer.rebootIDs);

  const selectedRebootID = useSelector(
    (state) => state.rebootReducer.selectedRebootID
  );

  const getRebootOptions = (len) => {
    return rebootIDs.map((el) => {
      return {
        value: el,
        key: el,
        id: el,
        label: el === 0 ? 'Treatment Plan' : 'Reboot ' + el,
      };
    });
  };

  const menuToggler = () => {
    dispatch(toggleSideNavigator());
  };

  const iconVar = (key, Icon, label, iconClass = '', handler) => (
    <Button
      className="app-header-button"
      svg={<Icon className={iconClass} />}
      tooltip={label}
      onClickCallBk={handler}
      placement="bottom"
      ariaLabel={label}
    />
  );

  const headerDetailsFn = () => {
    if (location.pathname === '/home' || location.pathname === '/users') {
      setHeaderDetails((prevState) => {
        return {
          ...prevState,
          leftButton: iconVar(
            'menuList',
            MenuListIcon,
            'Menu',
            '',
            leftBtnHanlder
          ),
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
        case location.pathname.includes('treatmentPlan'): {
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
          leftButton: iconVar('back', BackIcon, 'Back', '', () =>
            navigate('/home')
          ),
          title: title,
          rightButton: iconVar(
            'menuList',
            MenuListIcon,
            'Menu',
            '',
            menuToggler
          ),
        };
      });
      return;
    }
  };

  const createReboot = () => {
    actionHandler('underCreation');
    postCall({}, 'CREATE_REBOOT', [patientID]).then((data) => {
      if (data.result === 'success') {
        actionHandler('successfullyCreated');
        getRebootIDs();
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

  const getRebootIDs = async () => {
    dispatch(rebootAction('GET_REBOOT_IDS', [patientID]));
  };

  const changeRebootHandler = (selectedValue) => {
    dispatch(setSelectedRebootAction(selectedValue));
  };

  const searchHandler = (searchData) => {
    dispatch(setSearchDataAction(searchData));
  };

  //Modal Handlers
  const openModal = (title, msg, type) => {
    setModalDetails((prev) => ({
      ...prev,
      isOpen: true,
      title: title,
      content: <div>{msg}</div>,
      type: type,
      saveHandler: createReboot,
    }));
  };

  const closeModalHandler = () => {
    setModalDetails((prev) => modalInitialState);
  };

  //Action Handlers
  const actionHandler = useCallback(
    (type) => {
      let title, msg;
      switch (type) {
        case 'createRebootConfirmation': {
          title = 'Create Reboot';
          msg =
            'Are you sure you want to add new Reboot? This will trigger the change in treatment path.';
          break;
        }
        case 'underCreation': {
          title = 'Create Reboot';
          msg = 'Please wait. Reboot framework is under progress';
          break;
        }
        case 'successfullyCreated': {
          title = 'Create Reboot';
          msg =
            'Reboot Successfully created. Please wait while necessary details are fetched.';
          break;
        }
        default:
          break;
      }
      openModal(title, msg, type);
    },
    [openModal]
  );

  useEffect(() => {
    if (patientID && location.pathname.includes('patientDetails')) {
      getRebootIDs();
    }
  }, [patientID]);

  useEffect(() => {
    headerDetailsFn();
    if (location.pathname.includes('patientDetails')) {
      const pathNameArr = location.pathname.split('/');
      const patientIDURL = pathNameArr[2];
      setPatientID(patientIDURL);
      //     const rebootID = +pathNameArr[3];
      //     if(rebootID !== selectedReboot) setSelectedReboot(rebootID);
      //     if(patientIDURL !== patientID )setPatientID(patientIDURL);
    } else {
      setPatientID('');
      setRebootIDs([]);
      setSelectedReboot(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      rebootIDsObject?.result === 'success' &&
      rebootIDsObject?.data !== undefined &&
      rebootIDsObject?.data.length !== 0
    ) {
      const rebootIdsArr = rebootIDsObject?.data;
      // setRebootIDs(rebootIdsArr);
      setRebootIDs([...rebootIdsArr]);
      setSelectedReboot(rebootIdsArr[rebootIdsArr.length - 1]);
      if (modalDetails.isOpen) {
        changeRebootHandler(rebootIdsArr[rebootIdsArr.length - 1]);
        setTimeout(() => {
          closeModalHandler();
        }, 500);
      }
    }
  }, [rebootIDsObject]);

  useEffect(() => {
    if (selectedRebootID !== null && selectedRebootID !== undefined) {
      setSelectedReboot(selectedRebootID);
    }
  }, [selectedRebootID]);

  return (
    <header className="app-header">
      <div className="app-header-menu-button-container left-icon">
        {headerDetails.leftButton}
      </div>
      <div className="logo-title-container">
        <div className="app-header-img-container">
          <img src="/aline-images/logo.png"></img>
        </div>
        <span className="app-header-title font18 font600">
          {headerDetails.title}
        </span>
      </div>
      <div className="growing-container">
        {location.pathname === '/home' && (
          <SearchBar searchHandler={searchHandler} />
        )}
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
        {location.pathname.includes('patientDetails') &&
          rebootIDs.length > 0 && (
            <div className="reboot-container">
              <label className="">Plan Selected</label>
              <Dropdown
                selectedValue={selectedRebootID}
                options={getRebootOptions()}
                onChangeCallBk={changeRebootHandler}
                className="dropdown"
              />
              <Button
                title="Add Reboot"
                onClickCallBk={() => {
                  actionHandler('createRebootConfirmation');
                }}
                className="rebootbtn"
                type="primary"
              />
            </div>
          )}
      </div>
      {!CommonUtils.isLaptopScreen() && (
        <div className="app-header-menu-button-container right-icon">
          {headerDetails.rightButton}
        </div>
      )}
      <GeneralModal {...modalDetails} closeHanlder={closeModalHandler} />
    </header>
  );
};

export default Header;
