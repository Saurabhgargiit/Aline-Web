import PatientList from "./PatientList";
import Header from '../common/Header';
import Footer from "../common/Footer";
import CustomButton from "../../components/CustomButton";
import SVG from "react-inlinesvg";
import "./HomeLayout.scss";

const HomeLayout = () => {

    return (<>
        <Header title={'Patients'} />
        <PatientList />
        <CustomButton
            postionClass={"home-page-button-pos"}
            className={"home-page-add-button"}
            svg={<SVG src={require('../../assets/icons/plus.svg').default} />}
        />
        <Footer />
    </>)

}

export default HomeLayout;