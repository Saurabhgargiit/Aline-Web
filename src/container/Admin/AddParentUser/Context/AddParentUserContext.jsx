import { createContext, useState } from 'react';
import { CommonUtils } from '../../../../utils/commonfunctions/commonfunctions';
import { postCall, putCall } from '../../../../utils/commonfunctions/apicallactions';
import { toast, Bounce } from 'react-toastify';

const obj = {
    open: false,
    addType: '',
    addParentUserModalHandler: () => {},
    closeModalHandler: () => {},
    userObj: {},
    setUserObj: () => {},
    addParentUserFn: () => {},
    setFormValid: () => {},
    loading: false,
    userTypeFilter: '',
    setUserTypeFilter: () => {},
    pagination: {},
    paginationHanlder: () => {},
    userAdded: false,
    setUserAdded: () => {},
    detailUserObject: {},
    setDetailUserObj: () => {},
    dataToModal: {},
    setDataToModal: () => {},
    isEdit: false,
    setIsEdit: () => {},
    isResetPassModalOpen: false,
    changePasswordHandler: () => {},
    changePasswordFn: () => {},
    isAddExistingDrClinicOpen: false,
    addExistingDoctortoClinincModal: () => {},
    addExistingDoctortoClinincFn: () => {},
};

const userObjInitialState = {
    name: '',
    email: '',
    password: '',
    role: [],
};

const detailUserObjInitialState = {
    mobileNo: '',
    userAddress: '',
    userCity: '',
    userCountry: '',
};

export const AddParentUserContext = createContext(obj);

export const AddParentUserContextProvider = ({ children, providerObj = obj }) => {
    const [open, setOpen] = useState(false);
    const [addType, setAddType] = useState('');

    const [userObj, setUserObj] = useState(userObjInitialState);

    const [detailUserObject, setDetailUserObj] = useState(detailUserObjInitialState);

    const [formValid, setFormValid] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
    });

    //For re-rendering when new user is added
    const [userAdded, setUserAdded] = useState(false);

    //For Drodown in adminheaderbar
    const [userTypeFilter, setUserTypeFilter] = useState('doctor');

    //For setting object to pass on to Modal for editing or adding doctor
    const [dataToModal, setDataToModal] = useState({});

    //Edit Users state
    const [isEdit, setIsEdit] = useState(false);

    //Edit password by Admin related state
    const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);

    //Add existing doctor to clinic modal
    const [isAddExistingDrClinicOpen, setIsAddExistingDrClinicOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    //Modal For adding lab, clinic and admin
    const addParentUserModalHandler = (type, user = {}, isEdit = false) => {
        setOpen((prevState) => true);
        if (type === 'Doctor' && !isEdit) {
            setDataToModal((prevState) => user);
        }
        if (isEdit) {
            setIsEdit(() => true);
            setDataToModal((prevState) => user);
        }
        type = CommonUtils.capitalizeFirstLetter(type);
        setAddType(type);
        const role = CommonUtils.getPayloadRole(type);

        //To set role as default
        setUserObj((prevState) => {
            return {
                ...prevState,
                role: [role],
            };
        });
    };

    //Modal For changing password
    const changePasswordHandler = (user) => {
        //newPassword & reEnterNewPassword are keys sent on apis. Donot change name
        setDataToModal(() => {
            return { ...user };
        });
        setUserObj(() => {
            return { newPassword: '', reEnterNewPassword: '' };
        });
        setIsResetPassModalOpen(() => true);
    };

    //Modal For adding exisiting docctor to this clinic
    const addExistingDoctortoClinincModal = (user) => {
        setDataToModal(() => {
            return { ...user };
        });
        setUserObj(() => {});
        setIsAddExistingDrClinicOpen(() => true);
    };

    //Close Modal For adding lab, clinic and admin
    const closeModalHandler = () => {
        setOpen((prevState) => false);
        setAddType('');
        setUserObj(() => {
            return { ...userObjInitialState };
        });
        setDetailUserObj(() => {
            return { ...detailUserObjInitialState };
        });
        setDataToModal(() => {});
        setIsEdit(() => false);
        setIsResetPassModalOpen(() => false);
        setFormValid(() => false);
        setIsAddExistingDrClinicOpen(() => false);
    };

    //api call For adding lab, clinic, admin, doctor
    const addParentUserFn = () => {
        setLoading(true);
        if (!formValid) return;

        let user, userDetails, userDto, userDetailsDto;
        let userPayload = {};

        if (!isEdit) {
            //user & userDetails names are used in backend for post request. Dont change
            userPayload = { user: userObj, userDetails: detailUserObject };
        } else {
            //userDto & userDetailsDto names are used in backend for post request. Dont change
            const userObjModified = { ...userObj, id: dataToModal?.userID };
            delete userObjModified['password'];
            userPayload = { userDto: userObjModified, userDetailsDto: detailUserObject };
        }

        let params = {};

        //consdition for doctor only to add parent
        if (addType === 'Doctor') {
            params = { parentID: dataToModal?.userID };
        }

        if (!isEdit) {
            postCall(userPayload, 'CREATE_PARENT_USER', [], params).then((data) => {
                if (data.result === 'success') {
                    toast.success(`${addType} added successully`, {
                        position: 'top-right',
                        hideProgressBar: false,
                        autoClose: 2000,
                        closeOnClick: true,
                        // pauseOnHover: true,
                        theme: 'light',
                        transition: Bounce,
                    });
                    setUserAdded(true);
                    closeModalHandler();
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
                setLoading(false);
            });
        } else {
            putCall(userPayload, 'UPDATE_USER', [dataToModal?.userID], params).then((data) => {
                if (data.result === 'success') {
                    toast.success(`${addType} modified successully`, {
                        position: 'top-right',
                        hideProgressBar: false,
                        autoClose: 2000,
                        closeOnClick: true,
                        // pauseOnHover: true,
                        theme: 'light',
                        transition: Bounce,
                    });
                    setUserAdded(true);
                    closeModalHandler();
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
                setLoading(false);
            });
        }
    };

    //api call for change password
    const changePasswordFn = () => {
        //userObj must contain {newPassword, reEnterNewPassword}. These are backend keys
        const userPayload = userObj;
        const params = {};
        putCall(userPayload, 'PASS_CHANGE_BY_ADMIN', [dataToModal?.id], params).then((data) => {
            if (data.result === 'success') {
                toast.success(`Password changed successully`, {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 2000,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
                // setUserAdded(true);
                closeModalHandler();
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
            setLoading(false);
        });
    };

    const addExistingDoctortoClinincFn = () => {
        //dataToModal is containing clinic Id
        console.log(dataToModal);
        // userId is containing doctorid & doctor name;
        console.log(userObj);
    };

    const paginationHanlder = (type, page, totalElements = 0) => {
        if (type === 'page') {
            setPagination((prevState) => {
                return { ...prevState, page: page };
            });
        } else if (type === 'total') {
            setPagination((prevState) => {
                return { ...prevState, total: totalElements };
            });
        }
    };

    providerObj = {
        ...obj,
        open,
        addType,
        userObj,
        loading,
        userTypeFilter,
        pagination,
        userAdded,
        detailUserObject,
        dataToModal,
        isEdit,
        isResetPassModalOpen,
        isAddExistingDrClinicOpen,
        setUserObj,
        addParentUserFn,
        addParentUserModalHandler,
        closeModalHandler,
        setFormValid,
        setUserTypeFilter,
        paginationHanlder,
        setUserAdded,
        setDetailUserObj,
        setDataToModal,
        setIsEdit,
        changePasswordHandler,
        changePasswordFn,
        addExistingDoctortoClinincModal,
        addExistingDoctortoClinincFn,
    };
    return (
        <AddParentUserContext.Provider value={providerObj}>
            {children}
        </AddParentUserContext.Provider>
    );
};
