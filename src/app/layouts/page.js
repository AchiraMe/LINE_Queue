"use client"
import React, { Component } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { removeCookies, getCookie } from 'cookies-next';
// import Service from './../../api/Service';


export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EmployeeCode: '',
            EmployeeDisplayName: '',
            EmplolyeeTypeCode: '',
            pathname:'',
        }
    }
    // componentDidMount(){
    //     if (getCookie('token')) {

    //     }else{
    //         removeCookies('token', { path: '/', domain: '' }); //
    //         localStorage.clear();
    //         window.location.assign('/');
    //     }
    // }
    render() {
        return (
            <>
                <div className="card">
                    <div className="card-header">
                        <div className="row vh-100">

                            <ul className="sidebar-menu">
                                <li><h5>รายการ</h5></li>
                                <li>
                                    <Link href="/components/editdata/group">ข้อมูลกลุ่ม</Link>
                                </li>
                                <li>
                                    <Link href="/components/editdata/project">ข้อมูลโครงการ</Link>
                                </li>
                                <li>
                                    <Link href="/components/editdata/department">ข้อมูลแผนก</Link>
                                </li>
                                <li>
                                    <Link href="/components/editdata/activity">ข้อมูลกิจกรรม</Link>
                                </li>
                                <li>
                                    <Link href="/components/editdata/mapgroup">จัดการกลุ่มกิจกรรม</Link>
                                </li>
                                <li>
                                    <Link href="/components/editdata/">ข้อมูลพนักงาน</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </>
        );
    }
}