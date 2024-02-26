import PatientList from './PatientList';
import Button from '../../components/Button/Button';
import SVG from 'react-inlinesvg';
import './HomeLayout.scss';

const HomeLayout = ({}) => {
    return (
        <>
            <PatientList />
            <Button
                postionClass={'home-page-button-pos'}
                className={'home-page-add-button'}
                svg={<SVG src={require('../../assets/icons/plus.svg').default} />}
            />
        </>
    );
};

export default HomeLayout;
