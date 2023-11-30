import { Button, Col, Divider, Form, Row, Select } from 'antd';
import RibbonCard from '../../common/forms/RibbonCard';
import FormControl from '../common/FormControl';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { formLayout } from '../../../lib/constants/layout';
import ARMButton from '../../common/buttons/ARMButton';
import React from "react";
import InnerFieldsDemand from "./InnerFieldsDemand";

const { Option } = Select;

const StoreDemandDetails = ({ form, getPartById, priority, id }) => {

  return (
    <FormControl>
      <RibbonCard ribbonText="STORE DEMAND DETAILS">
        <p />
        <Form.List name="storeDemandDetailsDtoList">
          {(fields, { add, remove }) => (
            <>
              {fields?.map(({ key, name, ...restField }, index) => {
                if (
                  form.getFieldValue('storeDemandDetailsDtoList')[index]
                    ?.isActive
                )
                  return (
                    <Row
                      gutter={[
                        16,
                        { xs: 8, sm: 12, md: 16, lg: 16 },
                      ]}
                      key={key}
                    >

                    <InnerFieldsDemand
                      form={form}
                      name={name}
                      restField={restField}
                      index={index}
                      getPartById={getPartById}
                      priority={priority}
                      />
                      <Col
                        xs={24}
                        sm={24}
                        md={1}
                      >
                        <Button
                          danger
                          onClick={() => {
                            form.getFieldValue('storeDemandDetailsDtoList')[
                              index
                            ]?.id
                              ? form.setFieldsValue(
                                  (form.getFieldValue(
                                    'storeDemandDetailsDtoList'
                                  )[index].isActive = false)
                                )
                              : remove(index);
                            form.setFieldsValue({ ...form });
                          }}
                        >
                          <MinusCircleOutlined />
                        </Button>
                      </Col>
                      <Divider />
                    </Row>

                  );
              })}
              <Form.Item wrapperCol={{ ...formLayout.labelCol }}>
                <ARMButton
                  type="primary"
                  onClick={() => {
                    form.setFieldsValue({
                      ...form,
                      storeDemandDetailsDtoList: [
                        ...form.getFieldValue('storeDemandDetailsDtoList'),
                        {
                          isActive: true,
                          id: null,
                        },
                      ],
                    });
                    //add()
                  }}
                  icon={<PlusOutlined />}
                >
                  Add
                </ARMButton>
              </Form.Item>
            </>
          )}
        </Form.List>
      </RibbonCard>
    </FormControl>
  );
};

export default StoreDemandDetails;
