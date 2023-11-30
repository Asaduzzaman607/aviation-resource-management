import {
  Breadcrumb, Col, Radio, Row,Form
} from 'antd';
import StorePartsFileUpload from "./StorePartsFileUpload";
import {Link, useParams} from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import Permission from "../../auth/Permission";
import {useState} from "react";
import FIleUploadErrors from "./FIleUploadErrors";
import StorePartForm from './StorePartForm';


const StoreParts = () => {
  const [errors, setErrors] = useState([]);
  const [file, setFile] = useState(true);

  const {id} = useParams();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp;Store</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/store/parts-availability"> Parts Availability</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission={["STORE_STORE_PARTS_AVAILABILITY_PARTS_AVAILABILITY_SAVE","STORE_STORE_PARTS_AVAILABILITY_PARTS_AVAILABILITY_EDIT"]} showFallback>
        <ARMCard title={getLinkAndTitle('Store Parts Availability', '/store/parts-availability')}>

            <Radio.Group
                onChange={(e) => {setFile(e.target.value)}}
                defaultValue={file}
            >
              <Radio value={true}>Manual Input</Radio>
              <Radio value={false}>File Upload</Radio>
            </Radio.Group>

          {
            file ?
                <StorePartForm/>
                :
                <Row>
                  {errors.length > 0 ?
                      <Col sm={20} md={10}>
                        <StorePartsFileUpload setErrors={setErrors}/>
                      </Col>
                      :
                      <Col xl={24}>
                        <StorePartsFileUpload setErrors={setErrors}/>
                      </Col>}
                  <Col span={2}>

                  </Col>
                  {
                      errors.length > 0 &&
                      <Col sm={20} md={10}>
                        <FIleUploadErrors errors={errors} setErrors={setErrors}/>
                      </Col>
                  }
                </Row>
          }
          
        </ARMCard>
     </Permission>
    </CommonLayout>
  );
};

export default StoreParts;


