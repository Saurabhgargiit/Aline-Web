import React, { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader/Loader';
import Table from '../../components/Table/Table';
import { getallusersaction } from '../../store/actions/useraction/getallusersaction';

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
    {
        name: 'Saurabh Garg',
        email: 'saurabh123@gmail.com',
        role: 'Admin',
    },
];
const headers = [
    { key: 'name', id: 'name', label: 'Name', sortable: true, hidden: false, order: 'asc' },
    { key: 'email', id: 'email', label: 'Email ID', sortable: false, hidden: false },
    { key: 'role', id: 'role', label: 'Role', sortable: false, hidden: false },
];

const renderTbData = (key, item) => {
    return <span>{item[key]}</span>;
};

const TableData = data.map((item, j) => {
    const rows = [];
    headers.forEach((header, i) => {
        const { key } = header;
        rows.push({
            label: '',
            id: `${key}-${j}-${i}`,
            children: renderTbData(key, item),
            // align: getTdClass(key),
        });
    });
    return rows;
});

const UserList = () => {
    const [loading, setLoading] = useState(false);

    const fetchedAllUsers = useSelector((state) => state.getAllUsers);
    const dispatch = useDispatch();
    const getAllUsers = () => {
        dispatch(getallusersaction('GET_ALL_USERS'));
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        console.log(fetchedAllUsers);
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

    return !loading ? (
        <div className='display-flex user-row-container row-border'>
            <Table headers={headers} rows={TableData} />
        </div>
    ) : (
        <Loader />
    );
};

export default UserList;
