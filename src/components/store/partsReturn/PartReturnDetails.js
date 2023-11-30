import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Col, Form, Row, notification} from 'antd';
import {getErrorMessage} from '../../../lib/common/helpers';
import {formLayout} from '../../../lib/constants/layout';
import PartsServices from '../../../service/PartsServices';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';
import FormControl from '../common/FormControl';
import {useUnusableItemReturns} from '../hooks/partsReturn';
import ServiceableForm from './ServiceableForm';
import UnserviceableForm from './UnserviceableForm';
import React from "react";
import InnerFieldsPartReturnList from "./InnerFieldsPartReturnList";

const PartReturnDetails = ({
  form,
  partId,
  partClassification,
  selectedPartId,
  serviceable,
  cAABForm,
  setCAABForm,
}) => {
  const { id, airport, position } = useUnusableItemReturns();
  const getPart = async (id, index, identifier) => {
    if (!id) {
      if (identifier === 'installedPart') {
        form.setFieldsValue(
          (form.getFieldValue('storeReturnPartList')[
            index
            ].installedPartUomId = {label: '', value: '', key: ''})
        );
        form.setFieldsValue(
          (form.getFieldValue('storeReturnPartList')[
            index
            ].installedPartDescription = undefined)
        );
      } else {
        form.setFieldsValue(
          (form.getFieldValue('storeReturnPartList')[
            index
            ].removedPartUomId = {label: '', value: '', key: ''})
        );
        form.setFieldsValue(
          (form.getFieldValue('storeReturnPartList')[index].partDescription =
            undefined)
        );
      }
      return;
    }
    try {
      const {data} = await PartsServices.getPartById(id);
      if (identifier === 'installedPart') {
        form.setFieldsValue(
          (form.getFieldValue('storeReturnPartList')[
            index
            ].installedPartUomId = {label: data.unitOfMeasureCode, value: data.unitOfMeasureId})
        );
        form.setFieldsValue(
          (form.getFieldValue('storeReturnPartList')[
            index
            ].installedPartDescription = data.description)
        );
      } else {
        form.setFieldsValue(
          (form.getFieldValue('storeReturnPartList')[
            index
            ].removedPartUomId = {label: data.unitOfMeasureCode, value: data.unitOfMeasureId})
        );
        form.setFieldsValue(
          (form.getFieldValue('storeReturnPartList')[index].partDescription =
            data.description)
        );
      }
    } catch (er) {
      notification['error']({message: getErrorMessage(er)});
    }
  };

  const disabledField = (index) => {
    const values = form.getFieldValue(['storeReturnPartList', index, 'partId']);
    return values === undefined || values === '';

  };

  const disabledInstalledSerialField = (index) => {
    const values = form.getFieldValue([
      'storeReturnPartList',
      index,
      'installedPartId',
    ]);
    return values === undefined || values === '';

  };

  function handlePartChange(newValue, index, identifier) {
    if (newValue === undefined) {
      selectedPartId(null);
    } else {
      selectedPartId(newValue.value);
      getPart(newValue.value, index, identifier);
    }
    if (identifier === 'installedPart') {
      form.setFieldsValue(
        (form.getFieldValue('storeReturnPartList')[
          index
          ].installedPartSerialId = {
          label: '',
          key: '',
          value: '',
        })
      );
    } else {
      form.setFieldsValue(
        (form.getFieldValue('storeReturnPartList')[index].removedPartSerialId =
          {
            label: '',
            key: '',
            value: '',
          })
      );
    }
  }

  return (
    <>
      <FormControl>
        <RibbonCard ribbonText="Parts Return Details">
          <p/>
          <Form.List name="storeReturnPartList">
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, ...restField}, index) => {
                  return (
                    <Row
                      style={{marginBottom: '20px'}}
                      key={key}
                    >
                      <Col
                        lg={23}
                        sm={24}
                        md={24}
                      >
                        <Row gutter={[16, 16]}>
                          <InnerFieldsPartReturnList
                            form={form}
                            name={name}
                            serviceable={serviceable}
                            restField={restField}
                            index={index}
                            handlePartChange={handlePartChange}
                            partClassification={partClassification}
                          />
                        </Row>
                        {!serviceable ? (
                          <UnserviceableForm
                            name={name}
                            restField={restField}
                            disabledField={disabledField}
                            disabledInstalledSerialField={
                              disabledInstalledSerialField
                            }
                            partId={partId}
                            airport={airport}
                            position={position}
                            index={index}
                            form={form}
                          />
                        ) : (
                          <ServiceableForm
                            name={name}
                            restField={restField}
                            disabledField={disabledField}
                            disabledInstalledSerialField={
                              disabledInstalledSerialField
                            }
                            partId={partId}
                            airport={airport}
                            position={position}
                            setCAABForm={setCAABForm}
                            cAABForm={cAABForm}
                            index={index}
                            form={form}
                          />
                        )}
                      </Col>
                      <Col
                        lg={1}
                        sm={24}
                        md={24}
                      >
                        {id ? (
                          ''
                        ) : (
                          <Button
                            danger
                            onClick={() => {
                              remove(name);
                            }}
                            style={{
                              marginBottom: '5px',
                              marginLeft: '15px',
                              borderRadius: '6px',
                            }}
                          >
                            <MinusCircleOutlined/>
                          </Button>
                        )}
                      </Col>
                    </Row>
                  );
                })}

                <Form.Item wrapperCol={{...formLayout.labelCol}}>
                  <ARMButton
                    type="primary"
                    onClick={() => {
                      form.setFieldsValue({
                        ...form,
                        storeReturnPartList: [
                          ...form.getFieldValue('storeReturnPartList'),
                          {
                            id: null,
                          },
                        ],
                      });
                      // add()
                    }}
                    icon={<PlusOutlined/>}
                  >
                    Add
                  </ARMButton>
                </Form.Item>
              </>
            )}
          </Form.List>
        </RibbonCard>
      </FormControl>
    </>
  );
};

export default PartReturnDetails;
