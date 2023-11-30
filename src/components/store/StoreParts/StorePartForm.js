import { Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd';
import ARMForm from '../../../lib/common/ARMForm';
import CommonDebounceSelect from '../../common/DebounceSelect';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';
import CountryAddForm from '../../configaration/base/CountryAddForm';
import SaveCity from '../../configaration/base/SaveCity';
import { useCity } from '../../configaration/base/useCity';
import useCountry from '../../configaration/basePlant/useCountry';
import LocationForm from '../../configaration/location/LocationForm';
import useLocation from '../../configaration/location/useLocation';
import { useStoreParts } from '../hooks/storeParts';
import AddRoomModal from '../rack/AddRoomModal';
import { useRacks } from '../rack/Racks';
import AddRackModal from '../rackrow/AddRackModal';
import { useRackRow } from '../rackrow/RackRow';
import AddRackRowModal from '../rackrowbin/AddRackRowModal';
import { useRackRowBin } from '../rackrowbin/RackRowBin';
import { useRooms } from '../room/Room';
import OfficeForm from '../technicalStore/OfficeForm';
import useOffice from '../technicalStore/UseOffice';
import PartNoSelect from './PartNoSelect';
import RackRowBinModal from './RackRowBinModal';
import SerialDetails from './SerialDetails';
import { PART_TYPES, ROTABLE } from './constants';
import DebounceSelect from '../../common/DebounceSelect';

const StorePartsEdit = () => {
  const { Option } = Select;
  const { TextArea } = Input;

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const { onReset: countryReset, form: countryForm } = useCountry();

  const { onReset: cityReset, form: cityForm } = useCity();

  const { onReset: Location_Reset, form: Location_Form } = useLocation();

  const { onReset: storeReset, form: storeForm } = useOffice();

  const { form: roomForm, onReset: roomReset } = useRooms();

  const { form: rackForm, onReset: rackReset } = useRacks();

  const { form: rackRowForm, onReset: rackRowReset } = useRackRow();

  const { form: rackRowBinForm, onReset: rackRowBinReset } = useRackRowBin();

  const {
    id,
    form,
    onReset,
    onFinish,
    isRoomDisabled,
    isRackDisabled,
    isRackRowDisabled,
    isRackRowBinDisabled,
    isTextAreaHidden,
    setIsTextAreaHidden,
    isRackHidden,
    setIsRackHidden,
    isRackRowHidden,
    setIsRackRowHidden,
    isRackRowBinHidden,
    setIsRackRowBinHidden,
    selectedPart,
    setSelectedPart,
    locationTag,
    setLocationTag,
    racks,
    showModal,
    setShowModal,
    handleModelRackSubmit,
    rackModal,
    setRackModal,
    rooms,
    offices,
    roomModal,
    setRoomModal,
    handleOfficeSubmit,
    handleModelRoomSubmit,
    handleModelRackRowSubmit,
    rackRowModal,
    setRackRowModal,
    rackRows,
    selectedLocation,
    setLocationModal,
    locationModal,
    handleLocationSubmit,
    setSelectedLocation,
    setCountryModal,
    countryModal,
    handleCountrySubmit,
    setCityModal,
    cityModal,
    handleCitySubmit,
    country,
    cities,
    officeId,
    roomId,
    rackId,
    getAllCountry,
    countryId,
    rackRowBin,
    rackRowBinModal,
    setRackRowBinModal,
    handleModelRackRowBinSubmit,
    rackRowId,
    partId,
    availId,
    partClassification,
    setPartClassification,
    serialId,
    setSerialId,
    aircrafts,
  } = useStoreParts(
    rackRowForm,
    rackForm,
    roomForm,
    storeForm,
    Location_Form,
    countryForm,
    cityForm,
    rackRowBinForm
  );

  const partType = Form.useWatch('partType', form);
  const acType = Form.useWatch('acType', form);
  const storeStockRoom = Form.useWatch('storeStockRoomId', form);

  return (
    <>
      <RibbonCard ribbonText={'Add Parts Availability'}>
        <ARMForm
          {...layout}
          form={form}
          name="basic"
          id="storeparts"
          onFinish={onFinish}
          initialValues={{
            aircraftId: null,
            acType: null,
          }}
          autoComplete="off"
          style={{
            backgroundColor: '#ffffff',
          }}
        >
          <Row>
            <Col
              sm={20}
              md={10}
            >
              <Form.Item
                name="officeId"
                label="Store"
                rules={[
                  {
                    required: true,
                    message: 'Store is required!',
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Select a store"
                  showSearch
                  optionFilterProp="children"
                  onSearch={onSearch}
                  onChange={(e) => {
                    onChange();
                    form.setFieldsValue({
                      ...form,
                      roomId: null,
                      rackId: null,
                      rackRowId: null,
                    });
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownRender={(menu) => (
                    <>
                      <Button
                        style={{ width: '100%' }}
                        type="primary"
                        onClick={() => setShowModal(true)}
                      >
                        + Add Store
                      </Button>
                      {menu}
                    </>
                  )}
                >
                  {offices?.map((store, index) => (
                    <Option
                      key={index}
                      value={store.id}
                    >
                      {store.code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="roomId"
                label="Room"
              >
                <Select
                  //allowClear={true}
                  placeholder="--- Select Room ---"
                  disabled={isRoomDisabled}
                  onSearch={onSearch}
                  showSearch
                  onChange={(value) => {
                    form.setFieldsValue({
                      ...form,
                      rackId: null,
                      rackRowId: null,
                    });
                    if (value) {
                      setIsRackHidden(false);
                      setIsRackRowHidden(false);
                      setIsRackRowBinHidden(false);
                      setIsTextAreaHidden(true);
                      form.resetFields(['otherLocation']);
                      if (
                        locationTag !== 'RACK' ||
                        locationTag !== 'RACKROW' ||
                        locationTag !== 'RACKROWBIN'
                      ) {
                        setLocationTag('ROOM');
                        form.setFieldValue('locationTag', 'ROOM');
                      }
                    } else {
                      setIsRackHidden(true);
                      setIsRackRowHidden(true);
                      setIsRackRowBinHidden(true);
                      setIsTextAreaHidden(false);
                      setLocationTag('ROOM');
                      form.setFieldValue('locationTag', 'ROOM');
                      form.resetFields(['rack', 'rackRow', 'rackRowBin']);
                    }
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownRender={(menu) => (
                    <>
                      <Button
                        style={{ width: '100%' }}
                        type="primary"
                        onClick={() => setRoomModal(true)}
                      >
                        + Add Rooms
                      </Button>
                      {menu}
                    </>
                  )}
                >
                  {rooms.map((room, index) => (
                    <Option
                      key={room.roomId}
                      value={room.roomId}
                    >
                      {room.roomCode}
                    </Option>
                  ))}
                  <Option value={0}>Other Location</Option>
                </Select>
              </Form.Item>

              <Form.Item
                hidden={isRackHidden}
                name="rackId"
                label="Rack"
              >
                <Select
                  //allowClear={true}
                  placeholder="--- Select Rack ---"
                  disabled={isRackDisabled}
                  showSearch
                  onSearch={onSearch}
                  onChange={(value) => {
                    //onChange();
                    form.setFieldsValue({ ...form, rackRowId: null });
                    if (value) {
                      setIsRackRowHidden(false);
                      setIsRackRowBinHidden(false);
                      setIsTextAreaHidden(true);
                      form.resetFields(['otherLocation']);
                      if (
                        locationTag !== 'ROOM' ||
                        locationTag !== 'RACKROW' ||
                        locationTag !== 'RACKROWBIN'
                      ) {
                        setLocationTag('RACK');
                        form.setFieldValue('locationTag', 'RACK');
                      }
                    } else {
                      setIsRackRowHidden(true);
                      setIsRackRowBinHidden(true);
                      setIsTextAreaHidden(false);
                      setLocationTag('RACK');
                      form.setFieldValue('locationTag', 'RACK');
                      form.resetFields(['rackRow', 'rackRowBin']);
                    }
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownRender={(menu) => (
                    <>
                      <Button
                        style={{ width: '100%' }}
                        type="primary"
                        onClick={() => setRackModal(true)}
                      >
                        + Add Racks
                      </Button>
                      {menu}
                    </>
                  )}
                >
                  {racks.map((rack, index) => (
                    <Option
                      key={rack.rackId}
                      value={rack.rackId}
                    >
                      {rack.rackCode}
                    </Option>
                  ))}
                  <Option value={0}>Other Location</Option>
                </Select>
              </Form.Item>

              <Form.Item
                hidden={isRackRowHidden}
                name="rackRowId"
                label="Rack Row"
              >
                <Select
                  //allowClear={true}
                  placeholder="--- Select Rack Row ---"
                  disabled={isRackRowDisabled}
                  showSearch
                  onSearch={onSearch}
                  onChange={(value) => {
                    //onChange();
                    form.setFieldsValue({ ...form, rackRowBinId: null });
                    if (value) {
                      setIsRackRowBinHidden(false);
                      setIsTextAreaHidden(true);
                      form.resetFields(['otherLocation']);
                      if (
                        locationTag !== 'RACK' ||
                        locationTag !== 'ROOM' ||
                        locationTag !== 'RACKROWBIN'
                      ) {
                        setLocationTag('RACKROW');
                        form.setFieldValue('locationTag', 'RACKROW');
                      }
                    } else {
                      setIsRackRowBinHidden(true);
                      setIsTextAreaHidden(false);
                      setLocationTag('RACKROW');
                      form.setFieldValue('locationTag', 'RACKROW');
                      form.resetFields(['rackRowBin']);
                    }
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownRender={(menu) => (
                    <>
                      <Button
                        style={{ width: '100%' }}
                        type="primary"
                        onClick={() => setRackRowModal(true)}
                      >
                        + Add Racks Row
                      </Button>
                      {menu}
                    </>
                  )}
                >
                  {rackRows.map((rackRow, index) => (
                    <Option
                      key={rackRow.rackRowId}
                      value={rackRow.rackRowId}
                    >
                      {rackRow.rackRowCode}
                    </Option>
                  ))}
                  <Option value={0}>Other Location</Option>
                </Select>
              </Form.Item>

              <Form.Item
                hidden={isRackRowBinHidden}
                name="rackRowBinId"
                label="Rack Row Bin"
              >
                <Select
                  //allowClear={true}
                  placeholder="--- Select Rack Row Bin ---"
                  disabled={isRackRowBinDisabled}
                  onChange={(value) => {
                    if (value) {
                      setIsTextAreaHidden(true);
                      form.resetFields(['otherLocation']);
                      if (
                        locationTag !== 'RACK' ||
                        locationTag !== 'RACKROW' ||
                        locationTag !== 'ROOM'
                      ) {
                        setLocationTag('RACKROWBIN');
                        form.setFieldValue('locationTag', 'RACKROWBIN');
                      }
                    } else {
                      setIsTextAreaHidden(false);
                      setLocationTag('RACKROWBIN');
                      form.setFieldValue('locationTag', 'RACKROWBIN');
                    }
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownRender={(menu) => (
                    <>
                      <Button
                        style={{ width: '100%' }}
                        type="primary"
                        onClick={() => setRackRowBinModal(true)}
                      >
                        + Add Rack Row Bin
                      </Button>
                      {menu}
                    </>
                  )}
                >
                  {rackRowBin.map((rackRowBin, index) => (
                    <Option
                      key={rackRowBin.rackRowBinId}
                      value={rackRowBin.rackRowBinId}
                    >
                      {rackRowBin.rackRowBinCode}
                    </Option>
                  ))}
                  <Option value={0}>Other Location</Option>
                </Select>
              </Form.Item>

              <Form.Item
                hidden
                name="locationTag"
                label="Location Tag"
              >
                <Input />
              </Form.Item>

              <Form.Item
                hidden={isTextAreaHidden}
                name="otherLocation"
                label="Other Location"
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Part Type"
                name="partType"
                rules={[
                  {
                    required: true,
                    message: 'Part Type Required',
                  },
                ]}
              >
                <Select
                  placeholder="--- Select Part Type ---"
                  allowClear
                  options={PART_TYPES}
                  disabled={!!id}
                ></Select>
              </Form.Item>
            </Col>

            <Col
              sm={20}
              md={10}
            >
              <Form.Item
                name="acType"
                label="AC Type"
                rules={[
                  {
                    required: Number(partType) === ROTABLE,
                    message: 'This field is required',
                  },
                ]}
              >
                <CommonDebounceSelect
                  mapper={(v) => ({
                    label: v.aircraftModelName,
                    value: v.id,
                  })}
                  disabled={!!id}
                  allowClear
                  showSearch
                  placeholder="--- Select AC Type ---"
                  type="multi"
                  url={`/aircraft/models/search?page=1&size=20`}
                  onChange={(newValue) => {
                    form.setFieldValue('partId', null);
                    setSelectedPart(null);
                  }}
                />
              </Form.Item>

              <Form.Item
                name="partId"
                label="Part No."
                rules={[
                  {
                    required: true,
                    message: 'This field is required!',
                  },
                ]}
              >
                <PartNoSelect
                  allowClear
                  debounceTimeout={1000}
                  mapper={(v) => ({
                    value: v.id,
                    label: v.partNo,
                  })}
                  showSearch
                  //value={selectedPart}
                  placeholder="--- Select Part No. ---"
                  url="/part/search-by-part-and-ac-type?page=1&size=20"
                  params={{
                    partClassification: partType,
                    acType: acType,
                  }}
                  searchParam="partNo"
                  selectedValue={selectedPart}
                  onChange={(value) => {
                    setSelectedPart(value);
                    form.setFieldValue('partId', value);
                  }}
                  style={{
                    width: '100%',
                  }}
                  disabled={!!id}
                />
              </Form.Item>

              <Form.Item
                name="unitOfMeasureCode"
                label="UOM"
              >
                <Input
                  disabled
                  style={{ width: '100%', backgroundColor: '#ffffff' }}
                />
              </Form.Item>

              {id && (
                <Form.Item
                  //name="serialId"
                  label="Serials"
                >
                  <CommonDebounceSelect
                    debounceTimeout={1000}
                    mapper={(v) => ({
                      value: v.id,
                      label: v.serialNo,
                    })}
                    showSearch
                    placeholder="--- Search Existing Serial No. ---"
                    url={`/store_part_serial/search?page=1&size=200`}
                    params={{
                      availId: id,
                    }}
                    onChange={(sId) => {
                      setSerialId(sId);
                    }}
                    type="multi"
                    allowClear
                    style={{
                      width: '100%',
                    }}
                  />
                </Form.Item>
              )}

              <Form.Item
                name="storeStockRoomId"
                label="Stock Room"
                rules={[
                  {
                    required: false,
                    message: 'Stock Room is required!',
                  },
                ]}
              >
                <DebounceSelect
                  allowClear
                  disabled={!!id}
                  debounceTimeout={1000}
                  mapper={(v) => ({
                    value: v.stockRoomId,
                    label: v.stockRoomCode,
                  })}
                  showSearch
                  placeholder="--- Select Stock Room ---"
                  url="store-management/store-stock-rooms/search"
                  selectedValue={storeStockRoom}
                />
              </Form.Item>

              <Form.Item
                name="minStock"
                label="Min Stock"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="maxStock"
                label="Max Stock"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col
              sm={20}
              md={10}
            >
              <Form.Item
                style={{ marginTop: '10px' }}
                wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
              >
                <Space size="small">
                  <ARMButton
                    type="primary"
                    htmlType="submit"
                  >
                    {'Submit'}
                  </ARMButton>
                  <ARMButton
                    onClick={onReset}
                    type="primary"
                    danger
                  >
                    Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>
        <SerialDetails
          partId={partId}
          partNo={selectedPart}
          availId={availId}
          id={id}
          serialId={serialId}
          partClassification={partClassification}
          setPartClassification={setPartClassification}
          partForm={form}
        />
      </RibbonCard>

      <Modal
        title="Add Store"
        style={{
          top: 20,
        }}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        centered
        visible={showModal}
        width={1080}
        footer={null}
      >
        <OfficeForm
          onFinish={handleOfficeSubmit}
          onReset={storeReset}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          setLocationModal={setLocationModal}
          form={storeForm}
        />
      </Modal>

      <Modal
        title="Add Room"
        style={{
          top: 20,
        }}
        onOk={() => setRoomModal(false)}
        onCancel={() => setRoomModal(false)}
        centered
        visible={roomModal}
        width={1080}
        footer={null}
      >
        <AddRoomModal
          onFinish={handleModelRoomSubmit}
          onReset={roomReset}
          offices={offices}
          form={roomForm}
          officeId={officeId}
        />
      </Modal>

      <Modal
        title="Add Rack"
        style={{
          top: 20,
        }}
        onOk={() => setRackModal(false)}
        onCancel={() => setRackModal(false)}
        centered
        visible={rackModal}
        width={1080}
        footer={null}
      >
        <AddRackModal
          form={rackForm}
          layout={layout}
          onFinish={handleModelRackSubmit}
          offices={offices}
          isRoomDisabled={isRoomDisabled}
          rooms={rooms}
          id={id}
          officeId={officeId}
          roomId={roomId}
          onReset={rackReset}
        />
      </Modal>

      <Modal
        title="Add Rack Row"
        style={{
          top: 20,
        }}
        onOk={() => setRackRowModal(false)}
        onCancel={() => setRackRowModal(false)}
        centered
        visible={rackRowModal}
        width={1080}
        footer={null}
      >
        <AddRackRowModal
          form={rackRowForm}
          layout={layout}
          onFinish={handleModelRackRowSubmit}
          offices={offices}
          isRoomDisabled={isRoomDisabled}
          isRackDisabled={isRackDisabled}
          rooms={rooms}
          id={id}
          racks={racks}
          officeId={officeId}
          roomId={roomId}
          rackId={rackId}
          onReset={rackRowReset}
        />
      </Modal>

      <Modal
        title="Add Rack Row Bin"
        style={{
          top: 20,
          zIndex: 1,
        }}
        onOk={() => setRackRowBinModal(false)}
        onCancel={() => setRackRowBinModal(false)}
        centered
        visible={rackRowBinModal}
        width={1080}
        footer={null}
      >
        <RackRowBinModal
          onFinish={handleModelRackRowBinSubmit}
          setShowModal={setRackRowBinModal}
          form={rackRowBinForm}
          onReset={rackRowBinReset}
          layout={layout}
          offices={offices}
          isRoomDisabled={isRoomDisabled}
          isRackDisabled={isRackDisabled}
          id={id}
          racks={racks}
          rooms={rooms}
          rackRows={rackRows}
          officeId={officeId}
          roomId={roomId}
          rackId={rackId}
          rackRowId={rackRowId}
        />
      </Modal>

      <Modal
        title="Add Location"
        style={{
          top: 20,
          zIndex: 9999,
        }}
        onOk={() => setLocationModal(false)}
        onCancel={() => setLocationModal(false)}
        centered
        visible={locationModal}
        width={1080}
        footer={null}
      >
        <LocationForm
          onFinish={handleLocationSubmit}
          form={Location_Form}
          onReset={Location_Reset}
          setCountryModal={setCountryModal}
          countryModal={countryModal}
          handleCountrySubmit={handleCountrySubmit}
          setCityModal={setCityModal}
          cityModal={cityModal}
          handleCitySubmit={handleCitySubmit}
          countries={country}
          cities={cities}
        />
      </Modal>

      <Modal
        title="Add Country"
        style={{
          top: 20,
          zIndex: 9999,
        }}
        onOk={() => setCountryModal(false)}
        onCancel={() => setCountryModal(false)}
        centered
        visible={countryModal}
        width={1080}
        footer={null}
      >
        <CountryAddForm
          onFinish={handleCountrySubmit}
          form={countryForm}
          onReset={countryReset}
        />
      </Modal>

      <Modal
        title="Add City"
        style={{
          top: 20,
          zIndex: 1,
        }}
        onOk={() => setCityModal(false)}
        onCancel={() => setCityModal(false)}
        centered
        visible={cityModal}
        width={1080}
        footer={null}
      >
        <SaveCity
          onFinish={handleCitySubmit}
          setShowModal={setCountryModal}
          countries={country}
          form={cityForm}
          onReset={cityReset}
          countryId={countryId}
        />
      </Modal>
    </>
  );
};

export default StorePartsEdit;
