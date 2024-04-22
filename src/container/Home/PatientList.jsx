import './PatientList.scss';
import { Badge } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import Status from './Status/Status';

const obj = [
    {
        name: 'Saurabh Garg',
        date: '21-Aug-2023',
        status: 'Active',
        count: '15 out of 24',
        img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg',
    },
    {
        name: 'Saurabh Garg',
        date: '21-Aug-2023',
        status: 'Active',
        count: '15 out of 24',
        img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg',
    },
    {
        name: 'Saurabh Garg',
        date: '21-Aug-2023',
        status: 'Active',
        count: '15 out of 24',
        img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg',
    },
    {
        name: 'Saurabh Garg',
        date: '21-Aug-2023',
        status: 'Active',
        count: '15 out of 24',
        img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg',
    },
    {
        name: 'Saurabh Garg',
        date: '21-Aug-2023',
        status: 'Active',
        count: '15 out of 24',
        img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg',
    },
    {
        name: 'Saurabh Garg',
        date: '21-Aug-2023',
        status: 'Active',
        count: '15 out of 24',
        img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg',
    },
    {
        name: 'Saurabh Garg',
        date: '21-Aug-2023',
        status: 'Active',
        count: '15 out of 24',
        img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg',
    },
    {
        name: 'Saurabh Garg',
        date: '21-Aug-2023',
        status: 'Active',
        count: '15 out of 24',
        img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg',
    },
    {
        name: 'Saurabh Garg',
        date: '21-Aug-2023',
        status: 'Active',
        count: '15 out of 24',
        img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg',
    },
];

const PatientList = () => {
    let genderList = [
        { key: 'select', id: 'select', value: '', label: '--Please choose an option--' },
        { key: 'male', id: 'male', value: 'male', label: 'Male' },
        { key: 'female', id: 'female', value: 'female', label: 'Female' },
        { key: 'others', id: 'others', value: 'others', label: 'Others' },
    ];
    const patientList = obj.map((el, i) => (
        <div className='displayFlex home-row-container row-border' key={i}>
            <div className='img-container'>
                <img src='https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'></img>
            </div>
            <div className='home-page-name-date mt-2'>
                <div className='home-page-name font700'>Saurabh Garg</div>
                <div className='home-page-date font14'>21-Aug-2023</div>
            </div>
            <Status />
            <div className='mt-2'>
                <div className='home-page-icons'>
                    <Button
                        onClickCallBk={() => {}}
                        tooltip='Delete Patient'
                        svg={<SVG src={require('../../assets/icons/deleteBin.svg').default} />}
                        ariaLabel='Delete Patient'
                    />
                    <Button
                        onClickCallBk={() => {}}
                        tooltip='Edit Patient Basic Info'
                        svg={<SVG src={require('../../assets/icons/edit.svg').default} />}
                        ariaLabel='Edit Patient Basic Info'
                    />{' '}
                    <Button
                        onClickCallBk={() => {}}
                        tooltip='Delete Patient'
                        svg={<SVG src={require('../../assets/icons/deleteBin.svg').default} />}
                        ariaLabel='Delete Patient'
                    />{' '}
                    <Button
                        onClickCallBk={() => {}}
                        tooltip='Delete Patient'
                        svg={<SVG src={require('../../assets/icons/deleteBin.svg').default} />}
                        ariaLabel='Delete Patient'
                    />
                    <SVG src={require('../../assets/icons/file.svg').default} />
                    {/* <SVG
                        className='home-page-play'
                        src={require('../../assets/icons/play.svg').default}
                    /> */}
                </div>
            </div>
        </div>
    ));

    return <div className='top-bottom-position-container top56'>{patientList}</div>;
};

export default PatientList;
