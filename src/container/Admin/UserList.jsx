import React, { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader/Loader';
import Table from '../../components/Table/Table';
import { getallusersaction } from '../../store/actions/useraction/getallusersaction';
import { noDataInfo, somethingWentWrong } from '../../utils/globalConstants';
import withRouter from '../../hoc/withRouter';
import { InformativeErrorModal } from '../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';

const data = [
    {
        name: 'Saurabh Garg',
        email: 'saurabh123@gmail.com',
        role: 'Admin',
    },
    {
        name: 'Saurabh Garg',
        email: 'saurabh123@gmail.com',
        role: 'Admin',
    },
];

const UserList = () => {
    const [loading, setLoading] = useState(true);
    const [userBasicInfo, setUserBasicInfo] = useState([]);
    const [userDetailInfo, setUserDetailInfo] = useState([]);

    const [isError, setIsError] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const fetchedAllUsers = useSelector((state) => state.getAllUsers.allUsers);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getAllUsers = () => {
        dispatch(getallusersaction('GET_ALL_USERS'));
    };

    //Function to separate details and basic info
    const separateDetails = (data) => {
        const userBasicInfoFromResponse = [];
        const userDetailInfoFromResponse = [];
        Object.values(data).forEach((el, i) => {
            userBasicInfoFromResponse.push(el.userDto);
            userDetailInfoFromResponse.push(el.userDetailsDto);
        });
        return { userBasicInfoFromResponse, userDetailInfoFromResponse };
    };

    //Table headers
    const headers = [
        { key: 'name', id: 'name', label: 'Name', sortable: true, hidden: false, order: 'asc' },
        { key: 'email', id: 'email', label: 'Email ID', sortable: false, hidden: false },
        { key: 'role', id: 'role', label: 'Role', sortable: false, hidden: false },
    ];
    const renderTbData = (key, item) => {
        return <span>{item[key]}</span>;
    };

    const tableData = (data) => {
        const rows = data.map((item, j) => {
            const row = [];
            headers.forEach((header, i) => {
                const { key } = header;
                row.push({
                    label: '',
                    id: `${key}-${j}-${i}`,
                    children: renderTbData(key, item),
                    // align: getTdClass(key),
                });
            });
            return row;
        });
        return rows;
    };

    //First time call
    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (fetchedAllUsers.result === 'success' && fetchedAllUsers.data !== undefined) {
            const userList = fetchedAllUsers.data;
            console.log(fetchedAllUsers);
            const { userBasicInfoFromResponse, userDetailInfoFromResponse } =
                separateDetails(userList);
            setUserBasicInfo(() => userBasicInfoFromResponse);
            setUserDetailInfo(() => userDetailInfoFromResponse);
            setLoading(false);
        } else if (fetchedAllUsers.result === 'error') {
            setErrMsg(somethingWentWrong);
            setLoading(false);
            setIsError(true);
        }
    }, [fetchedAllUsers]);

    //         <div className='mt-2'>
    //             <div className='home-page-count'>15 out of 24</div>
    //             <div className='home-page-icons'>
    //                 <SVG src={require('../../assets/icons/deleteBin.svg').default} />
    //                 <SVG src={require('../../assets/icons/edit.svg').default} />
    //                 <SVG src={require('../../assets/icons/file.svg').default} />
    //                 <SVG
    //                     className='home-page-play'
    //                     src={require('../../assets/icons/play.svg').default}
    //                 />
    //             </div>
    //         </div>

    const renderTable = () => {
        const rows = tableData(userBasicInfo);
        console.log(rows);
        return (
            <Table headers={headers} rows={rows} errorMsg={rows.length === 0 ? noDataInfo : ''} />
        );
    };

    const closeHandler = () => {
        setLoading(true);
        setIsError(false);
        setErrMsg('');
        navigate('/home');
    };

    return !loading ? (
        !isError ? (
            <div className='display-flex user-row-container'>{renderTable()}</div>
        ) : (
            <InformativeErrorModal
                open={isError}
                btnFunction={closeHandler}
                className='add-parent-box'
                errorMsg={errMsg}
            />
        )
    ) : (
        <Loader />
    );
};

export default UserList;
