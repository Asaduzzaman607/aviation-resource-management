import { Form, notification } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError } from '../../../lib/common/notifications';
import AirportService from '../../../service/AirportService';
import cityService from '../../../service/CityService';
import CountryService from '../../../service/CountryService';
import { default as locationService } from '../../../service/LocationService';
import {
  default as OfficeService,
  default as officeService,
} from '../../../service/OfficeService';
import PartsServices from '../../../service/PartsServices';
import roomService from '../../../service/RoomService';
import DepartmentService from '../../../service/employees/DepartmentService';
import PositionsService from '../../../service/planning/configurations/PositionsService';
import PartsReturnService from '../../../service/store/PartsReturnService';
import SerialService from '../../../service/store/SerialService';
import { useCountryList } from '../../configaration/base/useCity';
import useCitiesByCountry from '../rackrowbin/useCitiesByCountry';
import useRoomsByOffice from '../rackrowbin/useRoomsByOffice';
import { useOfficelList } from '../room/Room';
import LocationsService from '../../../service/planning/configurations/LocationsService';

function formatDate(datum) {
  if (!!datum) {
    return datum.format('YYYY-MM-DD');
  }
}

export function useUnusableItemReturns(
  roomForm,
  storeForm,
  locationForm,
  countryForm,
  cityForm
) {
  const [department, setDepartment] = useState([]);
  const [technicalStore, setTechnicalStore] = useState([]);
  const [partNo, setPartNo] = useState([]);
  const [partsReturn, setPartsReturn] = useState([]);
  const [issue, setIssue] = useState([]);
  const [isInternal, setIsInternal] = useState(true);
  const [airport, setAirport] = useState([]);
  const [serial, setSerial] = useState([]);
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);
  const [isRackDisabled, setIsRackDisabled] = useState(true);

  const [countryModal, setCountryModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [locationModal, setLocationModal] = useState(false);
  const [downloadLink, setDownloadLink] = useState([]);
  const [position, setPosition] = useState([]);
  const [serviceable, setServiceable] = useState(true);
  const [filestatus, setFilestatus] = useState(false);
  const [cAABForm, setCAABForm] = useState(false);

  const { offices, setOffices, getAllOffices } = useOfficelList();
  const { country, setCountry, getAllCountry } = useCountryList();
  const officeId = Form.useWatch('officeId', form);
  const isRoomDisabled = !officeId;
  const [partId, selectedPartId] = useState();
  const countryId = Form.useWatch('countryId', locationForm);
  const { cities, setCities } = useCitiesByCountry(countryId);
  const { rooms, setRooms } = useRoomsByOffice(officeId);
  const { handleFileInput, selectedFile, setSelectedFile, handleFilesUpload, fileProcessForEdit } =
    useARMFileUpload();

  const handleCountrySubmit = async (values) => {
    try {
      const { data } = await CountryService.saveCountry(values);
      notification['success']({
        message: 'Store successfully created',
      });
      setCountryModal(false);
      const id = data.id;
      const newModel = {
        code: values.code,
        name: values.name,
        dialingCode: values.dialingCode,
        id,
      };
      setCountry((prevState) => [newModel, ...prevState]);
      locationForm.setFieldsValue({
        countryId: id,
        prefix: values.dialingCode,
      });
      cityForm.setFieldsValue({ countryId: id });
      countryForm.resetFields();
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const handleCitySubmit = async (values) => {
    try {
      const { data } = await cityService.saveCity(values);
      notification['success']({
        message: 'Store successfully created',
      });
      setCityModal(false);
      const id = data.id;
      const newCityModel = {
        name: values.name,
        zipCode: values.zipCode,
        countryId: values.countryId,
        id,
      };
      setCities((prevCity) => [newCityModel, ...prevCity]);
      locationForm.setFieldsValue({ cityId: id, countryId: values.countryId });
      cityForm.resetFields();
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const handleLocationSubmit = async (values) => {
    try {
      const { data } = await LocationsService.saveLocation(values);
      console.log({data});
      notification['success']({
        message: 'Location successfully created',
      });
      setLocationModal(false);
      const locationId = data.id;
      setSelectedLocation([
        {
          value: locationId,
          label: values.name,
          LocationId: id,
        },
      ]);

      storeForm.setFieldsValue({
        locationId: {
          value: locationId,
          label: values.name,
        },
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };
  const handleModelRoomSubmit = async (values) => {
    try {
      const { data } = await roomService.saveRoom({
        ...values,
        officeId: values.officeId,
      });
      roomForm.setFieldsValue({ roomCode: null, roomName: null });
      notification['success']({
        message: 'room successfully created',
      });

      const roomId = data.id;

      const newRoom = {
        roomName: values.roomName,
        roomCode: values.roomCode,
        officeId: values.officeId,
        roomId,
      };
      setRooms((prevState) => [newRoom, ...prevState]);
      form.setFieldsValue({
        ...values,
        roomId: roomId,
        roomName: values.roomName,
      });
      setRoomModal(false);
      setIsRackDisabled(false);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const handleOfficeSubmit = async (values) => {
    try {
      const { data } = await officeService.saveStore({
        ...values,
        locationId: values.locationId.value,
      });
      notification['success']({
        message: 'Store successfully created',
      });

      const id = data.id;
      const newModel = {
        code: values.code,
        id,
      };

      setOffices((prevState) => [newModel, ...prevState]);
      form.setFieldsValue({ ...values, officeId: id, roomId: null });
      setShowModal(false);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getAirports = async () => {
    try {
      let { data } = await AirportService.searchAirports({
        query: '',
        isActive: true,
      });
      setAirport(data.model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };
  const getDepartment = async () => {
    try {
      if (isInternal) {
        let { data } = await DepartmentService.getAllInternalDepartment(true);
        setDepartment(data.model);
      } else {
        let { data } = await DepartmentService.getAllExternalDepartment();
        setDepartment(data.model);
      }
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getPart = async () => {
    try {
      let { data } = await PartsServices.searchParts({
        query: '',
        isActive: true,
      });
      setPartNo(data.model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getIssueDemand = async () => {
    try {
      let { data } = await PartsReturnService.getAllIssueDemand(
        true,
        'APPROVED'
      );
      setIssue(data.model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getTechnicalStore = async () => {
    let { data } = await OfficeService.getAllStores(50, {
      query: '',
      isActive: true,
    });
    setTechnicalStore(data.model);
  };

  const getPosition = async () => {
    let { data } = await PositionsService.getAllPositions(true, 1, 50);
    setPosition(data.model);
  };

  useEffect(() => {
    getPosition().catch(console.error);
    getAirports().catch(console.error);
    getTechnicalStore().catch(console.error);
    getPart().catch(console.error);
    getIssueDemand().catch(console.error);
  }, []);

  useEffect(() => {
    getDepartment().catch(console.error);
  }, [isInternal]);

  const getPartsReturnById = async () => {
    setFilestatus(true);
    try {
      setLoading(true);
      const { data } = await PartsReturnService.getPartReturnById(id);
      let arr = [];
      setIsInternal(data.isInternalDept);
      await getDepartment();
      data?.storeReturnPartList?.map((item) => {
        selectedPartId(item.partId);
        item.serviceable ? setServiceable(true) : setServiceable(false);
        item.partsDetailViewModels[0].caabEnabled
          ? setCAABForm(true)
          : setCAABForm(false);
        arr.push({
          ...item,
          partId: { label: item.partNo, value: item.partId },
          installedPartUomId:{ label: item.installedPartUomCode, value:item.installedPartUomId},
          removedPartUomId:{ label: item.removedPartUomCode, value:item.removedPartUomId},
          installedPartId: {
            label: item.installedPartNo,
            value: item.installedPartId,
          },
          airportId: item.partsDetailViewModels[0].airportId,
          authCodeNo: item.partsDetailViewModels[0].authCodeNo,
          installedPartSerialId: {
            lebel: item.partsDetailViewModels[0].installedPartSerialNo
              ? item.partsDetailViewModels[0].installedPartSerialNo.serialNo
              : '',
            value: item.partsDetailViewModels[0].installedPartSerialNo
              ? item.partsDetailViewModels[0].installedPartSerialNo.serialId
              : '',
          },
          removedPartSerialId: {
            lebel: item.partsDetailViewModels[0].removedPartSerialNo
              ? item.partsDetailViewModels[0].removedPartSerialNo.serialNo
              : '',
            value: item.partsDetailViewModels[0].removedPartSerialNo
              ? item.partsDetailViewModels[0].removedPartSerialNo.serialId
              : '',
          },
          caabEnabled: item.partsDetailViewModels[0].caabEnabled
            ? [item.partsDetailViewModels[0].caabEnabled]
            : '',
          caabStatus: item.partsDetailViewModels[0].caabStatus,
          caabRemarks: item.partsDetailViewModels[0].caabRemarks,
          approvalAuthNo: item.partsDetailViewModels[0].approvalAuthNo,
          certApprovalRef: item.partsDetailViewModels[0].certApprovalRef,
          authorizedUserId: item.partsDetailViewModels[0].authorizedUserId,
          authorizesUserId: item.partsDetailViewModels[0].authorizesUserId,
          authorizedDate: item.partsDetailViewModels[0].authorizedDate
            ? moment(item.partsDetailViewModels[0].authorizedDate)
            : '',
          authorizesDate: item.partsDetailViewModels[0].authorizesDate
            ? moment(item.partsDetailViewModels[0].authorizesDate)
            : '',
          caabCheckbox: item.partsDetailViewModels[0].caabCheckbox
            ? item.partsDetailViewModels[0].caabCheckbox.split(',')
            : [],
          isUsed: item.partsDetailViewModels[0].isUsed,
          id: item.id
        });
      });

      setSelectedLocation({ label: data.locationCode, value: data.locationId });
      let modData = {
        ...data,
        unserviceableStatus: data.storeReturnStatusType,
        locationId: { label: data.locationCode, value: data.locationId },
        storeStockRoomId: {
          label: data.stockRoomName,
          value: data.storeStockRoomId,
        },
        storeReturnPartList: arr,
      };
      let fileList = fileProcessForEdit(data?.attachment);

      setSelectedFile(fileList ? fileList : []);
      setDownloadLink(fileList ? fileList : []);
      delete data.attachment;

      form.setFieldsValue(modData);
      setPartsReturn(data);
      setFilestatus(false);
      if (!data.editable) {
        notification['error']({
          message: 'You have to permission to access the page!',
        });
        // navigate('/store/pending-demand');
        // return;
      }
    } catch (er) {
      notifyError(getErrorMessage(er));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    getPartsReturnById().catch(console.error);
  }, [id]);

  const onFinish = async (values) => {
    // console.log({values})
    let partReturnDetails = [];
    values.storeReturnPartList?.map((data) => {
      partReturnDetails.push({
        description: data.description,
        quantityReturn: data.quantityReturn,
        cardLineNo: data.cardLineNo,
        releaseNo: data.releaseNo,
        serviceable: data.serviceable,
        partId: data.partId.value,
        installedPartId: data?.installedPartId?.value,
        id: data.id,
        installedPartUomId: data?.installedPartUomId?.value,
        removedPartUomId: data?.removedPartUomId?.value,
        caabEnabled:
          data.caabEnabled === undefined ? false : data.caabEnabled[0],
        caabStatus: data.caabStatus,
        caabRemarks: data.caabRemarks,
        caabCheckbox: data.caabCheckbox ? data.caabCheckbox.toString() : '',
        approvalAuthNo: data.approvalAuthNo,
        authorizedDate: formatDate(data['authorizedDate']),
        authorizesDate: formatDate(data['authorizesDate']),
        certApprovalRef: data.certApprovalRef,
        authorizedUserId: data.authorizedUserId,
        authorizesUserId: data.authorizesUserId,
        returnPartsDetailDto: {
          airportId: data.airportId,
          installedPartSerialId: data?.installedPartSerialId?.value,
          removedPartSerialId: data?.removedPartSerialId?.value,
          authCodeNo: data.authCodeNo,
          isUsed: data.isUsed,
        },
      });
    });

    const fileList = await handleFilesUpload('parts-return', selectedFile);

    const modData = {
      ...values,
      voucherNo: Math.floor(Math.random() * 1111111 + 1),
      locationId: values.locationId.value,
      storeStockRoomId: values?.storeStockRoomId?.value,
      storeReturnPartList: partReturnDetails,
      attachment: fileList,
    };

    try {
      setLoading(true);
      if (id) {
        await PartsReturnService.updatePartReturn(id, modData);
      } else {
        await PartsReturnService.savePartReturn(modData);
      }
      form.resetFields();
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
      navigate('/store/pending-parts-return');
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    } finally {
      setLoading(false);
    }
  };

  const getPartById = async (id, index) => {
    try {
      const { data } = await PartsServices.getPartById(id);
      form.setFieldsValue(
        (form.getFieldValue('storeReturnPartList')[
          index
        ].unitOfMeasurementCode = data.unitOfMeasureCode)
      );
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const onReset = () => {
    //id ? form.setFieldsValue({...partsReturn}) : form.resetFields();
    if (!id) {
      form.resetFields();
    } else {
      getPartsReturnById();
    }
  };

  const handleDepartmentChange = (value) => {
    setIsInternal(value.target.value);
  };

  useEffect(() => {
    (async () => {
      await getAllCountry();
      await getAllOffices();
    })();
  }, []);

  return {
    position,
    department,
    partNo,
    issue,
    form,
    id,
    isInternal,
    technicalStore,
    airport,
    handleDepartmentChange,
    onReset,
    onFinish,
    setRooms,
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
    handleModelRoomSubmit,
    handleOfficeSubmit,
    showModal,
    setShowModal,
    roomModal,
    setRoomModal,
    offices,
    isRoomDisabled,
    isRackDisabled,
    rooms,
    officeId,
    countryId,
    downloadLink,
    handleFileInput,
    loading,
    serviceable,
    getPartById,
    selectedPartId,
    partId,
    filestatus,
    cAABForm,
    setCAABForm,
  };
}
