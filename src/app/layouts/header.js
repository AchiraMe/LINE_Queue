"use client"
import React, { Component } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { removeCookies, getCookie } from 'cookies-next';
import Image from "next/image";
import { BsSliders2} from "react-icons/bs";


export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EmployeeCode: '',
            EmployeeDisplayName: '',
            EmplolyeeTypeCode: '',
            pathname:'',
            showSidebar:'close_icon',
        }
    }

    render() {
        return (
            <>
            <div className={"page-header" + this.state.showSidebar}>
                <div className="header-wrapper row m-0">
                <form className="form-inline search-full" action="#" method="get">
                    <div className="form-group w-100">
                    <div className="Typeahead Typeahead--twitterUsers">
                        <div className="u-posRelative">
                        <input className="demo-input Typeahead-input form-control-plaintext w-100" type="text" placeholder="Search Cuba .." name="q" title="" autofocus />
                        <div className="spinner-border Typeahead-spinner" role="status"><span className="sr-only">Loading...</span></div><i className="close-search" data-feather="x"></i>
                        </div>
                        <div className="Typeahead-menu"></div>
                    </div>
                    </div>
                </form>
                <div className="header-logo-wrapper">
                    <div className="logo-wrapper"></div>
                    <div className="toggle-sidebar"><BsSliders2/></div>
                </div>
                <div className="left-header col horizontal-wrapper pl-0"></div>
                <div className="nav-right col-8 pull-right right-header p-0">
                    <ul className="nav-menus">
                    <li className="maximize"><a className="text-dark" href="#!" onclick="javascript:toggleFullScreen()"><i data-feather="maximize"></i></a></li>
                    <li className="profile-nav onhover-dropdown p-0 mr-0">
                    <div className="media profile-media">
                  <div className="media-body"><span>User : adminDev</span>
                                      <p className="mb-0 font-roboto">Admin <i className="middle fa fa-angle-down"></i></p>
                  </div>
                </div>
                        <ul className="profile-dropdown onhover-show-div">
                        <li><a href="logout.php"><i data-feather="log-out"> </i><span>Log Out</span></a></li>
                        </ul>
                    </li>
                    </ul>
                </div>

                </div>
            </div>
            </>
        );
    }
}