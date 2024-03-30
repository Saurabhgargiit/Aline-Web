import React, { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader/Loader';
import Table from '../../components/Table/Table';
import { getallusersaction } from '../../store/actions/useraction/getallusersaction';
import { noDataInfo } from '../../utils/globalConstants';

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

    const fetchedAllUsers = useSelector((state) => state.getAllUsers.allUsers);
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
            // setUserList(() => userList);
            setUserBasicInfo(() => userBasicInfoFromResponse);
            setUserDetailInfo(() => userDetailInfoFromResponse);
            setLoading(false);
        }
    }, [fetchedAllUsers]);
    // const clinicList = obj.map((el, i) => (
    //     <div className='displayFlex home-row-container row-border' key={i}>
    //         <div className='home-page-name-date mt-2'>
    //             <div className='home-page-name font700'>Saurabh Garg</div>
    //             <div className='home-page-date font14'>21-Aug-2023</div>
    //         </div>
    //         <div className='home-status mt-2'>
    //             <Badge pill bg='primary'>
    //                 Primary
    //             </Badge>
    //         </div>
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
    //     </div>
    // ));
    const renderTable = () => {
        const rows = tableData([]);
        console.log(rows);
        return (
            <Table headers={headers} rows={rows} errorMsg={rows.length === 0 ? noDataInfo : ''} />
        );
    };

    return !loading ? (
        <div className='display-flex user-row-container'>{renderTable()}</div>
    ) : (
        <Loader />
    );
};

export default UserList;
