import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SVG from 'react-inlinesvg';

import ComplaintNHistoryForm from './ComplaintNHistoryForm';
import TreatmentGoal from './TreatmentGoal';
import PhotosScans from './PhotosScans';
import Button from '../../../components/Button/Button';

import './FormViewTabs.scss';

function FormViewTabs() {
    const [isEdit, setIsEdit] = useState(true);

    const editHandler = () => {
        if (!isEdit) {
            setIsEdit(true);
        }
    };

    const cancelHandler = () => {
        if (isEdit) {
            setIsEdit(false);
        }
    };

    return (
        <>
            <Tabs
                defaultActiveKey='home'
                id='justify-tab-example'
                className='patient-details-tabs-container'
                justify
            >
                <Tab eventKey='home' title='Complaint & History'>
                    <ComplaintNHistoryForm isEdit={isEdit} />
                </Tab>
                <Tab eventKey='profile' title='Treatment Goal'>
                    <TreatmentGoal isEdit={isEdit} />
                </Tab>
                {/* <Tab eventKey='longer-tab' title='Photos & Scans'>
                    <PhotosScans isEdit={isEdit} />
                </Tab> */}
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
