import react, { useCallback, useState, useRef } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SVG from 'react-inlinesvg';

import ComplaintNHistoryForm from './ComplaintNHistoryForm';
import TreatmentGoal from './TreatmentGoal';
import PhotosScans from './PhotosScans';
import Button from '../../../components/Button/Button';

import './FormViewTabs.scss';

function FormViewTabs() {
    const [isEdit, setIsEdit] = useState(false);
    const [tabKey, setTabKey] = useState('home');

    const [complaintForm, setComplaintForm] = useState({});
    const [treatmentGoalForm, setTreatmentGoalForm] = useState({});

    const firstLoad = useRef(false);
    firstLoad.current = true;
    console.log(firstLoad.current);

    const editHandler = () => {
        if (!isEdit) {
            setIsEdit(true);
        }
    };

    const cancelHandler = useCallback(() => {
        setIsEdit(false);
        setComplaintForm({}); //set to redux state value
        setTreatmentGoalForm({}); //set to redux state value
    }, []);

    const clickHandler = useCallback((key) => {
        setTabKey(key);
    }, []);

    const tabClickHandler = (key) => {
        if (key === tabKey) return;
        clickHandler(key);
    };

    return (
        <>
            <Tabs
                id='justify-tab-example'
                className='patient-details-tabs-container'
                activeKey={tabKey}
                onSelect={(key) => tabClickHandler(key)}
                justify
            >
                <Tab eventKey='home' title='Complaint & History' disabled={isEdit}>
                    <ComplaintNHistoryForm
                        isEdit={isEdit}
                        clickHandler={clickHandler}
                        cancelHandler={cancelHandler}
                        formData={complaintForm}
                        setFormData={setComplaintForm}
                    />
                </Tab>
                <Tab eventKey='profile' title='Treatment Goal' disabled={isEdit}>
                    <TreatmentGoal
                        isEdit={isEdit}
                        clickHandler={clickHandler}
                        formData={treatmentGoalForm}
                        setFormData={setTreatmentGoalForm}
                    />
                </Tab>
            </Tabs>
            <Button
                postionClass={'home-page-button-pos rightPosEdit'}
                className={'home-page-add-button'}
                svg={
                    !isEdit ? (
                        <SVG src={require(`../../../assets/icons/edit-2.svg`).default} />
                    ) : (
                        <SVG src={require(`../../../assets/icons/close.svg`).default} />
                    )
                }
                onClickCallBk={!isEdit ? editHandler : cancelHandler}
                tooltip={!isEdit ? 'Edit' : 'Cancel'}
            />
        </>
    );
}

export default FormViewTabs;
