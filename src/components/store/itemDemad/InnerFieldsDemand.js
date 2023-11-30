import {Button, Col, Form, Input, InputNumber, Modal, Select} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {useState} from 'react';
import DebounceSelect from '../../common/DebounceSelect';
import ScrapPartsDeBounce from '../scrapParts/ScrapPartsDeBounce';
import AlterPartForm from './AlterPartForm';

const {Option} = Select;
const InnerFieldsDemand = ({
                             name,
                             index,
                             restField,
                             form,
                             getPartById,
                             priority,
                           }) => {
  const aircraftId = Form.useWatch('aircraftId', form);
  const activeButton= Form.useWatch(['storeDemandDetailsDtoList',index, 'partId']);


  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Col
        xs={24}
        sm={24}
        md={4}
        className="parent"
      >
        <label>
           <span style={{color: 'red'}}>*</span> Part No
        </label>
        <Form.Item
          {...restField}
          name={[name, 'partId']}
          rules={[
            {
              required: true,
              message: 'Part No. is required!',
            },
          ]}
          hidden={false}
        >
          <ScrapPartsDeBounce
            params={{aircraftId}}
            mapper={(v) => ({
              label: v.partNo,
              value: v.id,
            })}
            searchParam="partNo"
            showSearch
            //placeholder="---Search Part No. ---"
            url={`part/common-part?page=1&size=10`}
            selectedValue={
              form.getFieldValue('storeDemandDetailsDtoList')[index]?.partId
            }
            onChange={(newValue) => {
              //console.log('selected part...', newValue);
              getPartById(newValue.value, index);
            }}
            //type="multi"
          />
        </Form.Item>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={6}
        className="parent"
      >
        <label>Description</label>
        <Form.Item
          {...restField}
          name={[name, 'partDescription']}
          hidden={false}
          style={{marginBottom: '23px'}}
        >
          <TextArea
            disabled
            //placeholder="Part Description"
            style={{backgroundColor: '#fff', color: '#000'}}
          />
        </Form.Item>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={4}
        className="parent"
      >
        <label>IPC/CMM Ref</label>
        <Form.Item
          {...restField}
          name={[name, 'ipcCmm']}
        >
          <Input
            // placeholder="IPC/CMM Ref"
          />
        </Form.Item>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={6}
        className="parent"
      >
        <label>Part UOM</label>
        <Form.Item
          {...restField}
          name={[name, 'unitMeasurementId']}
        >
          <DebounceSelect
            debounceTimeout={1000}
            mapper={(v) => ({
              label: v.code,
              value: v.id,
            })}
            showArrow
            searchParam="query"
            showSearch
            placeholder={'Select UOM'}
            url={`/store/unit/measurements/search?page=1&size=20`}
            selectedValue={Form.useWatch([
              'storeDemandDetailsDtoList',
              index,
              'unitMeasurementId',
            ])}
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={3}
        className="parent"
      >
        <label>
         <span style={{color: 'red'}}>*</span> QTY .
        </label>
        <Form.Item
          {...restField}
          name={[name, 'quantityDemanded']}
          rules={[
            {
              required: true,
              message: 'QTY. is required! ',
            },
            {
              type: 'number',
              min: 1,
              message: 'Needed >= 1',
            },
          ]}
        >
          <InputNumber
            style={{width: '100%'}}
            min={1}
            //placeholder="QTY ."
          />
        </Form.Item>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={6}
        className="parent"
      >
        <label>
          <span style={{color: 'red'}}>*</span> Priority
         </label>
        <Form.Item
          {...restField}
          name={[name, 'priorityType']}
          rules={[
            {
              required: true,
              message: 'Priority is required!',
            },
          ]}
        >
          <Select
            // placeholder="Priority"
          >
            {priority?.map((data) => (
              <Option
                key={data.value}
                value={data.name}
              >
                {data.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col
        xs={24}
        sm={24}
        md={6}
        className="parent"
      >
        <label>Remarks</label>
        <Form.Item
          {...restField}
          name={[name, 'remark']}
        >
          <TextArea
            // placeholder="Remarks"
          />
        </Form.Item>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={4}
      >
        <Form.Item
          {...restField}
          name={[name, 'alterPartDtoList']}
        >
          <Button
            type={'primary'}
            onClick={() => setOpenModal(true)}
            disabled={activeButton === undefined}
          >
          Alternate Part
          </Button>
        </Form.Item>
      </Col>
      <Modal
        visible={openModal}
        title={'Add Alternate Part'}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={1200}
      >
        <AlterPartForm
          formData={form}
          setOpenModal={setOpenModal}
          mainIndex={index}
        />
      </Modal>
    </>
  );
};

export default InnerFieldsDemand;
