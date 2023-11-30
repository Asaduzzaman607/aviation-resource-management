import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ARMForm from '../../../lib/common/ARMForm';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifySuccess } from '../../../lib/common/notifications';
import { formLayout } from '../../../lib/constants/layout';
import API from '../../../service/Api';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';
import FormControl from '../common/FormControl';
import SaveSerial from './SaveSerial';
import DebounceSelect from "../../common/DebounceSelect";
import InnerFieldSerialSave from "./InnerFieldSerialSave";
import StorePartsService from './StorePartsService';

const SerialDetails = ({
  partId,
  partNo,
  availId,
  id,
  serialId,
  partClassification,
  setPartClassification,
  partForm,
}) => {
  const [form] = Form.useForm();
  const [serials, setSerials] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [index, setIndex] = useState(null);

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 12,
    },
  };

  const validateData = (values) => {
    if (!values) return false;
    return !!(values.serialId &&
      values.grnNo &&
      values.partStatus &&
      values.rackLife &&
      values.selfLife &&
      typeof values.issued === 'boolean');

  };

  //saving and updating
  const onFinish = async (values, serialList, index) => {
    const validate = validateData(values);
    const shelfLifeDate = moment(values.rackLife);
    const expiredDate = moment(values.selfLife);
    const diffInDays = expiredDate.diff(shelfLifeDate, 'days');

    if (!validate) return;
    if(diffInDays < 0) {
      notifyError('Shelf Life can not be greater than Expire Date');
      return;
    }

    try {
      if (values.id) {
        await StorePartsService.storePartSerialUpdate(values.id, {
          ...values,
          uomId: values.uomId.value,
        })
        notifySuccess('Updated Successfully!');
      } else {
        await StorePartsService.storePartSerialSave({
          ...values,
          availId: id || availId,
          uomId: values.uomId.value,
        })
        await getSerialByPartId(partId);
        notifySuccess('Saved Successfully!');
      }
      const formValue = serialList.filter((_, idx) => idx !== index);
      form.setFieldValue('serialDtoList', formValue);
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  //fetching serial by partId
  const getSerialByPartId = async (partId) => {
    try {
      const { data } = await StorePartsService.getSerialByPartId(partId);
      setSerials(data);
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  //fetching serial by serialId && removing serial if serialId is null
  const getSrialBySerialId = async () => {
    try {
      const { data } = await StorePartsService.getSerialBySerialId(serialId);
      const serialList = form
        .getFieldValue('serialDtoList')
        .filter((serial) => !serial?.id);
      form.setFieldValue('serialDtoList', [
        {
          ...data,
          rackLife: data.rackLife ? moment(data.rackLife) : null,
          selfLife: data.selfLife ? moment(data.selfLife) : null,
          uomId: {label:data.uomCode,value:data.uomId},
        },
        ...serialList,
      ]);
    } catch (e) {
      notifyError(getErrorMessage(e));
    }
  };

  //fetching serial by serialId && removing serial if serialId is null
  useEffect(() => {
    (async () => {
      if (!serialId) {
        let serials = form
          .getFieldValue('serialDtoList')
          .filter((serial) => !serial?.id);
        console.log({ serials });
        form.setFieldValue('serialDtoList', serials);
        return;
      }
      await getSrialBySerialId();
    })();
  }, [serialId]);

  //fetching serial by partId
  useEffect(() => {
    if (!partId) {
      if (partClassification === 2) {
        let serials = form.getFieldValue('serialDtoList').map((serial) => {
          return {
            ...serial,
            quantity: null,
          };
        });
        form.setFieldValue('serialDtoList', serials);
      }
      partForm.setFieldValue('unitOfMeasureCode', '');
      setPartClassification(null);
      return;
    }
    (async () => {
      await getSerialByPartId(partId);
    })();
  }, [partId]);

  //fetching currencies
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { model },
        } = await API.get('store/currencies');
        setCurrencies(model);
      } catch (e) {
        notifyError(getErrorMessage(e));
      }
    })();
  }, []);

  return (
    <FormControl>
      <RibbonCard ribbonText="Serial Details">
        <ARMForm
          {...layout}
          form={form}
          name="serialInfo"
          initialValues={{
            serialDtoList: [
              {
                serialId: null,
              },
            ],
          }}
          //onFinish={onFinish}
        >
          <Form.List name="serialDtoList">
            {(fields, { add, remove }) => (
              <>
                {fields?.map(({ key, name, ...restField }, index) => {
                  return (
                    <Row
                      gutter={16}
                      key={key}
                    >
                      <InnerFieldSerialSave
                        restField={restField}
                        index={index}
                        name={name}
                        form={form}
                        setShowModal={setShowModal}
                        setIndex={setIndex}
                        serials={serials}
                        currencies={currencies}
                        partClassification={partClassification}
                        />

                      <Button
                        danger
                        onClick={() => {
                          remove(index);
                        }}
                        style={{ marginLeft: 30 }}
                      >
                        <MinusCircleOutlined />
                      </Button>

                      <Tooltip title={availId || id ? "" : "Create availability first"} color="#04aa6d">
                        <Button
                          disabled={!(availId || id)}
                          type="primary"
                          style={{ marginLeft: 10 }}
                          htmlType="submit"
                          onClick={() =>
                            onFinish(
                              form.getFieldValue('serialDtoList')[index],
                              form.getFieldValue('serialDtoList'),
                              index
                            )
                          }
                        >
                          {form.getFieldValue('serialDtoList')[index]?.id
                            ? 'Update'
                            : 'Save'}
                        </Button>
                      </Tooltip>

                      <Divider />
                    </Row>
                  );
                })}
                <Form.Item
                  wrapperCol={{ ...formLayout.labelCol }}
                  style={{ marginTop: '10px' }}
                >
                  <ARMButton
                    onClick={() => {
                      add();
                    }}
                    icon={<PlusOutlined />}
                    type="primary"
                  >
                    Add Serial
                  </ARMButton>
                </Form.Item>
              </>
            )}
          </Form.List>
        </ARMForm>
      </RibbonCard>
      <Modal
        title="Add Serial"
        style={{
          top: 20,
          zIndex: 1,
        }}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        centered
        visible={showModal}
        width={800}
        footer={null}
        destroyOnClose
      >
        <SaveSerial
          setShowModal={setShowModal}
          form={form}
          index={index}
          partId={partId}
          partNo={partNo}
          setSerials={setSerials}
        />
      </Modal>
    </FormControl>
  );
};

export default SerialDetails;
