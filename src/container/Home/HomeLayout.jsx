import { useState } from 'react';
import PatientList from './PatientList';
import Button from '../../components/Button/Button';
import SVG from 'react-inlinesvg';
import AddPatientModal from './AddPatient/AddPatientModal';

const HomeLayout = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [userAdded, setUserAdded] = useState(false);

    const modalOpenHandler = () => {
        setIsOpen(() => true);
    };
    const closeHanlder = () => {
        setIsOpen(() => false);
        setIsEdit(() => false);
        setEditData({});
    };

    const editPatientHandler = (e, patientInfo) => {
        e.stopPropagation();
        modalOpenHandler();
        setIsEdit(() => true);
        setEditData(() => patientInfo);
    };

    return (
        <>
            <PatientList
                editPatientHandler={editPatientHandler}
                userAdded={userAdded}
                setUserAdded={setUserAdded}
            />
            <Button
                postionClass={'home-page-button-pos rightPos'}
                className={'home-page-add-button'}
                svg={<SVG src={require('../../assets/icons/plus.svg').default} />}
                onClickCallBk={modalOpenHandler}
                tooltip='Add Patient'
            />
            <AddPatientModal
                isOpen={isOpen}
                isEdit={isEdit}
                closeHanlder={closeHanlder}
                initialData={editData}
                setUserAdded={setUserAdded}
            />
        </>
    );
};

export default HomeLayout;
