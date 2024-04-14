import { useState } from 'react';
import PatientList from './PatientList';
import Button from '../../components/Button/Button';
import SVG from 'react-inlinesvg';
import './HomeLayout.scss';
import AddPatientModal from './AddPatient/AddPatientModal';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const HomeLayout = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const modalOpenHandler = () => {
        setIsOpen(() => true);
    };
    const closeHanlder = () => {
        setIsOpen(() => false);
    };

    return (
        <>
            <PatientList />
            <Button
                postionClass={'home-page-button-pos'}
                className={'home-page-add-button'}
                svg={<SVG src={require('../../assets/icons/plus.svg').default} />}
                onClickCallBk={modalOpenHandler}
                tooltip='Add Patient'
            />
            <AddPatientModal isOpen={isOpen} closeHanlder={closeHanlder} />
        </>
    );
};

export default HomeLayout;
