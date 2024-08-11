import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CommonUtils } from '../../utils/commonfunctions/commonfunctions';
import { ReactComponent as UpIcon } from '../../assets/icons/up-icon.svg';
import { ReactComponent as DownIcon } from '../../assets/icons/down.svg';

import './SideNavigator.scss';

const SideNavigator = ({ sideSectionShowHandler }) => {
  const { removeWhitespace } = CommonUtils;

  const email = localStorage.getItem('user_email');
  const { patientID } = useParams();
  const pathname = window.location.pathname;
  const pathNamePrefix = '/patientDetails/' + patientID;

  // State to manage the visibility of subplans
  const [isTreatmentPlanExpanded, setTreatmentPlanExpanded] = useState(false);
  const [activeSubplan, setActiveSubplan] = useState(0);

  // Navigation data structure
  const navItems = [
    { name: 'Rx Form', path: '/details' },
    { name: 'Photos and Scans', path: '/photosScans' },
    {
      name: 'Treatment Plan',
      path: '/treatmentPlan',
      plans: [
        { name: 'Plan A', index: 0 },
        { name: 'Plan B', index: 1 },
      ],
    },
    { name: 'Treatment Progress Update', path: '/progress' },
    { name: 'Reboot Requested', path: '/rebootRequested' },
    { name: 'Reboot Plan Details', path: '/rebootPlan' },
  ];

  return (
    <div className="displayFlex">
      <aside className="side-navigator-layout">
        <div className="side-navigator-container">
          <div className="side-navigator-links">
            <nav>
              <ul>
                {navItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <li>
                      <Link
                        to={
                          item.name === 'Treatment Plan'
                            ? pathNamePrefix +
                              item.path +
                              '/' +
                              removeWhitespace(item.plans[0].name)
                            : pathNamePrefix + item.path
                        }
                        className={
                          'plan-link ' +
                          (pathname.includes(item.path) ? 'active' : '')
                        }
                        onClick={() => {
                          if (item.name === 'Treatment Plan') {
                            setTreatmentPlanExpanded(!isTreatmentPlanExpanded);
                          }
                        }}
                      >
                        {item.name}{' '}
                        {item.name === 'Treatment Plan' && (
                          <span>
                            {isTreatmentPlanExpanded ? (
                              <UpIcon />
                            ) : (
                              <DownIcon />
                            )}
                          </span>
                        )}
                      </Link>
                    </li>
                    {item.name === 'Treatment Plan' &&
                      isTreatmentPlanExpanded &&
                      item.plans.map((plan, planIndex) => (
                        <li key={planIndex} className="subplan">
                          <div className="leftBox"></div>
                          <Link
                            to={`${pathNamePrefix}${
                              item.path
                            }/${removeWhitespace(plan.name)}`}
                            className={
                              'subplan-link ' +
                              (pathname.includes(
                                `${item.path}/${removeWhitespace(plan.name)}`
                              )
                                ? 'active'
                                : '')
                            }
                          >
                            {plan.name}
                          </Link>
                        </li>
                      ))}
                  </React.Fragment>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideNavigator;
