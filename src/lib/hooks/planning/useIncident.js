import { Form } from "antd";
import { useWatch } from "antd/lib/form/Form";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../service/Api";
import { notifyResponseError, notifySuccess } from "../../common/notifications";
import InterruptionServices from "../../../service/InterruptionServices";
import {separateCharactersAndNumbers} from "../../common/helpers";

export function useIncident() {
  const [form] = Form.useForm();
  let navigate = useNavigate();
  let { id } = useParams();
  const [incidentType, setIncidentType] = useState([]);
  const [classification, setClassification] = useState([]);
  const incidentId = useWatch("incidentTypeEnum", form);
  const aircraftId = useWatch("aircraftId", form);
  const selectedPageNo = Form.useWatch('referenceAtl', form)
  const seqNoValue = Form.useWatch('seqNo', form)
  const [allPageNo, setAllPageNo] = useState([]);
  const [pageNoAlphabets, setPageAlphabets] = useState([]);

  const getAllPageNoByAircraft = async () => {
    if (!aircraftId) return
    try {
      const {data} = await InterruptionServices.getAllPageNoByAircraft(aircraftId);
      const concatenatedList = data.map(({ pageNo, alphabet }) => ({
        pageNo,
        alphabet,
        referenceAtl: pageNo + alphabet,
      }));
      setAllPageNo(data);
      setPageAlphabets(concatenatedList);

    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    getAllPageNoByAircraft();
  }, [aircraftId]);

  const getInterruptionByAmlId = async () => {

    const filteredData = allPageNo.filter(item => {
      const concatenatedValue = `${item.pageNo}${item.alphabet}`;
      return  concatenatedValue === selectedPageNo ||  (item.pageNo === selectedPageNo && item.alphabet === null);
    });

    const selectedAmlId = filteredData[0]?.amlId
    const selectedAmlDate = filteredData[0]?.date

    if(!id){
      form.setFieldsValue({
        date: selectedAmlDate? moment(selectedAmlDate) : null
      })
    }

    if (!selectedAmlId) return
    const {data} = await API.get(`/aircraft-maintenance-log/interruptionInfo/${selectedAmlId}`)

    const selectedSeq = data?.filter(({seqNo}) => seqNo === seqNoValue)[0]?.seqNo
    const selectedDefectRect = data?.filter(({seqNo}) => seqNo === seqNoValue)[0]
    if (selectedSeq === 'A') {
      form.setFieldsValue({
        incidentDesc: selectedDefectRect.defectDescription ? selectedDefectRect.defectDescription : null,
        actionDesc: selectedDefectRect.rectDescription ? selectedDefectRect.rectDescription : null

      })
    } else if (selectedSeq === 'B') {
      form.setFieldsValue({
        incidentDesc: selectedDefectRect.defectDescription ? selectedDefectRect.defectDescription : null,
        actionDesc: selectedDefectRect.rectDescription ? selectedDefectRect.rectDescription : null

      })
    } else {
      form.setFieldsValue({
        incidentDesc: null,
        actionDesc: null

      })
    }
  }

  useEffect(() => {
    getInterruptionByAmlId();
  }, [selectedPageNo, seqNoValue]);

  const onFinish = async (values) => {
    const customData = {
      ...values,
      date: values["date"].format("YYYY-MM-DD"),
    };
    if (id) {
      try {
        const { data } = await API.put(`aircraft-incidents/${id}`, customData);
        navigate("/reliability/incident");
        notifySuccess("Incident successfully updated !");
      } catch (er) {
        notifyResponseError(er);
      }
    } else {
      try {
        const { data } = await API.post(`aircraft-incidents`, customData);
        navigate("/reliability/incident");
        notifySuccess("Incident successfully created !");
      } catch (er) {
        notifyResponseError(er);
      }
    }
  };

  const loadSingleData = async (id) => {
    try {
      const { data } = await API.get(`aircraft-incidents/${id}`);

      form.setFieldsValue({
        ...data,
        date: data?.date ? moment(data?.date) : null,
      });
      getClassification(data.incidentTypeEnum);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const onReset = async () => {
    if (!id) {
      form.resetFields();
    }
    await loadSingleData(id);
  };

  useEffect(() => {
    if (!id) return;
    loadSingleData(id);
  }, [id]);

  const getIncidentType = () => {
    const data = [
      { id: 0, name: "TECHNICAL INCIDENTS" },
      { id: 1, name: "NON TECHNICAL INCIDENTS" },
    ];
    setIncidentType(data);
  };

  const getClassification = (incidentId) => {
    const data = [
      { id: 0, name: "TAKE OFF ABANDONED" },
      { id: 1, name: "RETURNS BEFORE TAKE OFF" },
      { id: 2, name: "RETURNS AFTER TAKE OFF" },
      { id: 3, name: "ENGINE SHUT DOWN IN FLIGHT" },
      { id: 4, name: "FIRE WARNING LIGHT" },
      { id: 5, name: "FUEL DUMPING" },
      { id: 6, name: "OTHER REPORTABLE DEFECT" },
    ];

    const data1 = [
      { id: 7, name: "TURBULENCE" },
      { id: 8, name: "LIGHTNING STRIKE" },
      { id: 9, name: "BIRD STRIKE JACKAL HIT" },
      { id: 10, name: "FOREIGN OBJECT DAMAGE" },
      { id: 11, name: "AC DAMAGED BY GROUND EQPT" },
      { id: 12, name: "OTHER" },
    ];
    if (incidentId === 0) {
      setClassification(data);
    } else {
      setClassification(data1);
    }
  };

  useEffect(() => {
    getClassification(incidentId);
  }, [incidentId]);

  useEffect(() => {
    getIncidentType();
  }, []);

  return {
    incidentType,
    setIncidentType,
    classification,
    setClassification,
    onFinish,
    form,
    onReset,
    pageNoAlphabets
  };
}
