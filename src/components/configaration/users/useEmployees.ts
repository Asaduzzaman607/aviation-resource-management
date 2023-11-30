import {useState} from "react";
import API from "../../../service/Api";
import CommonTypes from "../../common/types/common";

type Designation = CommonTypes.Named;
type Section = CommonTypes.Named;
type Department = CommonTypes.Named & {
  companyId: string;
  code: string;
  info: string;
};

export interface Employee extends CommonTypes.Named{
  code: string;
  presentAddress: string;
  fatherName: string;
  motherName: string;
  nationalId: string;
  passport: string;
  activationCode: string;
  email: string;
  officePhone: string;
  officeMobile: string;
  permanentAddress: string;
  residentPhone: string;
  residentMobile?: any;
  bloodGroup: string;
  designation: Designation;
  section: Section;
  department: Department;
}

const EMPLOYEES_SEARCH_URL = 'employee/search';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])

  const search = {
    code: "",
    email: "",
    isActive: true,
    name: ""
  }

  const findEmployeeById = (id: number): Employee | null => {
    const employee = employees.find(employee => employee.id === id);
    return employee === undefined ? null : employee;
  }

  const initFetchEmployees = async () => {
    try {
      const {data} = await API.post(`employee/search`, search)
      const models = data.model as Employee[];
      setEmployees(models);
    } catch (e) {
      setEmployees([])
    }
  }

  const mapToOptionObject = (employee: Employee) => {
    return {
      label: employee?.name,
      value: employee?.id
    }
  }

  const fetchEmployeeList = async (name: string) => {
    const {data} = await API.post(EMPLOYEES_SEARCH_URL, {name})
    const employees = data.model as Employee[];
    setEmployees(employees);
    return employees.map(mapToOptionObject);
  }

  return {
    employees,
    initFetchEmployees,
    findEmployeeById,
    fetchEmployeeList
  }
}

