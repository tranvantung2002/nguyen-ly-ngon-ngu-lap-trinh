import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  TimePicker,
  Upload
} from "antd";
import React from "react";
import { DeleteOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { ClearIcon, EyeIcon, EyeInvisibleIcon, IconArrowDown } from "../assets/image/svg";
import PropTypes from "prop-types";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const normFile = (e) => {
  return Array.isArray(e) ? e : e?.fileList;
};

const props = {
  upload: {
    valuePropName: 'fileList',
    getValueFromEvent: normFile,
  },
  checkbox: { valuePropName: 'checked' },
};

const GroupForm = ({ form, itemGroup, name, parentName, modalWidth, firstName }) => {

  const onDragEnd = (result) => {
    try {
      if (!result.destination) return;

      // Lấy giá trị hiện tại của form
      const currentValues = form.getFieldsValue();

      if (Array.isArray(name)) {

        const targetGroup = currentValues[parentName][name[0]];

        if (!targetGroup) return;

        // Reorder
        const reorderedItems = Array.from(targetGroup[name[1]]);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        // Cập nhật giá trị mới
        const updatedGroup = {
          ...targetGroup,
          [name[1]]: reorderedItems,
        };

        // Cập nhật form với giá trị mới
        form.setFieldsValue({
          [parentName]: {
            ...currentValues[parentName],
            [name[0]]: updatedGroup,
          },
        });
        return;
      }

      const targetGroup = currentValues[parentName];

      if (!targetGroup) return;

      // Reorder
      let reorderedItems = targetGroup;

      const [movedItem] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, movedItem);

    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="formList">
        {(provided) => (
          <Form.List name={name}>
            {(fields, { add, remove }) => {
              return (
                <div
                  className={`w-full flex flex-col gap-4 items-center`}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {fields.map((field, index) => (
                    <Draggable key={field.key} draggableId={`${field.key}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${itemGroup.classItem ?? 'flex items-center gap-1'} bg-white`}
                          style={{
                            maxWidth: modalWidth,
                            width: '100%',
                            ...provided.draggableProps.style
                          }}
                        >
                          <div className={itemGroup?.isSort === true ? "min-w-6" : ""} {...provided.dragHandleProps}>
                            {
                              itemGroup?.isSort === true && <MenuOutlined className={'p-1 h-6 cursor-pointer'} />
                            }
                          </div>
                          <Row className={`w-full flex-1 ${itemGroup?.rowClass ?? 'border border-gray-300'}`}>
                            {itemGroup?.filedsList.map((item, key) => {
                              if (item.html || item.type === 'html') {
                                return (
                                  <Col
                                    span={item.span || 24}
                                    md={item.md || item.span || 24}
                                    lg={item.lg || 24}
                                    key={key}
                                  >
                                    {item.content}
                                  </Col>
                                );
                              }
                              item.rules = item.rules?.map(v =>
                                !v.message && v.required ? {
                                  ...v,
                                  message: `${item.label || item.placeholder || item.labelHidden} không được bỏ trống`,
                                } : v,
                              ) || [];
                              return (typeof item.func === 'function' && !item.func(name, field.key)) ? '' : (
                                <Col
                                  className={item.colClass || 'p-2'}
                                  key={key}
                                  span={item.span || 24}
                                  md={item.md || item.span || 24}
                                  lg={item.lg || 24}
                                >
                                  {
                                    item.type === 'group' ?
                                      <GroupForm
                                        itemGroup={item}
                                        name={[field.name, item.name]}
                                        form={form}
                                        parentName={name}
                                        modalWidth={modalWidth}
                                        firstName={firstName}
                                      /> :
                                      (
                                        <Form.Item
                                          {...(props[item.type] || {})}
                                          name={[field.name, item.name]}
                                          rules={item.rules}
                                          label={item.label}
                                          className={item.className || ''}
                                          {...(item.propsFormItem || {})}
                                        >
                                          {SwitchInputType({ item: item })}
                                        </Form.Item>
                                      )
                                  }
                                </Col>
                              );
                            })}
                          </Row>
                          {
                            (!itemGroup.minItem || itemGroup.minItem < fields.length) &&
                            <div className={'min-w-6'}>
                              <Button
                                type="primary"
                                danger
                                className={'p-1 h-6'}
                                onClick={() => remove(field.name)}
                                disabled={fields.length === 0}
                              >
                                {itemGroup.titleButtonDelete || <DeleteOutlined />}
                              </Button>
                            </div>
                          }
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {((!itemGroup.maxItem || itemGroup.maxItem > fields.length) && itemGroup.showButton !== false) &&
                    <Button onClick={() => add()} className="mb-2 w-auto">
                      <PlusOutlined />
                      {itemGroup.titleButtonAdd || 'Thêm'}
                    </Button>
                  }
                </div>
              );
            }}
          </Form.List>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const SwitchInputType = ({ item }) => {
  return (
    <>
      {
        (item.type === 'input' || !item.type) &&
        <Input
          {...(item.propsInput || {})}
          placeholder={item.placeholder || 'Nhập ' + item.label?.toLowerCase()}
          allowClear={item.allowClear === undefined || item.allowClear ? {
            clearIcon: <ClearIcon />,
          } : false}
          onChange={item.onChange || (() => {
          })}
        />
      }
      {
        (item.type === 'time') &&
        <TimePicker
          {...(item.propsInput || {})}
          needConfirm={false}
          format={item.format || 'HH:mm'}
        />
      }
      {
        (item.type === 'radio') && (
          <Radio.Group size="large" className={item.className}>
            <Space direction={item?.typeRadioType ?? "vertical"} className="w-full">
              {item?.options &&
                item.options.map((child, index) => (
                  <div key={index} style={{ width: '100%' }}>
                    <Radio value={child?.value} className="w-full">
                      {child?.label || child?.value}
                    </Radio>
                    {child?.isMore && (
                      <Form.Item
                        name={`optionText-${child?.value}`}
                        style={{ marginLeft: 24 }}
                        noStyle
                      >
                        <Input className="w-full"
                          placeholder={child?.placeHolder}
                          onChange={item.onChange || (() => {
                          })}
                        />
                      </Form.Item>
                    )}
                  </div>
                ))}
            </Space>
          </Radio.Group>)
      }
      {
        (item.type === 'date') &&
        <DatePicker
          needConfirm={false}
          format={{
            format: item.format || 'DD/MM/YYYY',
            // type: 'mask',
          }}
          placeholder={'Nhập ' + item.label?.toLowerCase()}
          {...(item.propsInput || {})}
        />
      }
      {
        (item.type === 'select') &&
        <Select
          optionFilterProp={item.optionFilterProp ?? "label"}
          placeholder={item.placeholder || 'Chọn ' + item.label?.toLowerCase()}
          suffixIcon={<IconArrowDown />}
          {...(item.propsInput || {})}
          options={item.options}
          onChange={item.onChange || (() => {
          })}
          onSearch={item.onSearch || (() => {
          })}
        />
      }
      {
        (item.type === 'textarea') &&
        <Input.TextArea
          rows={item.rows || 4}
          // autoSize={{ minRows: 2, maxRows: 4 }}
          placeholder={'Nhập ' + item.label?.toLowerCase()}
          rootClassName="py-2 text-base"
        />
      }
      {
        (item.type === 'number') &&
        <InputNumber
          min={item.min || 1}
          placeholder={'Nhập ' + item.label?.toLowerCase()}
          {...(item.propsInput || {})}
          formatter={(value) =>
            value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
        />
      }
      {
        (item.type === 'range-picker') &&
        <DatePicker.RangePicker
          {...(item.propsInput || {})}
          placeholder={'Chọn ' + item.label?.toLowerCase()}
        />
      }
      {
        (item.type === 'password') &&
        <Input.Password
          placeholder={'Nhập ' + item.label?.toLowerCase()}
          iconRender={(visible) => visible ? <EyeIcon /> : <EyeInvisibleIcon />}
          visibilityToggle
          {...(item.propsInput || {})}
        />
      }
      {
        (item.type === 'checkbox') &&
        <Checkbox
          defaultChecked={item.defaultChecked}
          {...(item.propsInput || {})}
        >
          {item.labelCheckbox}
        </Checkbox>
      }
      {
        (item.type === 'upload') &&
        <Upload
          // customRequest={uploadFileCDN}
          maxCount={item.maxCount || 1}
          multiple={!!item.multiple}
          accept={item.accept || '*'}
          {...(item.propsInput || {})}
          listType="picture-card"
        >
          {
            item.icon !== undefined ?
              item.icon :
              <button type="button" className="border-0 bg-none">
                <PlusOutlined />
                <div className="mt-2">
                  Tải file
                </div>
              </button>
          }
        </Upload>
      }
      {item.labelAfter}
    </>
  )
}

const RenderForm = ({
  fields = [],
  form = null,
  rowGutter = [10, 10],
  onFinish,
  className = '',
  rowClass = '',
  loadingSubmit = false,
  footer = null,
  modalWidth,
  onCancel = () => {
  }
}) => {
  return (
    <Form
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      className={'render-form ' + className}
    >
      <Row gutter={rowGutter} className={rowClass ?? ''}>
        {
          fields?.map((item, key) => {
            if (item.html || item.type === 'html') {
              return <Col
                span={item.span || 24}
                md={item.md || item.span || 24}
                lg={item.lg || 24}
                key={key}
              >
                {item.content}
              </Col>;
            }
            item.rules = item.rules?.map(v =>
              !v.message && v.required ? {
                ...v,
                message: `${item.label || item.placeholder || item.labelHidden} không được bỏ trống`,
              } : v,
            ) || [];
            return (
              <Col
                className={item.colClass || ''}
                key={key}
                span={item.span || 24}
                md={item.md || item.span || 24}
                lg={item.lg || 24}
              >
                {
                  !item.hidden &&
                  item.type !== 'group' &&
                  (
                    <Form.Item
                      {...(props[item.type] || {})}
                      name={item.name}
                      rules={item.rules}
                      label={item.label || item.placeholder}
                      className={item.className || ''}
                      {...(item.propsFormItem || {})}
                    >
                      {SwitchInputType({ item: item })}
                    </Form.Item>
                  )

                }
                {
                  (item.type === 'group') &&
                  <GroupForm
                    itemGroup={item}
                    name={item.name}
                    form={form}
                    parentName={item.name}
                    firstName={item.name}
                    modalWidth={modalWidth}
                  />
                }
              </Col>
            );
          })
        }
      </Row>
      <Row gutter={rowGutter}>
        {
          footer ? footer :
            <Col span={24} className="md:mt-10 mt-1 flex justify-center gap-5">
              <Button
                htmlType="button"
                onClick={onCancel}
                className="w-36"
              >
                Huỷ bỏ
              </Button>
              <Button
                loading={loadingSubmit}
                htmlType="submit"
                type="primary"
                className="w-36"
              >
                Lưu lại
              </Button>
            </Col>
        }
      </Row>
    </Form>
  )
}
RenderForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    labelHidden: PropTypes.string,
    propsInput: PropTypes.object,
    propsFormItem: PropTypes.object,
    titleButtonAdd: PropTypes.node,
    titleButtonDelete: PropTypes.node,
    classItem: PropTypes.string,
    filedsList: PropTypes.array,
    lg: PropTypes.number,
    minItem: PropTypes.number,
    maxItem: PropTypes.number,
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
      'range-picker',
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
  rowClass: PropTypes.string,
  loadingSubmit: PropTypes.bool,
  onCancel: PropTypes.func,
};
export default RenderForm;
