import { createContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommonUtils } from '../../../../utils/commonfunctions/commonfunctions';
import { postCall } from '../../../../utils/commonfunctions/apicallactions';
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
};

export const AddParentUserContext = createContext(obj);

export const AddParentUserContextProvider = ({ children, providerObj = obj }) => {
    const [open, setOpen] = useState(false);
    const [addType, setAddType] = useState('');
    const [userObj, setUserObj] = useState({
        name: '',
        email: '',
        password: '',
        role: [],
    });

    //different oject considering backend
    const [detailUserObject, setDetailUserObj] = useState({
        mobileNo: '',
        userAddress: '',
        userCity: '',
        userCountry: '',
    });

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

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    //Modal For adding lab, clinic and admin
    const addParentUserModalHandler = (type, clinic = {}) => {
        setOpen((prevState) => !prevState);
        if (type === 'Doctor') {
            setDataToModal((prevState) => clinic);
        }
        setAddType(type);
        const role = CommonUtils.getPayloadRole(type);
        setUserObj((prevState) => {
            return {
                ...prevState,
                role: [role],
            };
        });
    };

    const closeModalHandler = () => {
        setOpen((prevState) => !prevState);
        setAddType('');
        setUserObj({
            name: '',
            address: '',
            city: '',
            phone: '',
            email: '',
            password: '',
            role: [],
        });
        setDataToModal(() => {});
    };

    //For adding lab, clinic and admin
    const addParentUserFn = () => {
        setLoading(true);
        if (!formValid) return;

        //user name is used in backend. Dont change
        const user = userObj;
        //userDetails name is used in backend. Dont change
        const userDetails = detailUserObject;
        const userPayload = { user, userDetails };
        let params = {};
        if (addType === 'Doctor') {
            params = { parentID: dataToModal?.userID };
        }

        postCall(userPayload, 'CREATE_PARENT_USER', [], params).then((data) => {
            console.log(data);
            if (data.result === 'success') {
                toast.success(`${addType} added successully`, {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: true,
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
                    pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
            }
            setLoading(false);
        });
    };

    const addDoctorFn = () => {};

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
    };
    return (
        <AddParentUserContext.Provider value={providerObj}>
            {children}
        </AddParentUserContext.Provider>
    );
};
