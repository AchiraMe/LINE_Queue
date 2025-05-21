"use client"
import React, { Component } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { removeCookies, getCookie, setCookie } from 'cookies-next';
import Image from "next/image";
import LogoHeader from '../images/logoheader.png';
import { BsFillPeopleFill , BsFillHouseDoorFill, BsFillFileEarmarkTextFill, BsFillClipboard2PlusFill , BsSliders ,BsSliders2,BsBagFill, BsFileEarmarkCheckFill ,BsFillHouseFill,BsBasket  } from "react-icons/bs";
import logo from './../logo.png';
import Service from "./../api/Service";



export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EmployeeCode: '',
            EmployeeDisplayName: '',
            EmplolyeeTypeCode: '',
            pathname:'',
            closeIcon:true,
            navActive:"",
            dataM:[],
            currentPath: [],

        }
    }

    componentDidMount() {
        if (getCookie('token')) {

            let menu = window.location.pathname.split('/')[1];
            let url = window.location.pathname.split('/')[2];
            let pathParts = window.location.pathname.split('/').filter(part => part !== '');

            this.setState({ currentPath: pathParts });
            this.getuserinfo();
            this.setState({ navActive:window.location.pathname.split('/')[1]});

            if(url) {
                //this.getpermission(menu,url);
            }
        
        } else {
            removeCookies('token', { path: '/', domain: '' }); //
            localStorage.clear();
            window.location.assign('/');
        }

    }

    toggleSidebar = (e) => {

        if(e===true){
            this.setState({
                closeIcon:false
            })
        } else {
            this.setState({
                closeIcon:true
            })
        }
    }

    getpermission = async (menu,url) => {
        await new Service().getpermission(getCookie('token'),menu,url).then(res => {
            
            //console.log(res.data.status);
            if(res.data.status==0) {
                removeCookies('token', { path: '/', domain: '' }); //
                localStorage.clear();
                window.location.assign('/');
            }
            
        });
    }

    getuserinfo = async () => {
        await new Service().getuserinfo(getCookie('token')).then(res => {
            //console.log(res.data);
            this.setState({
                EmployeeCode: res.data.EmployeeCode,
                EmployeeDisplayName: res.data.EmployeeDisplayName,
                EmplolyeeTypeCode: res.data.EmplolyeeTypeCode,
                EmplolyeePosition: res.data.EmplolyeePosition,
            });

        });
    }

    logOut = () => {
        Swal.fire({
            title: 'Confirm log out of your account?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Log Out'
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookies('token', { path: '/', domain: '' }); //
                localStorage.clear();
                window.location.assign('/');
            }
        });
    }



    render() {
        const isHomePage = this.state.currentPath.length === 1 && this.state.currentPath[0] === 'Home';

        return (
            <>
                                <style>
                        {`
                            .breadcrumb {
                                background-color: #fff;
                                padding: 10px;
                              }
                                @media (min-width: 768px) {
                                .back-btn {
                                    display: none;
                                }
                            }
                        `}
                    </style>
            <div className={`page-header ${this.state.closeIcon===true ? 'close_icon' : ''} `}>
                <div className="header-wrapper row m-0">
                    <form className="form-inline search-full" action="#" method="get">
                        <div className="form-group w-100">
                            <div className="Typeahead Typeahead--twitterUsers">
                                <div className="u-posRelative"> </div>
                                <div className="Typeahead-menu"></div>
                            </div>
                        </div>
                    </form>
                    <div className="header-logo-wrapper">
                        <div className="logo-wrapper"></div>
                        <div className="toggle-sidebar" onClick={() => this.toggleSidebar(this.state.closeIcon)} >MENU <i className="fa fa-angle-right"></i></div>
                    </div>
                    {!isHomePage && (
                <div className="breadcrumb">
                    {this.state.currentPath.map((part, index) => (
                        <span key={index}>
                            <Link href={`/${this.state.currentPath.slice(0, index + 1).join('/')}`}>{part}</Link>
                            {index < this.state.currentPath.length - 1 && ' > '}
                        </span>
                    ))}
                </div>
            )}
                    <div className="left-header col horizontal-wrapper pl-0"></div>
                    <div className="nav-right col-8 pull-right right-header p-0">
                        <ul className="nav-menus">
                            <li className="profile-nav onhover-dropdown p-0 mr-3">
                            <span>User : {this.state.EmployeeDisplayName}</span>
                            </li>
                            <li className="profile-nav onhover-dropdown p-0 mr-0">
                            <div className="media profile-media">
                                <div className="media-body">
                                <div className="row text-right">
                                    <span className="col-12 mt-0" onClick={() => this.logOut()}>LOGOUT</span>
                                </div>
                                </div>
                            </div>
                            </li>


                        </ul>
                        </div>

                </div>
            </div>

            <div className={`sidebar-wrapper ${this.state.closeIcon===true ? 'close_icon' : ''} `}>
                <div className="logo-wrapper">
                    <a href="#">
                    <Image
                    src={LogoHeader}
                    height={30}
                    alt="Unique Engineering"
                    priority={true}
                    />
                    </a>
                    <div className="back-btn" onClick={() => this.toggleSidebar(this.state.closeIcon)}><BsSliders className="h4" /></div>
                    <div className="toggle-sidebar" onClick={() => this.toggleSidebar(this.state.closeIcon)} ><BsSliders className="h4" /></div>
                </div>
                <div className="logo-icon-wrapper">
                    <a href="#">
                        <Image
                        src={logo}
                        height={30}
                        alt="Unique Engineering"
                        priority={true}
                        />

                    </a>
                </div>
                <nav className={"sidebar-main "+ this.state.showSidebar}>
                    <div className="left-arrow" id="left-arrow"><i data-feather="arrow-left"></i></div>
                    <div id="sidebar-menu">
                    <ul className="sidebar-links custom-scrollbar">
                        <li className="back-btn" ><a href="#"></a>
                        <div className="mobile-back text-right"><span>Back</span><i className="fa fa-angle-right pl-2" aria-hidden="true"></i></div>
                        </li>

                   
                        <li className="sidebar-list"><Link className={`sidebar-link sidebar-title link-nav h6 ${this.state.navActive==="Home" ? 'active' : ''} `} href="/Home"><BsBasket/><span>Shop</span></Link></li>
                        {
                            this.state.EmplolyeeTypeCode==2 ?
                            <li className="sidebar-list"><Link className={`sidebar-link sidebar-title link-nav h6 ${this.state.navActive==="Manage" ? 'active' : ''} `} href="/Manage"><BsFillFileEarmarkTextFill  /><span>จัดการข้อมูล</span></Link></li>
                            :
                                ''
                        }
                        {
                            this.state.EmplolyeeTypeCode==9 ?
                                <li className="sidebar-list"><Link className={`sidebar-link sidebar-title link-nav h6 ${this.state.navActive==="backend" ? 'active' : ''} `} href="/backend/users"><BsFillPeopleFill  /><span>จัดการสิทธิ์</span></Link></li>
                            :
                                ''
                        }
                    </ul>
                    
                    </div>
                    <div className="right-arrow" id="right-arrow"><i data-feather="arrow-right"></i></div>
                </nav>
            </div>
            </>
        );
    }
}