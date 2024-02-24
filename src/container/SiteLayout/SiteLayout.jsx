import Routers from '../../routers/routers';
import SideSectionLayout from '../SideSection/SideSectionLayout';
import { useState, useCallback } from 'react';
import Footer from '../common/Footer';
import Header from '../common/Header';

const SiteLayout = () => {
    const [showSideSection, setShowSideSection] = useState(false);
    const sideSectionShowHandler = useCallback(() => {
        setShowSideSection((prevState) => !prevState);
    }, []);

    return (
        <>
            {
                <SideSectionLayout
                    open={showSideSection}
                    sideSectionShowHandler={sideSectionShowHandler}
                />
            }
            <Header leftBtnHanlder={sideSectionShowHandler} />
            <Routers />
            <Footer />
        </>
    );
};

export default SiteLayout;
