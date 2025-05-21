"use client"
import React, { Component } from 'react';
import { useSearchParams } from 'react-router-dom'
import { removeCookies , getCookie,setCookie } from 'cookies-next';
import Link from 'next/link';
import Image from "next/image";
import Select from 'react-select';
import styles from "./../../page.module.css";
import Service from "../../api/Service";
import Header from "../../layouts/header";
import logo from './../../logo.png';
import moment from 'moment';
import { BsFillPersonPlusFill, BsTrash ,BsPencilSquare ,BsArrowRepeat } from "react-icons/bs";
import Sidebar from "../../layouts/nav";
import { Modal } from "react-bootstrap-v5";
import Swal from "sweetalert2";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import ReactSelect from 'react-select';


export default class FormManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataX: "",
            dataF: "",
            dataPerView: [ 
                {formID:''} 
            ],
            dataFormUser:[],
            viewData: [],
            optLocation:[],
            optPanelNo:[],
            refLocation:React.createRef(),
            refPanelNo:React.createRef(),
            parameters:"",
            addpopup: false,
            showpopup: false,
            editpopup: false,
            setMessageL:"",
            disabled:true,
            addStatus:'',
            setChecked:[],
            setActivityValue:'',
            valPassword:'',
            msgError:false,
            addpopup: false,
            selectedPermission: '',

          


        }
    }

    componentDidMount() {
        if (getCookie('token')) {

            this.getUserAll();
        
        } else {
            removeCookies('token', { path: '/', domain: '' }); //
            localStorage.clear();
            window.location.assign('/');
        }

    }



    getUserAll = async () => {

        await new Service().getUserAll(getCookie('token')).then(res => {
            if (res.data) {
                this.setState({
                    dataX:res.data,
                });
                console.log(res.data);
    
            } else {
                this.setState({
                    dataX:[],
                });
                console.log("Error");
            }
        });
    
        }
    
    AddUserForm = async () => {

            await new Service().getFormAll(getCookie('token')).then(res => {
                if (res.data) {
                    this.setState({
                        dataF:res.data,
                        addStatus:'',
                        addpopup:true
                    });
                    console.log(res.data);
        
                } else {
                    this.setState({
                        dataF:[]
                    });
                    console.log("Error");
                }
            });
        
    }

    addData = async () => {

            await new Service().getAddUser(getCookie('token'),this.state.valEmployeeID,this.state.valEmployeeName,this.state.valPassword,this.state.valPosition).then(res => {
                if (res.data) {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Saved Successfully.',
                        showConfirmButton: true,
                      }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            this.setState({
                                addStatus:res.data.status,
                                valEmployeeID:'',
                                valEmployeeName:'',
                                valPassword:'',
                                valPosition:'',
                                addpopup:false

                            });
                            this.getUserAll();
                            
              
                        } 
                      })
        
                } else {
                    this.setState({
                        dataF:[]
                    });
                    console.log("Error");
                }
            });
        
    }
    updateData = async (e) => {

            await new Service().getUpdateUser(getCookie('token'),e,this.state.valEmployeeName,this.state.valPosition).then(res => {
                console.log(res.data);
                if (res.data) {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Saved Successfully.',
                        showConfirmButton: true,
                      }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            this.setState({
                                addStatus:res.data.status,
                                valEmployeeName:'',
                                showpopup:false
                            });
                            this.getUserAll();
              
                        } 
                      })

        
                } else {
                    this.setState({
                        dataF:[]
                    });
                    console.log("Error");
                }
            });
        
    }
     
    getUpdateUserAccess = async (e) => {

        await new Service().getUpdateUserAccess(getCookie('token'),this.state.valEmployeeID,e).then(res => {
            if (res.data) {

                //console.log(res.data);
    
            } else {
                this.setState({
                    dataF:[]
                });
                console.log("Error");
            }
        });
    
    }
    getUserView = async (e) => {

        await new Service().getUserView(getCookie('token'),this.state.valEmployeeID,e).then(res => {
            if (res.data) {

                //console.log(res.data);
    
            } else {
                this.setState({
                    dataF:[]
                });
                console.log("Error");
            }
        });
    
    }

    getResetExpiredDate = async (e) => {

        await new Service().getResetExpiredDate(getCookie('token'),e).then(res => {
            console.log(res.data);
            if (res.data) {
                
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Reset Password Successfully.',
                    showConfirmButton: true,
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        this.getUserAll();
          
                    } 
                  })

    
            } else {
                this.setState({
                    dataF:[]
                });
                console.log("Error");
            }
        });
    
    }

    getDeleteUser = async (e) => {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Confirm Delete ?',
          showCancelButton: true,
          confirmButtonColor: '#BD1F27',
          cancelButtonColor: '#6e7881',
          confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
          if (result.isConfirmed) {
            new Service().getDeleteUser(getCookie('token'), e).then(res => {
              if (res.data) {
                this.getUserAll();
              } else {
                this.setState({
                  dataF: []
                });
                console.log("Error");
              }
            });
          }
        });
    }
    getEditUserAcsess = async (e) => {

        await new Service().getEditUserAcsess(getCookie('token'),e).then(res => {
            // console.log(res.data);
            if (res.data) {
                this.setState({
                    dataFormUser:res.data.FormAll,
                    valEmployeeName:res.data.name,
                    valPosition:res.data.position,
                    showpopup:true
                });
    
            } else {
                this.setState({
                    dataFormUser:[]
                });
                console.log("Error");
            }
        });
    
    }
    getViewUserAcsess = async (e) => {

        await new Service().getViewUserAcsess(getCookie('token'),e).then(res => {
            console.log(res.data);
            if (res.data) {
                this.setState({
                    viewData:res.data.ViewAll,
                    editpopup:true
                });
    
            } else {
                this.setState({
                    viewData:[]
                });
                console.log("Error");
            }
        });
    
    }
    CheckLength = async (event)=>{

        let e = event.target.value;

        if(e.length<6) {
            this.setState({ setMessageL:"Password 6-12 characters."});
        } else {
            this.setState({ setMessageL:""});
    
        }
    
    }
    
    onChangeEmpID = async (e) => {
        this.setState({valEmployeeID:e.target.value});
    }
    onChangeEmpName = async (e) => {
        this.setState({valEmployeeName:e.target.value});
    }
    onChangePass = async (e) => {
        this.setState({valPassword:e.target.value});
    }
    onChangePosition = async (e) => {
        this.setState({valPosition:e.target.value});
    }
    onChangeserAccess = async (e) => {
        this.setState({valFormID:e});
        this.getUpdateUserAccess(e);
    }
    onChangePermission = (selectedOption) => {
        this.setState({ selectedPermission: selectedOption });
    }
    onUserEdit = async (emp) => {
        this.setState({
            valEmployeeID: emp.employeeID,
            valEmployeeName: emp.name,
            valPosition: emp.valPosition,
            showpopup: true
        });
    };
    
    onHidePopupAdd = async () => {
        this.setState({
            showpopup:false
        });
        this.getUserAll();
    }
    onHidePopupUp = async () => {
        this.setState({
            editpopup:false
        });
        this.getUserAll();
    }
    onHidePopupEdit = async () => {
        this.setState({
            addpopup:false
        });
        this.getUserAll();
    }

    onClickShow = (key, value,form) => {
        let { dataFormUser } = this.state;
        if (value === "0") {
            dataFormUser[key].preview = "1";
            this.setState({ dataFormUser })
        } else {
            dataFormUser[key].preview = "0";
            this.setState({ dataFormUser })
        }

        //console.log(form);
        this.onChangeserAccess(form);
    }
    onClickView = async (index, active_status) => {
        let { viewData } = this.state;
        if (active_status === '0') {
          viewData[index].active_status = '1';
          this.setState({ viewData });
        } else {
          viewData[index].active_status = '0';
          this.setState({ viewData });
        }
        this.getUserView(active_status);

      }
      toggleAddUserModal = () => {
        this.setState((prevState) => ({ addpopup: !prevState.addpopup }));
    }
    
    render() {
        const permissionOptions = [
            { value: '1', label: 'User' },
            { value: '2', label: 'Manager' },
            { value: '9', label: 'Admin' }
        ];

        return (
            <>

                <div className="page-body-wrapper null sidebar-icon">
                    <Sidebar/>
                    <div className="page-body">
                        <div className="container-fluid ">
                            <div className="container-fluid">
                                <div className="page-title">
                                    <div className="row">
                                        <div className="col-6">
                                            <h3>จัดการสิทธิ์ผู้เข้าใช้งาน</h3>
                                        </div>
                                        <div className="col-6 text-right">                                         
                                        <button className="btn btn-danger" onClick={this.toggleAddUserModal} ><BsFillPersonPlusFill/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    <div className="card" id="container">
                        <div className="card-body ">

                            <div className="row col-12 m-auto">
                                <div className="col-12 col-xl-12 xl-100 box-col-12">
                                    <div className="row ">
                                        

                                        <div className="col-12 m-auto m-t-15" >
                                            <div className="table-responsive">
                                                <Table className="table-bordered " width="100%" >
                                                    <Thead className="table-danger" >
                                                        <Tr>
                                                            <Th className="align-middle text-center" scope="col" >NO.</Th>
                                                            <Th className="align-middle text-center" scope="col" >Employess ID</Th>
                                                            <Th className="align-middle text-center" scope="col" >NAME</Th>
                                                            <Th className="align-middle text-center" scope="col" >EXPRIRED DATE</Th>
                                                            <Th className="align-middle text-center" scope="col" >UPDATED DATE</Th>
                                                            <Th className="align-middle text-center" scope="col" >EDIT</Th>
                                                            <Th className="align-middle text-center" scope="col" >DELETE</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>

                                                    {
                                                        this.state.dataX ?
                                                            this.state.dataX.map((item, index) => {

                                                                return (
                                                                    
                                                                    <Tr key={index}>
                                                                        <Td className="align-middle align-center text-center">{index+1}</Td>
                                                                        <Td className="align-middle align-center text-center">{item.employeeID}</Td>
                                                                        <Td className="align-middle align-center text-center">{item.name}</Td>
                                                                        <Td className="align-middle align-center text-center">{item.expired_date}</Td>
                                                                        <Td className="align-middle align-center text-center">{
                                                                            item.updated_date ?
                                                                                item.updated_date
                                                                            : 
                                                                             '-'
                                                                        }</Td>
                                                                        <Td className="align-middle align-center text-center">
                                                                            <button className="btn p-1 text-primary" type="button" onClick={() => this.onUserEdit(item)}><BsPencilSquare className="text-dark" /></button>
                                                                        </Td>
                                                                        <Td className="align-middle align-center text-center">
                                                                        <button className="btn p-1 text-danger" type="button" onClick={(e) => this.getDeleteUser(item.employeeID)}><BsTrash className="text-dark" /></button>
                                                                        </Td>
                                                                    </Tr>
                                                                )
                                                            }) : <Tr><Td colSpan={9} style={{ textAlign: 'center' }}>No Data</Td></Tr>
                                                    }

                                                    </Tbody>
                                                </Table>

                                            </div>
                                        </div>



                                        {/* เพิ่มข้อมูล */}
                                        <Modal
                                            show={this.state.addpopup}
                                            onHide={this.toggleAddUserModal}
                                            backdrop="static"
                                            keyboard={false}
                                            centered
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>เพิ่มข้อมูล</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="col-sm-12 col-xl-12 pt-3 p-0  ">                               
                                                    <div className="form-group row mb-1 m-0">
                                                        <label className="col-5 col-form-label">Employee ID </label>
                                                        <div className="col-7 ">
                                                            <input className="form-control form-control-sm" type="text" onChange={(e) => this.onChangeEmpID(e)} value={this.state.valEmployeeID} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row mb-1 m-0">
                                                        <label className="col-5 col-form-label">Name</label>
                                                        <div className="col-7">
                                                            <input className="form-control form-control-sm" type="text" onChange={(e) => this.onChangeEmpName(e)} value={this.state.valEmployeeName} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row mb-1 m-0">
                                                        <label className="col-5 col-form-label">Position</label>
                                                        <div className="col-7">
                                                            <input className="form-control form-control-sm" type="text" onChange={(e) => this.onChangePosition(e)} value={this.state.valPosition} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row mb-1 m-0">
                                                                        <label className="col-5 col-form-label">Password</label>
                                                                        <div className="col-7">
                                                                        <input className="form-control form-control-sm" type="text" onBlur={(e)=>this.CheckLength(e)} onChange={(e)=>this.onChangePass(e)} value={this.state.valPassword} />
                                                                        <label className="text-danger f-12 mt-1">{this.state.setMessageL}</label>
                                                                        </div>
                                                    </div>
                                                    <hr/>
                                                    <div className="form-group row mb-1 m-0">
                                                        <label className="col-5 col-form-label">Permissions</label>
                                                        <div className="col-7">
                                                            <ReactSelect
                                                                placeholder="เลือกระดับสิทธิ"
                                                                isSearchable={false}
                                                                options={permissionOptions}
                                                                onChange={this.onChangePermission}
                                                                value={this.state.selectedPermission}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                {this.state.valEmployeeID && this.state.valEmployeeName && this.state.valPassword && this.state.valPassword.length >= 6 ?
                                                    <div className="form-group text-center">
                                                        <button type="button" onClick={(e) => this.addData()} className="btn btn-sm btn-danger"><i className="fa-regular fa-edit"></i>Add User</button>
                                                    </div>
                                                    : ''}
                                            </Modal.Footer>
                                        </Modal>


                                        {/* แก้ไขข้อมูล */}
                                        <Modal
                                            show={this.state.showpopup}
                                            backdrop="static"
                                            keyboard={false}
                                            strictmode="true"
                                            onHide={(e) => this.setState({ showpopup: false })}
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                        >
                                            <Modal.Header closeButton>
                                                <div className="ft-btn">
                                                    <div><strong>Edit Data </strong></div>
                                                </div>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="col-sm-12 col-xl-12 pt-3 p-0">
                                                    <div className="form-group row mb-1 m-0">
                                                        <label className="col-5 col-form-label">Employee ID </label>
                                                        <div className="col-7">
                                                            <input className="form-control form-control-sm" type="text" value={this.state.valEmployeeID} disabled={true} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row mb-1 m-0">
                                                        <label className="col-5 col-form-label">Name</label>
                                                        <div className="col-7">
                                                            <input className="form-control form-control-sm" type="text" onChange={(e) => this.onChangeEmpName(e)} value={this.state.valEmployeeName} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row mb-1 m-0">
                                                        <label className="col-5 col-form-label">Position</label>
                                                        <div className="col-7">
                                                            <input className="form-control form-control-sm" type="text" onChange={(e) => this.onChangePosition(e)} value={this.state.valPosition} />
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                    <div className="form-group row mb-1 m-0">
                                                        <label className="col-5 col-form-label">Permissions</label>
                                                        <div className="col-7">
                                                            <ReactSelect
                                                                placeholder="เลือกระดับสิทธิ"
                                                                isSearchable={false}
                                                                options={permissionOptions}
                                                                onChange={this.onChangePermission}
                                                                value={this.state.selectedPermission}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer className="text-center">
                                                <button type="button" onClick={(e) => this.updateData(this.state.valEmployeeID)} className="btn btn-sm btn-danger"><i className="fa-regular fa-edit"></i>Edit User</button>
                                            </Modal.Footer>
                                        </Modal>


                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    </div>
                </div>
            </>
        );

    }
}