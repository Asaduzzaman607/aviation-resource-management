import { Form, notification } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoolean } from 'react-use';
import DateTimeConverter from '../../../converters/DateTimeConverter';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import { getErrorMessage } from '../../../lib/common/helpers';
import {
  notifyError,
  notifyResponseError,
  notifySuccess, notifyWarning,
} from '../../../lib/common/notifications';
import {
  useAircrafts,
  useListOfAircrafts,
} from '../../../lib/hooks/planning/aircrafts';
import { useAirports } from '../../../lib/hooks/planning/airports';
import useAddAirport from '../../../lib/hooks/planning/useAddAirport';
import { addNewAirport } from '../../../reducers/airport.reducer';
import AircraftService from '../../../service/AircraftService';
import AirportService from '../../../service/AirportService';
import ItemDemandService from '../../../service/ItemDemandService';
import PartsServices from '../../../service/PartsServices';
import DepartmentService from '../../../service/employees/DepartmentService';

const useStoreDemandFunctions = () => {
  const dispatch = useDispatch();
  const [department, setDepartment] = useState([]);
  const [ItemDemand, setItemDemand] = useState([]);
  const [oldVoucherItemsIds, setOldVoucherItemsIds] = useState([]);
  const [isInternal, setIsInternal] = useState('INTERNAL');

  const [isOpenAirportModal, toggleAirportModal] = useBoolean(false);
  const [isOpenAircraftModal, toggleAircraftModal] = useBoolean(false);

  const [form] = Form.useForm();
  const { storeDemandId } = useParams();
  const navigate = useNavigate();

  const [downloadLink, setDownloadLink] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handleFileInput, selectedFile, setSelectedFile, handleFilesUpload ,fileProcessForEdit} =
    useARMFileUpload();

  const { airports } = useAirports();
  const { aircrafts, setAircrafts } = useListOfAircrafts();

  /** for Airport modal **/
  const { form: airportForm, onReset: airportOnReset } = useAddAirport(true);
  const airportOnFinish = async (values) => {
    try {
      const { data } = await AirportService.saveAirport(values);
      airportForm.resetFields();
      notification['success']({ message: 'Successfully added!' });

      toggleAirportModal();
      dispatch(addNewAirport({ id: data.id, name: values.iataCode }));

      form.setFieldsValue({ airportId: data.id });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  /** for aircraft modal **/
  const {
    onNameChange,
    addItem,
    aircraftModelFamilies,
    name,
    onReset: onAirReset,
    form: onAirForm,
  } = useAircrafts();
  const addNewAircraftToList = (aircraft) =>
    setAircrafts((prevState) => [aircraft, ...prevState]);

  const onAircraftFinish = async (values) => {
    const aircraftValues = {
      ...values,
      manufactureDate: DateTimeConverter.momentDateToString(
        values.manufactureDate
      ),
    };
    try {
      const { data } = await AircraftService.saveAircraft(aircraftValues);
      notifySuccess('Aircraft saved successfully');
      const aircraftId = data.id;
      addNewAircraftToList({ id: aircraftId, name: values.aircraftName });
      form.setFieldsValue({ aircraftId });
      onAirForm.resetFields();
      toggleAircraftModal();
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const priority = [
    {
      name: 'AOG',
      value: 0,
    },
    {
      name: 'CRITICAL',
      value: 1,
    },
    {
      name: 'NORMAL',
      value: 2,
    },
  ];

  const getDepartment = async () => {
    try {
      if (isInternal === 'INTERNAL') {
        let { data } = await DepartmentService.getAllInternalDepartment(true);
        setDepartment(data.model);
      }
      if (isInternal === 'EXTERNAL') {
        let { data } = await DepartmentService.getAllExternalDepartment();
        setDepartment(data.model);
      }
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getItemDemandById = async () => {
    try {
      setLoading(true);
      const { data } = await ItemDemandService.getDemandWithAlterPartById(
        storeDemandId
      );
      setIsInternal(data.departmentType);

      let fileList = fileProcessForEdit(data?.attachment);
      setDownloadLink(fileList ? fileList : []);
      setSelectedFile(fileList ? fileList : []);

      let dtoList = [];
      data.storeDemandDetailsDtoList.map((d) => {
        dtoList.push({
          ...d,
          partId: { label: d.partNo, value: d.partId },
          unitMeasurementId: {
            label: d.unitMeasurementCode,
            value: d.unitMeasurementId,
          },
          alterPartDtoList: d.alterPartDtoList!==null? d.alterPartDtoList.map((alter) => {
            return {
              id: alter.id,
              partDescription:alter.partDescription,
              partId: { label: alter.partNo, value: alter.partId },
              uomId: {
                label: alter.uomCode,
                value: alter.uomId,
              },
            };
          }):null
        });
      });

      console.log({ dtoList });

      form.setFieldsValue({
        ...data,
        file: fileList ? fileList : [],
        validTill: data.validTill ? moment(data.validTill) : null,
        storeDemandDetailsDtoList: dtoList,
      });
      setItemDemand(data);
    } catch (er) {
      notification['error']({
        message: getErrorMessage(er) || 'Something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPartById = async (id, index) => {
    try {
      const { data } = await PartsServices.getPartById(id);
      // console.log("part",data)
      let uom = [];

      data?.partWiseUomResponseDtoList?.map((item) => {
        uom.push({
          value: item.uomId,
          label: item.uomCode,
        });
      });
      form.setFieldsValue(
        (form.getFieldValue('storeDemandDetailsDtoList')[
          index
        ].partDescription = data.description)
      );
      form.setFieldsValue(
        (form.getFieldValue('storeDemandDetailsDtoList')[
          index
        ].unitMeasurementId = uom[0])
      );
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getOldDemandById = async (id) => {
    try {
      const { data } = await ItemDemandService.getOldDemandById(id);

      console.log('old demand id', data);
      // remove old voucher data from form because we are going to add new old voucher data
      let itemDemand = removeOldVoucherItem(
        form.getFieldValue('storeDemandDetailsDtoList')
      );
      form.setFieldsValue({
        storeDemandDetailsDtoList: [
          ...data.storeDemandDetailsDtoList,
          ...itemDemand,
        ],
      });
      let ids = data.storeDemandDetailsDtoList.map((item) => item.id);
      setOldVoucherItemsIds(ids);
    } catch (er) {
      console.log('old voucher error', er);
    }
  };

  const removeOldVoucherItem = (currentItems) => {
    if (oldVoucherItemsIds.length === 0) return currentItems;
    let items = [];

    currentItems.map((item, index) => {
      if (!containsId(item.id)) {
        items.push(item);
      }
    });
    return items;
  };

  const containsId = (id) => {
    return oldVoucherItemsIds.some((item) => id === item);
  };

  const validateDemandDetailsList = (values) => {
    const demandLength = values.storeDemandDetailsDtoList.length;
    if (demandLength === 0) return false;
    if (values.storeDemandDetailsDtoList.filter((d) => d.isActive).length === 0)
      return false;
    return true;
  };

  const onFinish = async (values) => {
    console.log('tu', values);
    if (!validateDemandDetailsList(values)) {
      notifyError('Demand Details List must not be Empty!');
      return;
    }
    setLoading(true);
    const files = await handleFilesUpload('store-demand', selectedFile);
    let selectedChildPartId = [];
    let demandDetailsList = values.storeDemandDetailsDtoList?.map((list) => {
      selectedChildPartId.push(list.partId?.value);
      return{
        partId: list?.partId?.value,
        priorityType: list?.priorityType,
        quantityDemanded: list?.quantityDemanded,
        unitMeasurementId: list?.unitMeasurementId.value,
        isActive: list?.isActive,
        remark: list?.remark,
        ipcCmm: list?.ipcCmm,
        id: list?.id,
        alterPartDtoList: list?.alterPartDtoList?.map((alter) => {
          selectedChildPartId.push(alter.partId?.value);
          return {
            id:alter?.id,
            partId: alter.partId?.value,
            uomId: alter.uomId?.value,
          };
        }),
      }
    });
    let duplicateChildExist= selectedChildPartId.some((element, index) => {
      return selectedChildPartId.indexOf(element) !== index;
    })
    if(duplicateChildExist){
      notifyWarning(" Main Part can not be duplicate or alternate part");
      return;
    }
    let modifiedValue = {
      ...values,
      validTill: values.validTill
        ? values.validTill.format('YYYY-MM-DD')
        : null,
      storeDemandDetailsDtoList: demandDetailsList,
      attachment: files,
    };
    console.log('form value...', modifiedValue);

    try {
      if (storeDemandId) {
        await ItemDemandService.updateItemDemand(storeDemandId, modifiedValue);
      } else {
        let { data } = await ItemDemandService.saveItemDemand(modifiedValue);
        console.log('save data', data);
      }

      form.resetFields();
      navigate('/store/pending-demand');
      notification['success']({
        message: storeDemandId
          ? 'Successfully updated!'
          : 'Successfully added!',
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    if (storeDemandId) {
      form.setFieldsValue({ ...ItemDemand });
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    getDepartment().catch(console.error);
  }, [isInternal]);

  useEffect(() => {
    if (!storeDemandId) {
      return;
    }
    getItemDemandById().catch(console.error);
  }, [storeDemandId]);

  return {
    storeDemandId,
    form,
    onReset,
    onFinish,
    isInternal,
    setIsInternal,
    department,
    aircrafts,
    airports,
    getOldDemandById,
    getPartById,
    priority,
    airportForm,
    airportOnReset,
    airportOnFinish,
    toggleAircraftModal,
    toggleAirportModal,
    isOpenAirportModal,
    isOpenAircraftModal,
    onNameChange,
    addItem,
    aircraftModelFamilies,
    name,
    onAirReset,
    onAirForm,
    onAircraftFinish,
    handleFileInput,
    downloadLink,
    loading,
  };
};

export default useStoreDemandFunctions;
