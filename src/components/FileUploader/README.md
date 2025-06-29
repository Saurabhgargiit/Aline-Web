# Unified File Uploader Components

## Overview

The `UnifiedFileUploader` component is a comprehensive solution for handling file uploads within the Aline-Web application. It supports various file types including images, PDFs, videos, and scans, with features for uploading, viewing, and downloading files in both single and multiple file modes.

## Components

### UnifiedFileUploader

The core component that handles all file upload functionality across different file types.

```jsx
import UnifiedFileUploader from '../components/FileUploader/UnifiedFileUploader';

// Single image example
<UnifiedFileUploader
  label="Profile Photo"
  labelkey="profilePhoto"
  fileType="image"
  patientID={patientID}
  rebootID={rebootID}
  multiple={false}
  existingFile={patientData.profilePhoto[0]} 
  onFileUpload={handleFileUpload}
  isEdit={isEdit}
  imgClickHandler={openLightbox}
/>

// Multiple images example
<UnifiedFileUploader
  label="Photos"
  labelkey="photos"
  fileType="image"
  patientID={patientID}
  folder="progress"
  multiple={true}
  existingFiles={formValues.photos}
  onFilesUpload={handleFilesUpload}
  isEdit={isEdit}
  imgClickHandler={openLightbox}
/>

// PDF upload example
<UnifiedFileUploader
  label="Medical Report"
  labelkey="medicalReport"
  fileType="pdf"
  patientID={patientID}
  rebootID={rebootID}
  multiple={false}
  existingFile={patientData.medicalReport} 
  onFileUpload={handleFileUpload}
  isEdit={isEdit}
/>

// Scans (multiple formats) example
<UnifiedFileUploader
  label="Medical Scans"
  labelkey="scans"
  fileType="scans"
  patientID={patientID}
  rebootID={rebootID}
  multiple={true}
  existingFiles={patientData.scans} 
  onFilesUpload={handleFilesUpload}
  isEdit={isEdit}
/>
```

### Legacy Wrapper Components

For backward compatibility, the following wrapper components are maintained:

#### FileUploader

Now serves as a wrapper for `UnifiedFileUploader` for non-image file types like PDFs and videos.

```jsx
import FileUploader from '../components/FileUploader/FileUploader';

<FileUploader
  label="Medical Report"
  labelkey="medicalReport"
  fileType="pdf"
  patientID={patientID}
  rebootID={rebootID}
  onFileUpload={handleFileUpload}
  isEdit={isEdit}
/>
```

#### SingleImageUploader

A wrapper around `UnifiedFileUploader` for single image uploads.

```jsx
import SingleImageUploader from '../components/FileUploader/SingleImageUploader';

<SingleImageUploader
  label="Profile Photo"
  labelkey="profilePhoto"
  fileTypeRestrictions="image/jpeg,image/png,image/jpg"
  patientID={patientID}
  rebootID={rebootID}
  existingFile={patientData.profilePhoto[0]}
  onFileUpload={handleFileUpload}
  isEdit={isEdit}
  imgClickHandler={openLightbox}
/>
```

#### MultipleImagesUploader

A wrapper around `UnifiedFileUploader` for multiple image uploads.

```jsx
import MultipleImagesUploader from '../components/FileUploader/MultipleImagesUploader';

<MultipleImagesUploader
  label="Photos"
  labelkey="photos"
  fileTypeRestrictions="image/jpeg,image/png,image/jpg"
  patientID={patientID}
  folder="progress"
  existingFiles={formValues.photos}
  onFilesUpload={handleFilesUpload}
  isEdit={isEdit}
  imgClickHandler={openLightbox}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Display label for the uploader |
| labelkey | string | - | Key used for the uploaded files in state |
| fileType | string | 'image' | Type of file ('image', 'pdf', 'video', 'scans', etc.) |
| fileTypeRestrictions | string | - | Custom file type restrictions (MIME types) |
| patientID | string | - | Patient ID for file path |
| rebootID | string | - | Reboot ID for file path |
| folder | string | '' | Subfolder for file path |
| multiple | boolean | false | Whether to allow multiple file uploads |
| existingFile | object/string | - | File already uploaded (single mode) |
| existingFiles | array | - | Files already uploaded (multiple mode) |
| onFileUpload | function | - | Callback when a file is uploaded (single mode) |
| onFilesUpload | function | - | Callback when files are uploaded (multiple mode) |
| isEdit | boolean | false | Whether in edit mode |
| imgClickHandler | function | - | Callback for image clicks (for lightbox) |
| styleClassName | string | '' | Additional CSS classes |

## File Type Support

The component has built-in support for various file types:

| File Type | Description | Default Extensions |
|-----------|-------------|-------------------|
| image | Images | jpg, jpeg, png, gif |
| pdf | PDF documents | pdf |
| video | Video files | mp4, webm, mov, avi |
| scans | Medical scans | pdf, jpg, png, zip, 7z, dicom |
| zip | Archive files | zip, 7z |

## Data Structure

The components handle the following data structures:

### Single File Mode

- **Input**: A file object `{ url: string, key: string }` or just a string URL
- **Output**: When uploading a file, sends `{ [labelkey]: [{ url: string, key: string }] }`
- **When clearing**: Sends `{ [labelkey]: [{ url: '', key: '' }] }`

### Multiple Files Mode

- **Input**: An array of file objects `[{ url: string, key: string }, ...]` or an array of URLs `['url1', 'url2', ...]`
- **Output**: When uploading files, sends `{ [labelkey]: [{ url: string, key: string }, ...] }`

## Migration Notes

The new `UnifiedFileUploader` component provides a unified approach for all file types while maintaining backward compatibility through wrapper components. No changes are needed in existing code using `FileUploader`, `SingleImageUploader`, or `MultipleImagesUploader`.

### Key Improvements

1. **Unified Code Base**: One component handles all file types and modes
2. **Enhanced Scans Support**: Now supports multiple file formats for scans (PDF, images, archives)
3. **Consistent UI/UX**: All uploaders share the same UI patterns
4. **Type Detection**: Smart detection of file types from extensions
5. **Better Preview Support**: Appropriate previews for different file types

### Migration Path

1. Current phase: Use legacy wrappers for backward compatibility
2. Recommended for new code: Use `UnifiedFileUploader` directly
3. Future: Legacy wrappers may be deprecated

In a future phase, the wrapper components may be fully deprecated in favor of using `UnifiedFileUploader` directly. 