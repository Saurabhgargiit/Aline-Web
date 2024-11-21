import React from 'react';
import './ImgViewer.scss';

const ImgViewer = ({ src, alt, loading, onClick }) => {
  return (
    <div className={`img-viewer${loading ? ' loading' : ''}`} onClick={onClick}>
      {loading && <div className="img-viewer__loading">Uploading...</div>}
      <img className="img-viewer__image" src={src} alt={alt} />
    </div>
  );
};

export default ImgViewer;
