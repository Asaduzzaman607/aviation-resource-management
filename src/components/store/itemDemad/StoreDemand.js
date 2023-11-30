import { Breadcrumb, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { formLayout } from '../../../lib/constants/layout';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import ARMAircraftAdd from '../../planning/aircraft/aircraft/ARMAircraftAdd';
import AddAirportForm from '../../planning/flightData/AddAirportForm';
import SubmitReset from '../common/SubmitReset';
import StoreDemandBasicInfo from './StoreDemandBasicInfo';
import StoreDemandDetails from './StoreDemandDetails';
import useStoreDemandFunctions from './StoreDemandFunctions';

const StoreDemand = () => {
  const {
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
  } = useStoreDemandFunctions();

  const route = useSelector((state) => state.routeLocation.previousRoute);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/store">
              <i className="fas fa-archive" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {route === 'list' ? (
              <Link to="/store/pending-demand">&nbsp;Pending Demand List</Link>
            ) : (
              'Demand'
            )}
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            &nbsp;{storeDemandId ? 'edit' : 'add'}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission={[
          'STORE_PARTS_DEMAND_STORE_DEMAND_SAVE',
          'STORE_PARTS_DEMAND_STORE_DEMAND_EDIT',
        ]}
        showFallback
      >
        <ARMCard
          title={
            route === 'list'
              ? getLinkAndTitle('Demand', '/store/pending-demand')
              : getLinkAndTitle('Demand', '/store')
          }
        >
          <ARMForm
            labelWrap
            {...formLayout}
            form={form}
            name="basic"
            initialValues={{
              storeDemandDetailsDtoList: [
                {
                  isActive: true,
                  id: null,
                },
              ],
            }}
            onFinish={onFinish}
            autoComplete="off"
            style={{
              backgroundColor: '#ffffff',
            }}
          >
            <StoreDemandBasicInfo
              setIsInternal={setIsInternal}
              toggleAirportModal={toggleAirportModal}
              airports={airports}
              toggleAircraftModal={toggleAircraftModal}
              aircrafts={aircrafts}
              getOldDemandById={getOldDemandById}
              isInternal={isInternal}
              department={department}
              handleFileInput={handleFileInput}
              downloadLink={downloadLink}
              storeDemandId={storeDemandId}
              form={form}
            />
            &nbsp;
            <StoreDemandDetails
              form={form}
              getPartById={getPartById}
              priority={priority}
              id={storeDemandId}
            />
            {/** for airport modal **/}
            <Modal
              title="Add Airport"
              footer={null}
              onCancel={toggleAirportModal}
              visible={isOpenAirportModal}
            >
              <AddAirportForm
                form={airportForm}
                onFinish={airportOnFinish}
                onReset={airportOnReset}
              />
            </Modal>
            {/** for aircraft modal **/}
            <Modal
              title="Add Aircraft"
              footer={null}
              onCancel={toggleAircraftModal}
              visible={isOpenAircraftModal}
              width={1400}
            >
              <ARMAircraftAdd
                onReset={onAirReset}
                form={onAirForm}
                onNameChange={onNameChange}
                addItem={addItem}
                aircraftModelFamilies={aircraftModelFamilies}
                name={name}
                onFinish={onAircraftFinish}
              />
            </Modal>
            <SubmitReset
              id={storeDemandId}
              onReset={onReset}
            />
          </ARMForm>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default StoreDemand;
