import PatientList from './PatientList';
import CustomButton from '../../components/CustomButton';
import SVG from 'react-inlinesvg';
import './HomeLayout.scss';

const HomeLayout = ({}) => {
    return (
        <>
            <PatientList />
            <CustomButton
                postionClass={'home-page-button-pos'}
                className={'home-page-add-button'}
                svg={<SVG src={require('../../assets/icons/plus.svg').default} />}
            />
        </>
    );
};

export default HomeLayout;
