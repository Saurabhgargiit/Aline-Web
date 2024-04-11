import React, { useContext } from 'react';
import AdvancedPagination from '../../components/Pagination/AdvancedPagination';
import { AddParentUserContext } from './AddParentUser/Context/AddParentUserContext';

function AdminPagination() {
    const { pagination, paginationHanlder } = useContext(AddParentUserContext);
    return (
        <AdvancedPagination
            topContainerClassName='topContainerClassName'
            totalRes={pagination.total}
            setPageInParent={paginationHanlder}
        />
    );
}

export default AdminPagination;
