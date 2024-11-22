import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import RenderForm from "./renderForm";

const RenderModalForm = ({
  isOpenModal,
  handleCloseModal,
  modalTitle,
  modalWidth = 600,
  ...props
}) => {

  return (
    <>
      <Modal
        title={modalTitle}
        open={isOpenModal}
        onCancel={handleCloseModal}
        maskClosable={false}
        footer={null}
        width={modalWidth}
        className={'style-render'}
      >
        <RenderForm
          {...props}
          onCancel={handleCloseModal}
          modalWidth={modalWidth}
        />
      </Modal>
    </>
  );
};


RenderModalForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    labelHidden: PropTypes.string,
    titleButtonAdd: PropTypes.node,
    titleButtonDelete: PropTypes.node,
    classItem: PropTypes.string,
    filedsList: PropTypes.array,
    lg: PropTypes.number,
    html: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    content: PropTypes.node,
    options: PropTypes.array,
    label: PropTypes.string,
    labelCheckbox: PropTypes.node,
    labelAfter: PropTypes.string,
    rules: PropTypes.array,
    type: PropTypes.oneOf([
      'input',
      'radio',
      'date',
      'select',
      'textarea',
      'number',
      'password',
      'upload',
      'checkbox',
      'group',
      'html',
      'ckeditor'
    ]),
    colClass: PropTypes.string,
    rowClass: PropTypes.string,
    className: PropTypes.string,
    rows: PropTypes.number,
    accept: PropTypes.oneOf([
      'image/jpeg',
      'image/gif',
      'image/png',
      'application/pdf',
      'image/x-eps',
      'image/*',
    ]),
  })).isRequired,
  // form: PropTypes.object.isRequired,
  rowGutter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  className: PropTypes.string,
  loadingSubmit: PropTypes.bool,
  isOpenModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func,
  modalTitle: PropTypes.string,
  modalWidth: PropTypes.number,
};
export default RenderModalForm;
