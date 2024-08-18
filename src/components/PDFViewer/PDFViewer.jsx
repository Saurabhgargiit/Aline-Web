import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './PDFViewer.scss'

const PDFViewer = ({ pdfFile, styleClassName }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const className = 'pdfViewer ' + styleClassName; 
  return (
    <div className={className}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js`}>
        <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]}/>
      </Worker>
    </div>
  );
};

export default PDFViewer;
