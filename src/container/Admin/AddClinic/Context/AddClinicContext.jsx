import { createContext, useState } from 'react';

const obj = {
    open: false,
    addClinicModalHandler: () => {},
    closeModalHandler: () => {},
};

export const AddClinicContext = createContext(obj);

export const AddClinicContextProvider = ({ children, providerObj = obj }) => {
    const [open, setOpen] = useState(false);
    const addClinicModalHandler = () => {
        setOpen((prevState) => !prevState);
    };

    const closeModalHandler = () => {
        setOpen((prevState) => !prevState);
    };

    providerObj = {
        ...obj,
        open,
        addClinicModalHandler,
        closeModalHandler,
    };
    return <AddClinicContext.Provider value={providerObj}>{children}</AddClinicContext.Provider>;
};
