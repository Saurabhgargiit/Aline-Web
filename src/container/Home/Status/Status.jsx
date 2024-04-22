import { useState } from 'react';
import { useDispatch } from 'react-redux';
import SVG from 'react-inlinesvg';
import { Badge } from 'react-bootstrap';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Button from '../../../components/Button/Button';
import './Status.scss';

const Status = ({ id, status = 'scanned' }) => {
    const statusList = [
        { id: 'scanned', key: 'scanned', value: 'scanned', label: 'Scanned', color: 'secondary' },
        {
            id: 'planShared',
            key: 'planShared',
            value: 'planShared',
            label: 'Plan Shared',
            color: 'info',
        },
        {
            id: 'confirmed',
            key: 'confirmed',
            value: 'confirmed',
            label: 'Confirmed',
            color: 'success',
        },
        {
            id: 'rejected',
            key: 'rejected',
            value: 'rejected',
            label: 'Rejected (patient declined)',
            color: 'danger',
        },
        {
            id: 'modificationRequested',
            key: 'modificationRequested',
            value: 'modificationRequested',
            label: 'Plan Modification Requested',
            color: 'warning',
        },
        {
            id: 'treatmentStarted',
            key: 'treatmentStarted',
            value: 'treatmentStarted',
            label: 'Delivery and Treatment Started',
            color: 'primary',
        },
        {
            id: 'treatmentComplete',
            key: 'treatmentComplete',
            value: 'treatmentComplete',
            label: 'Treatment Complete',
            color: 'dark',
        },
    ];
    const [currentStatus, setCurrentStatus] = useState(statusList.find((s) => s.value === status));
    const [editMode, setEditMode] = useState(false);
    const [newStatus, setNewStatus] = useState(status); // To handle status change
    const dispatch = useDispatch();

    const handleStatusChange = (newStatus) => {
        setNewStatus(() => newStatus);
    };

    const confirmStatusChange = () => {
        if (newStatus !== currentStatus.value) {
            // Simulate PUT API call here
            // dispatch(updatePatientStatus(id, newStatus));
            setCurrentStatus(() => statusList.find((s) => s.value === newStatus)); // Update local state only after successful API call simulation
        }
        setEditMode(() => false);
    };

    const cancelEdit = () => {
        setNewStatus(() => currentStatus.value); // Reset new status to current status
        setEditMode(() => false);
    };

    return (
        <div className='home-status'>
            <div className='status-line'>
                {' '}
                <Badge pill bg={currentStatus?.color || 'secondary'}>
                    {currentStatus.label}
                </Badge>
                {!editMode ? (
                    <Button
                        onClickCallBk={() => setEditMode(true)}
                        tooltip='Change Status'
                        svg={<SVG src={require('../../../assets/icons/edit-2.svg').default} />}
                        ariaLabel='Change Status'
                    />
                ) : (
                    <Button
                        onClickCallBk={cancelEdit}
                        tooltip='Cancel'
                        svg={<SVG src={require('../../../assets/icons/cross.svg').default} />}
                        ariaLabel='Cancel'
                    />
                )}
            </div>

            {editMode && (
                <div className='edit-mode'>
                    <Dropdown
                        id='status-list'
                        options={statusList}
                        selectedValue={newStatus}
                        onChangeCallBk={handleStatusChange}
                        propsClassName='dropdown'
                    />
                    <Button
                        onClickCallBk={confirmStatusChange}
                        tooltip='Confirm Status'
                        svg={<SVG src={require('../../../assets/icons/send.svg').default} />}
                        ariaLabel='Confirm Status'
                    />
                </div>
            )}
        </div>
    );
};

export default Status;
