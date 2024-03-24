import { createContext, useState } from 'react';

const obj = {
    open: false,
    addType: '',
    addParentUserModalHandler: () => {},
    closeModalHandler: () => {},
};

export const AddParentUserContext = createContext(obj);

export const AddParentUserContextProvider = ({ children, providerObj = obj }) => {
    const [open, setOpen] = useState(false);
    const [addType, setAddType] = useState('');
    const addParentUserModalHandler = (type) => {
        setOpen((prevState) => !prevState);
        setAddType(type);
    };

    const closeModalHandler = () => {
        setOpen((prevState) => !prevState);
        setAddType('');
    };

    providerObj = {
        ...obj,
        open,
        addType,
        addParentUserModalHandler,
        closeModalHandler,
    };
    return (
        <AddParentUserContext.Provider value={providerObj}>
            {children}
        </AddParentUserContext.Provider>
    );
};
