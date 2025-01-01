import React, { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SVG from 'react-inlinesvg';

import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import { noDataInfo } from '../../utils/globalConstants';
import { getCall } from '../../utils/commonfunctions/apicallactions';
import { visitTypes, defaultVisitTypes } from './TreatmentProgressConstants';

import './TreatmentProgressForm.scss';
import Loader from '../common/Loader/Loader';
import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';

const headers = [
  {
    key: 'date',
    id: 'date',
    label: 'Date',
    sortable: true,
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

  useEffect(() => {
    if (patientID) {
      getData();
    }
  }, [patientID]);

  const renderTbData = (key, item) => {
    return <span>{item[key]}</span>;
  };

  // Updated to add query params with id=item.id
  const getActionItems = (key, item) => {
    if (item.clickable) {
      return (
        <span
          onClick={() => navigate(`${location.pathname}/visit?id=${item.id}`)}
          className="visit-action"
        >
          {(item[key] &&
            visitTypes.find((el) => el.id === item[key])?.['label']) ||
            'Click for visit update'}
        </span>
      );
    } else {
      return (
        <span>
          {defaultVisitTypes.find((el) => el.id === item[key])?.['label'] ||
            item[key]}
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

    return <Table headers={headers} rows={rows} errorMsg={errorMsg} />;
  };

  if (isLoading) {
    return (
      <div className="patientAddEditTopContainer">
        {/* <div className="patientAddEditContainer"> */}
        <Loader />
        {/* </div> */}
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
    </div>
  );
}

export default memo(TreatmentProgress);
