import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Col, Form, Input, Row, Space, notification} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {useEffect, useState} from 'react';
import ARMForm from '../../../lib/common/ARMForm';
import {getErrorMessage} from '../../../lib/common/helpers';
import {formLayout} from '../../../lib/constants/layout';
import PartsServices from '../../../service/PartsServices';
import DebounceSelect from '../../common/DebounceSelect';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';
import StoreDemandDebounce from "./StoreDemandDebounce";

const AlterPartForm = ({formData, setOpenModal, mainIndex}) => {
  const [form] = Form.useForm();
  const partId = formData.getFieldValue('storeDemandDetailsDtoList')[mainIndex]?.partId?.value;
  const demandId = formData.getFieldValue('id');
  const [uomRender, setUomRender] = useState(false);
  useEffect(() => {
    if (formData.getFieldValue('storeDemandDetailsDtoList')[mainIndex]
      .alterPartDtoList !== null)
      (form.setFieldValue(
        'alterPartDtoList',
        formData.getFieldValue('storeDemandDetailsDtoList')[mainIndex]
          .alterPartDtoList
      ))
  }, [demandId]);

  const onFinish = () => {
    formData.setFieldsValue(
      (formData.getFieldValue('storeDemandDetailsDtoList')[
        mainIndex
        ].alterPartDtoList = form.getFieldValue('alterPartDtoList'))
    );
    // form.setFieldsValue('alterPartDtoList',form.getFieldValue('alterPartDtoList'))
    setOpenModal(false);
  };

  const getPartById = async (id, index) => {
    try {
      const {data} = await PartsServices.getPartById(id);

      form.setFieldsValue(
        (form.getFieldValue('alterPartDtoList')[index].partDescription =
          data.description)
      );

      form.setFieldsValue(
        (form.getFieldValue('alterPartDtoList')[index].uomId = {
          label: data.unitOfMeasureCode,
          value: data.unitOfMeasureId,
        })
      );
    } catch (er) {
      notification['error']({message: getErrorMessage(er)});
    }
  };

  return (
    <ARMForm
      labelWrap
      {...formLayout}
      form={form}
      name="basic"
      onFinish={onFinish}
      autoComplete="off"
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      <RibbonCard ribbonText="Alternate Part Infos">
        <Form.List name={'alterPartDtoList'}>
          {(fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}, index) => {
                return (
                  <Row
                    key={key}
                    gutter="10"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      hidden={true}
                      style={{width: '150%'}}
                    >
                      <Input/>
                    </Form.Item>
                    <Col
                      xs={24}
                      sm={24}
                      md={8}
                    >
                      <Form.Item
                        style={{width: '150%'}}
                        {...restField}
                        name={[name, 'partId']}
                      >
                        <StoreDemandDebounce
                          placeholder="Select Part"
                          mapper={(v) => ({
                            label: v.partNo,
                            value: v.id,
                          })}
                          filter={partId}
                          searchParam="partNo"
                          showSearch
                          url={`/part/search?page=1&size=20`}
                          selectedValue={
                            form.getFieldValue('alterPartDtoList')[index]
                              ?.partId
                          }
                          onChange={(newValue) => {
                            getPartById(newValue.value, index);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'partDescription']}
                        hidden={false}
                        style={{width: '150%'}}
                      >
                        <TextArea
                          disabled
                          placeholder="Part Description"
                          style={{backgroundColor: '#fff', color: '#000'}}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={8}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'uomId']}
                        style={{width: '150%'}}
                      >
                        <DebounceSelect
                          placeholder="Select UOM"
                          mapper={(v) => ({
                            label: v.code,
                            value: v.id,
                          })}
                          searchParam="query"
                          showSearch
                          url={`/store/unit/measurements/search?page=1&size=20`}
                          selectedValue={
                            form.getFieldValue('alterPartDtoList')[index]?.uomId
                          }
                          onChange={() => {
                            setUomRender(!uomRender);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={1}
                    >
                      <Button
                        danger
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <MinusCircleOutlined/>
                      </Button>
                    </Col>
                  </Row>
                );
              })}
              <Form.Item wrapperCol={{...formLayout.labelCol}}>
                <ARMButton
                  onClick={() => {
                    add();
                  }}
                  icon={<PlusOutlined/>}
                  type="primary"
                >
                  Add field
                </ARMButton>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Col
          sm={20}
          md={10}
        >
          <Form.Item
            style={{marginTop: '15px'}}
            wrapperCol={{...formLayout.wrapperCol}}
          >
            <Space size="small">
              <ARMButton
                type="primary"
                htmlType="submit"
              >
                Submit
              </ARMButton>
            </Space>
          </Form.Item>
        </Col>
      </RibbonCard>
    </ARMForm>
  );
};

export default AlterPartForm;
