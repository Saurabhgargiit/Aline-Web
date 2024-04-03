import React, { useContext, useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import SVG from 'react-inlinesvg';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader/Loader';
import Table from '../../components/Table/Table';
import { getallusersaction } from '../../store/actions/useraction/getallusersaction';
import { noDataInfo, somethingWentWrong } from '../../utils/globalConstants';
import { MAXIMUM_RESULTS_ON_ONE_PAGE_IN_ADMIN } from '../../utils/globalConstants';
import { InformativeErrorModal } from '../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import AdvancedPagination from '../../components/Pagination/AdvancedPagination';
import { AddParentUserContext } from './AddParentUser/Context/AddParentUserContext';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import { ReactComponent as PlusIcon } from '../../assets/icons/admin-plus.svg'; // Using SVGR
import './UserList.scss';

const UserList = ({ role, userID }) => {
    const [loading, setLoading] = useState(true);
    const [userBasicInfo, setUserBasicInfo] = useState([]);

    const [userDetailInfo, setUserDetailInfo] = useState([]);

    const {
        userTypeFilter,
        pagination,
        paginationHanlder,
        userAdded,
        setUserAdded,
        addParentUserModalHandler,
    } = useContext(AddParentUserContext);

    const [isError, setIsError] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const fetchedAllUsers = useSelector((state) => state.getAllUsers.allUsers);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getAllUsers = () => {
        const role = CommonUtils.getPayloadRole(userTypeFilter);
        const query = {
            role: role,
            pageNumber: pagination.page - 1,
            pageSize: MAXIMUM_RESULTS_ON_ONE_PAGE_IN_ADMIN,
            sortBy: 'id',
            sortDir: 'des',
        };
        dispatch(getallusersaction('GET_ALL_USERS', [], query));
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
        { key: 'action', id: 'action', label: 'Action', sortable: false, hidden: false },
    ];
    const renderTbData = (key, item) => {
        return <span>{item[key]}</span>;
    };

    const mergeData = (basicInfo) => {
        const userDetails = userDetailInfo.find((el) => el.userID === basicInfo.id);
        if (userDetails !== undefined || userDetails !== null) {
            return { ...basicInfo, ...userDetails };
        }
        return basicInfo;
    };

    const addDoctorHandler = (clinicBasicInfo) => {
        const clinic = mergeData(clinicBasicInfo);
        addParentUserModalHandler('Doctor', clinic);
    };

    const getActionItems = (clinicBasicInfo) => {
        const isAddBtnDisabled = role === 'ROLE_DOCTOR';
        const isDeleteBtnDisabled = role !== 'ROLE_ADMIN';

        const isAddBtnVisible = userTypeFilter === 'clinic';

        const actonItems = (
            <div className='admin-page-icons'>
                {!isAddBtnDisabled && isAddBtnVisible && (
                    <button onClick={() => addDoctorHandler(clinicBasicInfo)}>
                        <PlusIcon className='admin-plus' />
                    </button>
                )}
                <button>
                    <SVG src={require('../../assets/icons/edit.svg').default} />
                </button>
                {!isDeleteBtnDisabled && (
                    <button>
                        <SVG src={require('../../assets/icons/deleteBin.svg').default} />
                    </button>
                )}
            </div>
        );
        return actonItems;
    };

    const tableData = (data) => {
        const rows = data.map((item, j) => {
            const row = [];
            headers.forEach((header, i) => {
                const { key } = header;
                if (key !== 'action') {
                    row.push({
                        label: '',
                        id: `${key}-${j}-${i}`,
                        children: renderTbData(key, item),
                        // align: getTdClass(key),
                    });
                } else {
                    row.push({
                        label: '',
                        id: `${key}-${j}-${i}`,
                        children: getActionItems(item),
                        // align: getTdClass(key),
                    });
                }
            });
            return row;
        });
        return rows;
    };

    //First time call
    useEffect(() => {
        getAllUsers();
        if (userAdded) {
            setUserAdded(false);
        }
    }, [userTypeFilter, pagination.page, userAdded]);

    useEffect(() => {
        if (userAdded) {
            getAllUsers();
            setUserAdded(false);
        }
    }, [userAdded]);

    useEffect(() => {
        if (fetchedAllUsers.result === 'success' && fetchedAllUsers.data !== undefined) {
            const userList = fetchedAllUsers.data?.content;
            const { userBasicInfoFromResponse, userDetailInfoFromResponse } =
                separateDetails(userList);
            setUserBasicInfo(() => userBasicInfoFromResponse);
            setUserDetailInfo(() => userDetailInfoFromResponse);
            setLoading(false);
            paginationHanlder('total', '_', fetchedAllUsers.data?.totalElements);
        } else if (fetchedAllUsers.result === 'error') {
            setErrMsg(somethingWentWrong);
            setLoading(false);
            setIsError(true);
        }
    }, [fetchedAllUsers]);

    const renderTable = () => {
        const rows = tableData(userBasicInfo);
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
            <div className='user-row-container'>{renderTable()}</div>
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
