import React from 'react';

const Loader = (props) => {
    return (
        <div className={props.className ? props.className : ''}>
            <img
                className='img-fluid'
                src={require('../../../assets/images/Loader/loading.gif')}
                width={props.width ? props.width : 150}
                height={props.height ? props.height : 150}
                style={{ margin: props.margin === 'none' ? '0' : 'auto' }}
            />
        </div>
    );
};

export default Loader;
