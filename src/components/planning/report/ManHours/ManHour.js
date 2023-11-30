import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, notification, Typography } from "antd";
import EditableCell from "../../../common/EditableCell";
import { getErrorMessage, sleep } from "../../../../lib/common/helpers";
import { createRef, useCallback } from "react";
import { useAircraftsList } from "../../../../lib/hooks/planning/aircrafts";
import { useBoolean } from "react-use";
import API from "../../../../service/Api";
import { EditOutlined } from "@ant-design/icons";
import React from "react";
import ARMButton from "../../../common/buttons/ARMButton";
import { pageSerialNo } from "../Common";

const TITLE = "Man Hours";

const printStyle = `
  *{
    font-size: 15px!important;
    margin-top: 0!important;
    margin-bottom: 0!important;
    padding: 0!important;
    overflow: visible !important;
  }
    .pagination{
   display: none!important;
  }
   .signatureContent{
   display: block!important
   }
   .first {
   display : none!important
   }
   .second {
    display : block!important
   }
 
  .amp-table td,
  .manTable tr th{
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }

  table.report-container {
    page-break-after:always!important;
}
thead.report-header {
    display:table-header-group!important;
}

@page {
size: landscape!important;
}
`;



export function useManHours() {
  const { id } = useParams()
  const [form] = Form.useForm();
  const [manHourForm] = Form.useForm();
  const [dataSource2, setDataSource2] = useState([]);
  const [data, setData] = useState([]);
  const [data3, setData3] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const reportRef = createRef();
  const { allAircrafts, getAllAircrafts } = useAircraftsList();
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [acCheckIndexs, setAllAcCheckIndexs] = useState([]);
  const acCheckIndexId = Form.useWatch('acCheckIndexId', form);
  const aircraftId = Form.useWatch('aircraftId', form);



  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {

    manHourForm.setFieldsValue({
      noOfMan: '',
      elapsedTime: '',
      actualManHour: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key, ldndId) => {
    const manHourUpdateData = manHourForm.getFieldsValue()


    const modifiedValues = {
      ldndId: ldndId,
      actualManHour: manHourUpdateData.actualManHour,
      elapsedTime: manHourUpdateData.elapsedTime,
      noOfMan: manHourUpdateData.noOfMan
    }


    try {

      await API.post(`aircraft-check-index/update-ldnd`, modifiedValues)
      notification['success']({ message: "Data Updated Successfully" });

      const row = await manHourForm.validateFields();
      const newData = [...dataSource2];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource2(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setDataSource2(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };


  const defaultColumns = [
    {
      title: 'S/N',
      dataIndex: 'key',
      width: '5%',
      editable: false,
    },
    {
      title: 'AMM/TASK CARD REFERENCE:',
      dataIndex: 'jobProcedure',
      width: '20%',
      editable: false,
    },
    {
      title: 'AMP REFERENCE:',
      dataIndex: 'taskNo',
      width: '20%',
      editable: false,
    },
    {
      title: 'TASK DESCRIPTION',
      dataIndex: 'taskDescription',
      width: '20%',
      editable: false,
    },
    {
      title: 'TASK TYPE',
      dataIndex: 'taskType',
      width: '10%',
      editable: false,
    },
    {
      title: 'TRADE',
      dataIndex: 'trade',
      width: '10%',
      editable: false,
    },
    {
      title: 'MPD HOURS',
      dataIndex: 'manHours',
      width: '10%',
      editable: false,
    },
    {
      title: 'PROPOSED MAN-HOUR',
      dataIndex: 'proposedManHours',
      width: '10%',
      editable: false,
    },
    {
      title: 'NO. OF MAN',
      dataIndex: 'noOfMan',
      width: '10%',
      editable: true,
    },
    {
      title: 'ELAPSED TIME',
      dataIndex: 'elapsedTime',
      width: '10%',
      editable: true,
    }
    ,
    {
      title: 'ACTUAL MH BY 145',
      dataIndex: 'actualManHour',
      width: '10%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key, record.ldndId)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Typography.Link onClick={cancel}>
              <a style={{ color: 'red' }}>Cancel</a>
            </Typography.Link>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>

            <ARMButton
              type="primary"
              size="small"
              style={{
                backgroundColor: "#6e757c",
                borderColor: "#6e757c",
              }}
            ><EditOutlined />
            </ARMButton>

          </Typography.Link>
        );
      }
    }
  ]


  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }


    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      }),
    };
  });

  const manHourData = (data) => {
    let list = data?.map((manHour, index) => (
      {
        key: pageSerialNo(currentPage, index + 1),
        ldndId: manHour.ldndId,
        jobProcedure: manHour.jobProcedure,
        taskNo: manHour.taskNo,
        taskDescription:
          <span dangerouslySetInnerHTML={{
            __html: (`${manHour.taskDescriptionViewModel.taskDescription ? manHour.taskDescriptionViewModel.taskDescription + "<br/>" : ''}   
            Part No: ${manHour.taskDescriptionViewModel.partNo ? manHour.taskDescriptionViewModel.partNo + "<br/>" : ''}
            Serial No:  ${manHour.taskDescriptionViewModel.serialNo ? manHour.taskDescriptionViewModel.serialNo : ''}`)
          }} />,
        taskType: manHour.taskType,
        trade: manHour.trade,
        manHours: manHour.manHours,
        proposedManHours: manHour.proposedManHours,
        noOfMan: manHour.noOfMan,
        elapsedTime: manHour.elapsedTime,
        actualManHour: manHour.actualManHour,
      }
    )
    )

    return list ? list : []
  }


  useEffect(() => {
    (async () => {
      await getAllAircrafts();

    })();
  }, [getAllAircrafts])


  const getAllAcCheck = async () => {

    if (!aircraftId) {
      return
    }

    const { data } = await API.get(`aircraft-check-index/find-all-ac-check-index/${aircraftId}`)
    setAllAcCheckIndexs(data)
  }


  useEffect(() => {
    if (!aircraftId) {
      return
    }
    (async () => {
      await getAllAcCheck()
    })()
  }, [aircraftId])


  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState()


  const handleSubmit = useCallback(async (iDs) => {
    const acCheckIndexId = iDs.acCheckIndexId

    if (!acCheckIndexId) {
      return
    }

    const isDataWithPagination = {
      acCheckIndexId: acCheckIndexId,
      isPageable: true
    }

    try {
      const res = await API.post(`aircraft-check-index/man-hour?page=${currentPage}&size=${iDs.size}`, isDataWithPagination);
      const list = manHourData(res.data.pageData?.model)
      setData(res.data)
      setDataSource2(list)

      setCurrentPage(res?.data?.pageData?.currentPage);
      setTotalPages(res?.data?.pageData?.totalPages);
    } catch (error) {

      notification["error"]({ message: getErrorMessage(error) });
    } finally {
      toggleSubmitting(false);
    }
  }, [currentPage, toggleSubmitting])




  const handlePrint = useCallback(async () => {

    const dataWithoutPagination = {
      acCheckIndexId: acCheckIndexId,
      isPageable: false
    }

    try {
      const res2 = await API.post(`aircraft-check-index/man-hour`, dataWithoutPagination);
      setData3(res2.data)

    } catch (error) {

      notification["error"]({ message: getErrorMessage(error) });
    }
  }, [acCheckIndexId])

  const fetchPrintData = async () => {

    const dataWithoutPagination = {
      acCheckIndexId: acCheckIndexId,
      isPageable: false
    }

    try {
      const res2 = await API.post(`aircraft-check-index/man-hour`, dataWithoutPagination);
      setData3(res2.data)
      return sleep(1000)
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
      return;
    }
  };




  useEffect(() => {
    if (!acCheckIndexId) {
      return;
    }
    (async () => {
      await handleSubmit(form.getFieldsValue(true));
    })();
  }, [handleSubmit, form]);


  const resetFilter = () => {
    form.resetFields()
    setDataSource2([])
  }


  return {
    TITLE,
    acCheckIndexs,
    printStyle,
    getAllAcCheck,
    id,
    form,
    manHourForm,
    dataSource2,
    components,
    columns,
    handleSubmit,
    resetFilter,
    cancel,
    reportRef,
    allAircrafts,
    submitting,
    data,
    currentPage,
    totalPages,
    setCurrentPage,
    handlePrint,
    data3,
    fetchPrintData

  }
}