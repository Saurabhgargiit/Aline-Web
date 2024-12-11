import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, Bounce } from 'react-toastify';

import { ReactComponent as MenuListIcon } from '../../assets/icons/menuList.svg'; // Using SVGR
import { ReactComponent as BackIcon } from '../../assets/icons/back.svg'; // Using SVGR
import { ReactComponent as PlusIcon } from '../../assets/icons/admin-plus.svg'; // Using SVGR
import Button from '../../components/Button/Button';
import SearchBar from '../../components/Search';
import Dropdown from '../../components/Dropdown/Dropdown';

import { toggleSideNavigator } from '../../store/actions/sidenNavigatorAction';
import {
  CommonUtils,
  ScreenUtils,
} from '../../utils/commonfunctions/commonfunctions';
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

  const isLaptopScreen = ScreenUtils.isLaptopScreen();

  const selectedRebootID = useSelector(
    (state) => state.rebootReducer.selectedRebootID
  );

  const getLabel = (el) => {
    if (isLaptopScreen) {
      return el === 0 ? 'Treatment Plan' : 'Reboot ' + el;
    } else return el;
  };

  const getRebootOptions = (len) => {
    return rebootIDs.map((el) => {
      return {
        value: el,
        key: el,
        id: el,
        label: getLabel(el),
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

  const headerDetailsFn = (_patientID) => {
    const pathname = location.pathname;
    if (pathname === '/home' || pathname === '/users') {
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
          title: pathname === '/home' ? 'Patient List' : 'Users',
          rightButton: null,
        };
      });
      return;
    }

    const paths = pathname.split('/');
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
        case pathname.includes('treatmentPlan'): {
          title = 'Treatment Plan';
          break;
        }
        case pathname.includes('progress'): {
          title = 'Treatment Progress';
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
          leftButton: iconVar('back', BackIcon, 'Back', '', () => {
            if (!pathname.includes('progress')) {
              changeRebootHandler(0);
            }

            navigate(
              pathname.includes('progress/')
                ? `/patientDetails/${_patientID}/progress`
                : pathname.includes('progress')
                ? `/patientDetails/${_patientID}/details`
                : '/home'
            );
          }),
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
  const openModal = (title, msg, type, disabled, showFooter = true) => {
    setModalDetails((prev) => ({
      ...prev,
      isOpen: true,
      title: title,
      content: <div>{msg}</div>,
      type: type,
      saveHandler: createReboot,
      disabled: disabled,
      showFooter: showFooter,
    }));
  };

  const closeModalHandler = () => {
    setModalDetails((prev) => modalInitialState);
  };

  //Action Handlers
  const actionHandler = useCallback(
    (type) => {
      let title, msg;
      let disabled = true;
      let showFooter = true;
      switch (type) {
        case 'createRebootConfirmation': {
          title = 'Create Reboot';
          msg =
            'Are you sure you want to add new Reboot? This will trigger the change in treatment path.';
          disabled = false;
          break;
        }
        case 'underCreation': {
          title = 'Create Reboot';
          msg = 'Please wait. Reboot framework is under progress';
          showFooter = false;
          break;
        }
        case 'successfullyCreated': {
          title = 'Create Reboot';
          msg =
            'Reboot Successfully created. Please wait while necessary details are fetched.';
          showFooter = false;
          break;
        }
        default:
          break;
      }
      openModal(title, msg, type, disabled, showFooter);
    },
    [openModal]
  );

  useEffect(() => {
    if (patientID && location.pathname.includes('patientDetails')) {
      getRebootIDs();
    }
  }, [patientID]);

  useEffect(() => {
    let _patientID = '';
    if (location.pathname.includes('patientDetails')) {
      const pathNameArr = location.pathname.split('/');
      _patientID = pathNameArr[2];
      setPatientID(_patientID);
    } else {
      setPatientID('');
      setRebootIDs([]);
      changeRebootHandler(0);
    }
    headerDetailsFn(_patientID);
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
      changeRebootHandler(rebootIdsArr[rebootIdsArr.length - 1]);
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
        {isLaptopScreen && (
          <span className="app-header-title font18 font600">
            {headerDetails.title}
          </span>
        )}
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
          !location.pathname.includes('progress') && (
            <>
              <div className="progressBtn-container">
                <Button
                  title={isLaptopScreen ? 'View Progress' : 'Progress'}
                  onClickCallBk={() =>
                    navigate(`/patientDetails/${patientID}/progress`)
                  }
                  className="rebootbtn progressBtn"
                />
              </div>
              {rebootIDs.length > 0 && (
                <div className="reboot-container">
                  {isLaptopScreen && <label className="">Plan Selected</label>}
                  <Dropdown
                    selectedValue={selectedRebootID}
                    options={getRebootOptions()}
                    onChangeCallBk={changeRebootHandler}
                    className="dropdown"
                  />
                  <Button
                    title={isLaptopScreen ? 'Add Reboot' : ''}
                    svg={isLaptopScreen ? '' : <PlusIcon />}
                    onClickCallBk={() => {
                      actionHandler('createRebootConfirmation');
                    }}
                    className="rebootbtn"
                    type="primary"
                  />
                </div>
              )}
            </>
          )}
      </div>
      {!isLaptopScreen && (
        <div className="app-header-menu-button-container right-icon">
          {headerDetails.rightButton}
        </div>
      )}
      <GeneralModal {...modalDetails} closeHanlder={closeModalHandler} />
    </header>
  );
};

export default Header;
