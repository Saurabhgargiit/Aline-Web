# Image Uploader Components

## Overview

The `ImageUploader` component is a unified solution for handling both single and multiple image uploads within the Aline-Web application. It supports various file types, particularly images and scan files, with features for uploading, viewing, and downloading files.

## Components

### ImageUploader

The core component that handles all image upload functionality. It can be used in both single and multiple file modes.

```jsx
import ImageUploader from '../components/FileUploader/ImageUploader';

// Single image example
<ImageUploader
  label="Profile Photo"
  labelkey="profilePhoto"
  fileTypeRestrictions="image/jpeg,image/png,image/jpg"
  patientID={patientID}
  rebootID={rebootID}
  multiple={false}
  existingFile={patientData.profilePhoto[0]} 
  onFileUpload={handleFileUpload}
  isEdit={isEdit}
  imgClickHandler={openLightbox}
/>

// Multiple images example
<ImageUploader
  label="Photos"
  labelkey="photos"
  fileTypeRestrictions="image/jpeg,image/png,image/jpg"
  patientID={patientID}
  folder="progress"
  multiple={true}
  existingFiles={formValues.photos}
  onFilesUpload={handleFilesUpload}
  isEdit={isEdit}
  imgClickHandler={openLightbox}
/>
```

### SingleImageUploader

A wrapper around `ImageUploader` that simplifies usage for single image uploading scenarios. It maintains the same API as the original component.

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

### MultipleImagesUploader

A wrapper around `ImageUploader` that simplifies usage for multiple image uploading scenarios. It maintains the same API as the original component.

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
| fileTypeRestrictions | string | - | File type restrictions (MIME types) |
| patientID | string | - | Patient ID for file path |
| rebootID | string | - | Reboot ID for file path (used with single files) |
| folder | string | '' | Subfolder for file path (used with multiple files) |
| multiple | boolean | false | Whether to allow multiple file uploads |
| existingFile | object | - | File already uploaded (single mode) |
| existingFiles | array | - | Files already uploaded (multiple mode) |
| onFileUpload | function | - | Callback when a file is uploaded (single mode) |
| onFilesUpload | function | - | Callback when files are uploaded (multiple mode) |
| isEdit | boolean | false | Whether in edit mode |
| imgClickHandler | function | - | Callback for image clicks (for lightbox) |

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

The new `ImageUploader` component enables a unified approach but maintains backward compatibility through the wrapper components. No changes are needed in existing code using `SingleImageUploader` or `MultipleImagesUploader`.

In a future phase, the `FileUploader` component will be merged with this unified approach to provide a complete file upload solution for all types of files. 