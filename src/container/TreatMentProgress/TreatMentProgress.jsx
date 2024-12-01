import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import SVG from 'react-inlinesvg';

import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import { noDataInfo } from '../../utils/globalConstants';

import './TreatmentProgressForm.scss';

const data = [
  {
    id: '66dd736f7e77720bd42ca93d',
    date: '2024-11-21T00:00:00.000+00:00',
    progress: 'visit-1',
    clickable: true,
    slug: '66c089bd5358026ae00f03e9',
  },
  {
    id: '66c0ad05f5fe3a1015d32d41',
    date: '2024-08-17T14:00:37.105+00:00',
    progress: 'visit-2',
    clickable: true,
    slug: '66c089bd5358026ae00f03e9',
  },
];

function TreatmentProgress() {
  const navigate = useNavigate();
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
      key: 'progress',
      id: 'progress',
      label: 'Treatment Progress',
      sortable: false,
      hidden: false,
    },
  ];
  const renderTbData = (key, item) => {
    return <span>{item[key]}</span>;
  };

  const getActionItems = (key, item) => {
    return (
      <span
        onClick={() => navigate(window.location.pathname + '/visit')}
        className="visit-action"
      >
        {item[key]}
      </span>
    );
  };

  const tableData = (data) => {
    const rows = data.map((item, j) => {
      const row = [];
      headers.forEach((header, i) => {
        const { key } = header;
        switch (key) {
          case 'date': {
            row.push({
              label: '',
              id: `${key}-${j}-${i}`,
              children: (
                <span>
                  {item.date && new Date(item.date).toLocaleDateString()}
                </span>
              ),
            });
            break;
          }
          case 'progress': {
            row.push({
              label: '',
              id: `${key}-${j}-${i}`,
              children: getActionItems(key, item),
            });
            break;
          }
          default: {
            break;
          }
        }
      });
      return row;
    });
    return rows;
  };

  const renderTable = () => {
    const rows = tableData(data);
    return (
      <Table
        headers={headers}
        rows={rows}
        errorMsg={rows.length === 0 ? noDataInfo : ''}
      />
    );
  };

  return (
    <div className="patientAddEditTopContainer">
      <div className="patientAddEditContainer">{renderTable()}</div>
      <Button
        postionClass={'home-page-button-pos rightPosEdit'}
        className={'home-page-add-button'}
        svg={<SVG src={require(`../../assets/icons/plus.svg`).default} />}
        onClickCallBk={() => {}}
        tooltip={'Log Visit'}
      />
    </div>
  );
}

export default memo(TreatmentProgress);
