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
};

export const AddParentUserContext = createContext(obj);

export const AddParentUserContextProvider = ({ children, providerObj = obj }) => {
    const [open, setOpen] = useState(false);
    const [addType, setAddType] = useState('');
    const [userObj, setUserObj] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        password: '',
        role: [],
    });
    const [formValid, setFormValid] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
    });

    //For re-rendering when new user is added
    const [userAdded, setUserAdded] = useState(false);

    //For Drodown in adminheaderbar
    const [userTypeFilter, setUserTypeFilter] = useState('admin');

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const addParentUserModalHandler = (type) => {
        setOpen((prevState) => !prevState);
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
    };

    const addParentUserFn = () => {
        setLoading(true);
        if (!formValid) return;
        const { name, address, city, phone, email, password, role } = userObj;
        //user name is used in backend. Dont change
        const user = {
            name: name,
            email: email,
            password: password,
            role: role,
        };
        //userDetails name is used in backend. Dont change
        const userDetails = {
            mobileNo: 'string',
            userAddress: 'string',
            userCity: 'string',
            userCountry: 'string',
        };
        const userPayload = { user, userDetails };

        postCall(userPayload, 'CREATE_PARENT_USER').then((data) => {
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
                // closeModalHandler();
                toast.error('data.error', {
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
        setUserObj,
        addParentUserFn,
        addParentUserModalHandler,
        closeModalHandler,
        setFormValid,
        setUserTypeFilter,
        paginationHanlder,
        setUserAdded,
    };
    return (
        <AddParentUserContext.Provider value={providerObj}>
            {children}
        </AddParentUserContext.Provider>
    );
};
