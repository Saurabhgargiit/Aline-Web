import SVG from "react-inlinesvg";
import './Header.scss';
import SearchBar from "../../components/Search";


const Header = ({ title }) => {
    return (
        <div className="app-header">
            <div className="app-header-menu-button-container">
                <button className="app-header-button">
                    <SVG className="" src={require('../../assets/icons/menuList.svg').default} />
                </button>
            </div>
            <div className="app-header-img-container">
                <img src="/aline-images/logo.png"></img>
            </div>
            <div className="app-header-title font18 font600">{title}</div>
            <div className="app-header-filter-container">
                <SearchBar />
                <button className="app-header-button">
                    <SVG src={require('../../assets/icons/search.svg').default} />
                </button>
                <button className="app-header-button">
                    <SVG src={require('../../assets/icons/checksquare.svg').default} />
                </button>
                <button className="app-header-button">
                    <SVG src={require('../../assets/icons/reload.svg').default} />
                </button>
            </div>
        </div>)
}

export default Header;
