import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import React from "react";
type Props = {
  id:any
}
export default function ScrapPartsBreadcrumb(props: Props) {
  const {id}=props
  return <ARMBreadCrumbs>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>
        {" "}
        <Link to="/store">
          {" "}
          <i className="fas fa-archive"/> &nbsp;Store
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
      {
        id ? <Link to="/store/pending-scrap-parts">
        Pending Scrap Parts List
      </Link> : "Scrap Parts"
      }
        
      </Breadcrumb.Item>
      
      <Breadcrumb.Item>
        {id?'edit':'add'}
      </Breadcrumb.Item>
    </Breadcrumb>
  </ARMBreadCrumbs>;
}