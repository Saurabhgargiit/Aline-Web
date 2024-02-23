import { useState } from 'react';
import PatientList from './PatientList';
import Header from '../common/Header';
import Footer from '../common/Footer';
import CustomButton from '../../components/CustomButton';
import SVG from 'react-inlinesvg';
import './HomeLayout.scss';
import SideSectionLayout from '../SideSection/SideSectionLayout';

const HomeLayout = () => {
    const [showSideSection, setShowSideSection] = useState(false);
    const sideSectionShowHandler = () => {
        setShowSideSection((prevState) => !prevState);
    };

    return (
        <>
            {showSideSection && <SideSectionLayout />}
            <Header title={'Patients'} leftBtnHanlder={sideSectionShowHandler} />
            <PatientList />
            <CustomButton
                postionClass={'home-page-button-pos'}
                className={'home-page-add-button'}
                svg={<SVG src={require('../../assets/icons/plus.svg').default} />}
            />
            <Footer />
        </>
    );
};

export default HomeLayout;
