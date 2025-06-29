import React, { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import { toast } from 'react-toastify';

import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import DeleteConfirmationModal from '../../components/Modal/DeleteConfirmationModal';
import { noDataInfo } from '../../utils/globalConstants';
import { getCall, deleteCall } from '../../utils/commonfunctions/apicallactions';
import { visitTypes, defaultVisitTypes } from './TreatmentProgressConstants';

import './TreatmentProgressForm.scss';
import Loader from '../common/Loader/Loader';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';

const headers = [
  {
    key: 'date',
    id: 'date',
    label: 'Date',
    sortable: false,
    hidden: false,
    order: 'asc',
  },
  {
    key: 'visitType',
    id: 'visitType',
    label: 'Treatment Progress',
    sortable: false,
    hidden: false,
  },
];

function TreatmentProgress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientID } = useParams();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});

  const getData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getCall('GET_TABLE_OF_PROGRESS', [patientID]);
      if (res.result === 'success' && Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
        setIsError(true);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setData([]);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setDataToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async (item) => {
    try {
      const res = await deleteCall('DELETE_PROGRESS', [patientID, item.id]);
      if (res.result === 'success') {
        toast.success('Progress entry deleted successfully.', {
          position: 'top-right',
          hideProgressBar: false,
          autoClose: 2000,
          closeOnClick: true,
          theme: 'light',
        });
        // Refresh the data after successful deletion
        await getData();
      } else {
        toast.error('Failed to delete progress entry. Please try again.', {
          position: 'top-right',
          hideProgressBar: false,
          autoClose: 2000,
          closeOnClick: true,
          theme: 'light',
        });
      }
    } catch (error) {
      toast.error('An error occurred while deleting the progress entry.', {
        position: 'top-right',
        hideProgressBar: false,
        autoClose: 2000,
        closeOnClick: true,
        theme: 'light',
      });
    }
  };

  useEffect(() => {
    if (patientID) {
      getData();
    }
  }, [patientID]);

  const renderTbData = (key, item) => {
    return <span>{item[key]}</span>;
  };

  // Updated to add query params with id=item.id and include delete icon
  const getActionItems = (key, item) => {
    const deleteIcon = (
      <span
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteClick(item);
        }}
        className="delete-action"
        title="Delete progress entry"
        // style={{ marginLeft: '10px' }}
      >
        <SVG src={require(`../../assets/icons/deleteBin.svg`).default} />
      </span>
    );

    if (item.clickable) {
      return (
        <span className="visit-action-container">
          <span
            onClick={() => navigate(`${location.pathname}/visit?id=${item.id}`)}
            className="visit-action"
          >
            {(item[key] &&
              visitTypes.find((el) => el.id === item[key])?.['label']) ||
              'Click for visit update'}
          </span>
          {deleteIcon}
        </span>
      );
    } else {
      return (
        <span className="visit-action-container">
          <span>
            {defaultVisitTypes.find((el) => el.id === item[key])?.['label'] ||
              item[key]}
          </span>
          {deleteIcon}
        </span>
      );
    }
  };

  const tableData = (data) => {
    return data.map((item, j) => {
      const row = headers.map((header, i) => {
        const { key } = header;
        switch (key) {
          case 'date':
            return {
              label: '',
              id: `${key}-${j}-${i}`,
              children: (
                <span>
                  {(item.date &&
                    CommonUtils.formatDate(
                      new Date(item.date),
                      true,
                      'short'
                    )) ||
                    (item.createdOn &&
                      CommonUtils.formatDate(
                        new Date(item.date),
                        true,
                        'short'
                      )) ||
                    'No date given'}
                </span>
              ),
            };
          case 'visitType':
            return {
              label: '',
              id: `${key}-${j}-${i}`,
              children: getActionItems(key, item),
            };
          default:
            return {
              label: '',
              id: `${key}-${j}-${i}`,
              children: renderTbData(key, item),
            };
        }
      });
      return row;
    });
  };

  const renderTable = () => {
    const rows = tableData(data);
    const errorMsg = isError
      ? 'Failed to fetch data.'
      : rows.length === 0
      ? noDataInfo
      : '';

    return (
      <Table
        headers={headers}
        rows={rows}
        errorMsg={errorMsg}
        className="my-custom-table-wrapper"
        tableClass="my-custom-table"
      />
    );
  };

  if (isLoading) {
    return (
      <div className="patientAddEditTopContainer">
        <Loader />
      </div>
    );
  }

  return (
    <div className="patientAddEditTopContainer">
      <div className="patient-details-tabs-container">
        <div className="patientAddEditContainer">{renderTable()}</div>
        <Button
          postionClass={'home-page-button-pos rightPosEdit'}
          className={'home-page-add-button'}
          svg={<SVG src={require(`../../assets/icons/plus.svg`).default} />}
          onClickCallBk={() => navigate(`${location.pathname}/add`)}
          tooltip={'Log Visit'}
        />
      </div>
      
      {deleteModalOpen && (
        <DeleteConfirmationModal
          modalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          refetchDataFn={getData}
          deleteUserHandlerFn={handleDelete}
          dataToDelete={dataToDelete}
          setDataToDelete={setDataToDelete}
          type="progress entry"
          setLoading={setIsLoading}
        />
      )}
    </div>
  );
}

export default memo(TreatmentProgress);