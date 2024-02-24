import SVG from 'react-inlinesvg';
import './Header.scss';
import SearchBar from '../../components/Search';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = ({ title, leftBtnHanlder }) => {
    const [headerDetails, setHeaderDetails] = useState({
        leftButton: null,
        title: null,
        leftBtnHanlder: () => {},
    });
    const location = useLocation();

    const headerDetailsFn = () => {
        if (location.pathname === '/home' || location.pathname === '/admin') {
            setHeaderDetails((prevState) => {
                return {
                    ...prevState,
                    leftButton: (
                        <SVG
                            className=''
                            src={require('../../assets/icons/menuList.svg').default}
                        />
                    ),
                    title: location.pathname === '/home' ? 'Patient Details' : 'Admin',
                };
            });
            return;
        }
    };

    useEffect(() => {
        headerDetailsFn();
    }, [location.pathname]);

    return (
        <div className='app-header'>
            <div className='app-header-menu-button-container'>
                <button className='app-header-button' onClick={leftBtnHanlder}>
                    {headerDetails.leftButton}
                </button>
            </div>
            <div className='app-header-img-container'>
                <img src='/aline-images/logo.png'></img>
            </div>
            <div className='app-header-title font18 font600'>{headerDetails.title}</div>
            <div className='app-header-filter-container'>
                <SearchBar />
                <button className='app-header-button'>
                    <SVG src={require('../../assets/icons/search.svg').default} />
                </button>
                <button className='app-header-button'>
                    <SVG src={require('../../assets/icons/checksquare.svg').default} />
                </button>
                <button className='app-header-button'>
                    <SVG src={require('../../assets/icons/reload.svg').default} />
                </button>
            </div>
        </div>
    );
};

export default Header;
