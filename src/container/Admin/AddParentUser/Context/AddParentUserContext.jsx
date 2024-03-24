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
        pass: '',
        role: [],
    });
    const [formValid, setFormValid] = useState(false);

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
            pass: '',
            role: [],
        });
    };

    const addParentUserFn = () => {
        if (!formValid) return;

        postCall(userObj, 'CREATE_PARENT_USER').then((data) => {
            if (data.result === 'success') {
                toast.success(`${addType} added successully`, {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 4000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
            } else if (data.result === 'error') {
                // closeModalHandler();
                toast.error('data.error', {
                    position: 'top-right',
                    hideProgressBar: false,
                    autoClose: 4000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: 'light',
                    transition: Bounce,
                });
            }
        });
    };

    providerObj = {
        ...obj,
        open,
        addType,
        userObj,
        setUserObj,
        addParentUserFn,
        addParentUserModalHandler,
        closeModalHandler,
        setFormValid,
    };
    return (
        <AddParentUserContext.Provider value={providerObj}>
            {children}
        </AddParentUserContext.Provider>
    );
};
