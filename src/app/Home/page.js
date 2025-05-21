"use client"
import React, { Component } from 'react';
import { removeCookies, getCookie } from 'cookies-next';
import Service from "../api/Service";
import Sidebar from "../layouts/nav";
import Image from "next/image";
import { Modal } from "react-bootstrap-v5";
import { Card } from 'react-bootstrap-v5';
import { Button } from 'react-bootstrap-v5';
import Select from 'react-select';
import DatePicker from "react-multi-date-picker"
import Toolbar from "react-multi-date-picker/plugins/toolbar"
import thai from "../thai"
import thai_th from "../thai_th"
import styles from './../styles/page.module.css';
import Swal from 'sweetalert2'


export default class Home extends Component {
    constructor(props) {
        super(props);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const buddhistYear = currentYear + 543;

        this.state = {
            dataB: [],
            dataM: [],
            optionlocation: [],
            optionProject: [],
            filteredData: [],
            activeTab: 'tab1',
            Robble: '',
            selectedDate: '',
            selectlocation: '',
            selectProject: '',
            remark: '',
            addPopup: false,
            cardPopup: false,
            showPopup: false,
            selectedItem: '',
            cart: [],
            quantity: 1,
            costCodeType1: '',
            costCodeType2: '',
            selectedMonthYear: '',
            months: [
                { value: '01', label: 'มกราคม' },
                { value: '02', label: 'กุมภาพันธ์' },
                { value: '03', label: 'มีนาคม' },
                { value: '04', label: 'เมษายน' },
                { value: '05', label: 'พฤษภาคม' },
                { value: '06', label: 'มิถุนายน' },
                { value: '07', label: 'กรกฎาคม' },
                { value: '08', label: 'สิงหาคม' },
                { value: '09', label: 'กันยายน' },
                { value: '10', label: 'ตุลาคม' },
                { value: '11', label: 'พฤศจิกายน' },
                { value: '12', label: 'ธันวาคม' },
            ],
            years: Array.from(new Array(10), (v, i) => {
                const year = currentYear + i;
                const buddhistYear = year + 543;
                return { value: buddhistYear.toString(), label: buddhistYear.toString() };
            }),
            currentMonth,
            currentYear,
            buddhistYear,
            API_Key: '',
            ID_Token: '',
            ID_List: '',
            isLoading: false,
            customItemsList: [], // เก็บรายการอื่นๆ ที่แยกจากตะกร้า
            customItemName: '',
            customItemQuantity: '',
            customItemUnit: ''
        };


    }

    componentDidMount() {
        if (getCookie('token')) {
            this.getDataListMenu();
            this.getDataMenu();
            this.getDataLocation();
            this.getuserinfo();
            this.getCartFromLocalStorage();
        } else {
            removeCookies('token', { path: '/', domain: '' });
            localStorage.clear();
            window.location.assign('/');
        }
    }
    getuserinfo = async () => {
        await new Service().getuserinfo(getCookie('token')).then(res => {
            // console.log(res.data);
            this.setState({
                EmployeeCode: res.data.EmployeeCode,
                EmployeeDisplayName: res.data.EmployeeDisplayName,
                EmplolyeeTypeCode: res.data.EmplolyeeTypeCode,
                EmplolyeePosition: res.data.EmplolyeePosition,
            });

        });
    }
    getDataListMenu = async () => {
        try {
            await new Service().getDataListMenu(getCookie('token')).then(res => {
                // console.log(res.data);
                if (res.data) {
                    let customHeadings = res.data.map(item => ({
                        "image": item.image,
                        "Grop_Code": item.Grop_Code,
                        "Grop_Name": item.Grop_Name,
                        "Item_Name": item.Item_Name,
                        "Grop_Type": item.Grop_Type,
                        "Unit": item.Unit,
                    }));

                    this.setState({
                        dataB: res.data,
                        filteredData: res.data,
                        data: customHeadings
                    });
                } else {
                    this.setState({
                        dataB: [],
                        filteredData: []
                    });
                }
            });
        } catch (error) {

        }
    }
    getDataMenu = async () => {
        try {
            await new Service().getDataMenu(getCookie('token')).then(res => {
                // console.log(res.data);
                if (res.data) {
                    const categoriesWithImages = res.data.map(category => ({
                        title: category.Grop_Name,
                        image: category.image_grop
                    }));

                    categoriesWithImages.unshift({
                        title: "ทั้งหมด",
                        image: "/images/1.png"
                    });

                    this.setState({
                        dataM: categoriesWithImages
                    });
                } else {
                    console.log("Error");
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
    getDataLocation = async () => {
        try {
            const res = await new Service().getDataLocation(getCookie('token'));
            console.log(res.data);

            const projectOptions = [...new Map(res.data.map(item => [item.Proj_Code, { value: item.Proj_Code, label: item.Proj_Name }])).values()];

            const locationOptions = res.data.reduce((acc, item) => {
                if (!acc[item.Proj_Code]) {
                    acc[item.Proj_Code] = [];
                }
                acc[item.Proj_Code].push({ value: item.Locate_Code, label: item.Locate_Name, Type1: item.Cost_Code_Type1, Type2: item.Cost_Code_Type2 });
                return acc;
            }, {});

            const projectAPIData = res.data.reduce((acc, item) => {
                acc[item.Proj_Code] = {
                    apiKey: item.API_Key,
                    apiToken: item.ID_Token,
                    listId: item.ID_List
                };
                return acc;
            }, {});

            this.setState({ optionProject: projectOptions, locationOptions, projectAPIData });
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    }

    validateForm = () => {
        const { selectProject, selectLocation, selectedMonthYear } = this.state;
        const errors = [];
        if (!selectProject) {
            errors.push("โครงการ");
        }
        if (!selectLocation) {
            errors.push("สถานที่");
        }
        if (!selectedMonthYear) {
            errors.push("รอบเบิกเดือน");
        }
        return errors;
    }

    OnSubmit = async (e) => {
        e.preventDefault();
        const errors = this.validateForm();
        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: `กรุณากรอกข้อมูลในช่องต่อไปนี้: ${errors.join(", ")}`,
            });
            return;
        }

        Swal.fire({
            title: 'กำลังดำเนินการ...',
            text: 'โปรดรอสักครู่',
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const { API_Key: trelloKey, ID_Token: trelloToken, ID_List: trelloListId } = this.state;
        const costCodeType1Items = this.state.cart.filter(item => item.Grop_Type == 1);
        const costCodeType2Items = this.state.cart.filter(item => item.Grop_Type == 2);
        const customItemsList = this.state.customItemsList; // ดึงรายการที่เพิ่มเอง (แยกจาก cart)
        const name = `ขอเบิกอุปกรณ์สำนักงานและอุปกรณ์สิ้นเปลืองประจำเดือน ${this.state.selectedMonthYear.label} - ${this.state.selectLocation.label}`;

        try {
            // Add Data Order
            let {
                selectProject,
                EmployeeDisplayName,
                selectedMonthYear,
                selectLocation,
                costCodeType1,
                costCodeType2,
                remark,
                cart,
                customItemsList
            } = this.state;
            // console.log('cart', cart);
            const res = await new Service().addDataOrder(
                getCookie('token'),
                selectProject.label,
                EmployeeDisplayName,
                selectedMonthYear.label,
                selectLocation.label,
                costCodeType1,
                costCodeType2,
                remark,
                cart,
                customItemsList
            );
            //หมายเลขเอกสาร: ${res.data.docNo}\n
            // Update comment with the received docNo
            const customItemsText = this.state.customItemsList.length > 0
                ? `\n\nรายการอื่นๆ เพิ่มเติม\n${this.state.customItemsList.map((item, index) => `${index + 1}. ${item.รายการ} (จำนวน: ${item.จำนวน} ${item.หน่วย})`).join('\n')}`
                : '';
            const comment = (`รายการขออนุมัติ : เบิกอุปกรณ์สำนักงานและอุปกรณ์สิ้นเปลือง\nผู้ขอ : ${this.state.EmployeeDisplayName}\nโครงการ : ${this.state.selectProject.label}\nรอบการเบิก : เดือน ${this.state.selectedMonthYear.label}\nวัตถุประสงค์ : เบิกอุปกรณ์สำนักงานและอุปกรณ์สิ้นเปลืองประจำเดือน ${this.state.selectedMonthYear.label}\nสำหรับ : ${this.state.selectLocation.label}\nหมายเหตุ : ${this.state.remark}\n\nอุปกรณ์สำนักงาน: (Cost Center : ${this.state.costCodeType1})\nรายการ\n${costCodeType1Items.map((item, index) => `${index + 1}. ${item.รายการ} (จำนวน: ${item.จำนวน} ${item.หน่วย})`).join('\n')}\n\nอุปกรณ์สิ้นเปลือง: (Cost Center : ${this.state.costCodeType2})\nรายการ\n${costCodeType2Items.map((item, index) => `${index + 1}. ${item.รายการ} (จำนวน: ${item.จำนวน} ${item.หน่วย})`).join('\n')}\n\n\n${customItemsText}`);
            const desc = '-';
            const combinedItems = [...costCodeType1Items, ...costCodeType2Items];
            const checkItems = combinedItems.map((item, index) =>
                `${index + 1}. ${item.รายการ} (จำนวน: ${item.จำนวน} ${item.หน่วย})`
            );
            const checklists = { name: 'รายการตรวจสอบ', items: checkItems };

            // Create Trello Card
            const response = await fetch('/api/card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, desc, comment, checklists, trelloKey, trelloToken, trelloListId }),
            });
            const data = await response.json();

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: `ส่งคำขออนุมัติเรียบร้อย\nหมายเลขเอกสาร: ${res.data.docNo}`,
            });

            this.setState({
                cart: [],
                customItemsList: [], // ล้างรายการอื่นๆ ที่กรอกเอง
                customItemName: '',
                customItemQuantity: '',
                customItemUnit: '',
                selectProject: null,
                selectLocation: null,
                selectedMonthYear: null,
                remark: '',
                addPopup: false
            });
            localStorage.removeItem('cart');
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'มีข้อผิดพลาดเกิดขึ้นระหว่างการขออนุมัติ',
            });
            console.error('Error:', error);
        }
    }


    handleSubmit = () => {
        const newItem = {
            ลำดับ: this.state.cart.length + 1,
            รายการ: this.state.selectedItem.Item_Name,
            จำนวน: parseFloat(this.state.quantity),
            หน่วย: this.state.selectedItem.Unit,
            Grop_Type: this.state.selectedItem.Grop_Type,
            Grop_Name: this.state.selectedItem.Grop_Name,
            Grop_Code: this.state.selectedItem.Grop_Code,
            Item_Code: this.state.selectedItem.Item_Code,
            Asset_Code_Group: this.state.selectedItem.Asset_Code_Group,
            Brand: this.state.selectedItem.Brand,
            Class_ID: this.state.selectedItem.Class_ID,
            Class_Item: this.state.selectedItem.Class_Item,
            Division: this.state.selectedItem.Division,
            Division_ID: this.state.selectedItem.Division_ID,
            GroupID: this.state.selectedItem.GroupID,
            Sub_Class: this.state.selectedItem.Sub_Class,
            Sub_Class_ID: this.state.selectedItem.Sub_Class_ID,
            Sub_Group: this.state.selectedItem.Sub_Group,
            Sub_Group_ID: this.state.selectedItem.Sub_Group_ID,
            Type_ID: this.state.selectedItem.Type_ID,
            Type_Item: this.state.selectedItem.Type_Item,
        };

        const isItemExist = this.isItemInCart(newItem);

        if (isItemExist) {
            this.setState(prevState => ({
                cart: prevState.cart.map(cartItem =>
                    cartItem.รายการ === newItem.รายการ
                        ? { ...cartItem, จำนวน: parseFloat(cartItem.จำนวน) + parseFloat(newItem.จำนวน) }
                        : cartItem
                )
            }), () => {
                this.saveCartToLocalStorage();
                this.setState({ cardPopup: false, quantity: 1 });

            });
        } else {
            this.setState(prevState => ({
                cart: [...prevState.cart, newItem]
            }), () => {
                this.saveCartToLocalStorage();
                this.setState({ cardPopup: false, quantity: 1 });

            });
        }
    }
    isItemInCart = (item) => {
        return this.state.cart.some(cartItem => cartItem.รายการ === item.รายการ);
    }
    saveCartToLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
    }
    getCartFromLocalStorage = () => {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            this.setState({ cart: JSON.parse(cartData) });
        }
    }
    handleTabChange = (tab) => {
        this.setState({ activeTab: tab }, () => {
            const tabElement = document.getElementById(tab);
            if (tabElement) {
                const yOffset = -180; // ปรับค่า offset ตามต้องการ
                const y = tabElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'instant' });
            }
        });
    }
    handleCardClick = (item) => {
        this.setState({ selectedItem: item, cardPopup: true });
    }
    handleSearch = (searchQuery) => {
        const filteredData = this.state.dataB.filter(item => item.Item_Name.includes(searchQuery));
        this.setState({ filteredData });
    }
    handleQuantityChange = (e, item) => {
        const newQuantity = e.target.value;
        const { cart } = this.state;
        const updatedCart = cart.map(cartItem => {
            if (cartItem.รายการ === item.รายการ && cartItem.Grop_Type === item.Grop_Type) {
                return { ...cartItem, จำนวน: newQuantity };
            }
            return cartItem;
        });
        this.setState({ cart: updatedCart }, () => {
            this.saveCartToLocalStorage();
        });
    }
    handleRemoveItem = (item) => {
        const updatedCart = this.state.cart.filter(cartItem => cartItem.รายการ !== item.รายการ);
        this.setState({ cart: updatedCart }, () => {
            this.saveCartToLocalStorage();
        });
    }
    handleMonthYearChange = (selectedOption) => {
        this.setState({ selectedMonthYear: selectedOption });
    }
    handleRemarkChange = (event) => {
        this.setState({ remark: event.target.value });
    }
    onChangeProject = (selectedOption) => {
        const { locationOptions, projectAPIData } = this.state;
        const { apiKey, apiToken, listId } = projectAPIData[selectedOption.value] || {};

        this.setState({
            selectProject: selectedOption,
            optionLocation: locationOptions[selectedOption.value] || [],
            selectLocation: null,
            API_Key: apiKey || '',
            ID_Token: apiToken || '',
            ID_List: listId || '',
        });
    }
    onChangeLocation = (selectedOption) => {
        const selectedLocation = this.state.optionLocation.find(loc => loc.value === selectedOption.value);
        this.setState({
            selectLocation: selectedOption,
            costCodeType1: selectedLocation ? selectedLocation.Type1 : null,
            costCodeType2: selectedLocation ? selectedLocation.Type2 : null
        });
    }
    calculateTotalQuantity = () => {
        return this.state.cart.reduce((total, item) => total + parseFloat(item.จำนวน), 0);
    }
    handleAddCustomItem = () => {
        const { customItemName, customItemQuantity, customItemUnit, customItemsList } = this.state;

        if (customItemName && customItemQuantity && customItemUnit) {
            const newItem = {
                รายการ: customItemName,
                จำนวน: parseFloat(customItemQuantity), // แปลงเป็นตัวเลข
                หน่วย: customItemUnit
            };

            this.setState({
                customItemsList: [...customItemsList, newItem], // เพิ่มเข้า customItemsList
                customItemName: '',
                customItemQuantity: '',
                customItemUnit: ''
            });
        } else {
            Swal.fire('โปรดกรอกข้อมูลให้ครบทุกช่อง', '', 'warning');
        }
    };


    handleRemoveCustomItem = (index) => {
        this.setState(prevState => ({
            customItemsList: prevState.customItemsList.filter((_, i) => i !== index)
        }));
    };

    handleEditCustomItem = (index, field, value) => {
        this.setState(prevState => {
            const updatedCustomItemsList = [...prevState.customItemsList];
            updatedCustomItemsList[index] = { ...updatedCustomItemsList[index], [field]: value };
            return { customItemsList: updatedCustomItemsList };
        });
    };



    render() {
        const { activeTab, months, buddhistYear, selectedMonthYear, currentMonth, currentYear } = this.state;
        const monthYearOptions = [];
        for (let i = 0; i <= 6; i++) {
            let monthValue = (currentMonth + i) % 12;
            let yearOffset = Math.floor((currentMonth + i) / 12);
            let year = buddhistYear + yearOffset;

            if (monthValue === 0) {
                monthValue = 12; // ตั้งค่าเดือนเป็นธันวาคมเมื่อค่า mod เป็น 0
                year -= 1; // ลดปีลง 1 เมื่อเดือนเป็นธันวาคม
            }

            monthYearOptions.push({
                value: `${monthValue.toString().padStart(2, '0')}-${year}`,
                label: `${months[monthValue - 1].label} ${year}`
            });
        }






        return (
            <>

                <style>
                    {`
                    .nav-tabs {
                        border-bottom: none;
                    }
                    .nav-tabs .nav-link.active {
                        color: #fff;
                        background-color: #95191F;
                        border-color: #95191F;
                    }
                    .nav-tabs .nav-link:not(.active) {
                        color: #6c757d;
                        background-color: #f8f9fa;
                    }
                    .form-inline {
                        display: flex;
                        align-items: right;
                    }
                    .form-control {
                        margin-right: 10px;
                    }
                    .fixed-cart-button {
                        position: fixed;
                        top: 90px;
                        right: 30px;
                        z-index: 999;
                      }
                      
                    .fixed-cart-button .btn {
                        width: 60px;
                        height: 60px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 0;
                        background-color: #95191F; 
                        border: none; 
                      }
                      
                    .custom-cart-icon {
                        width: 24px; 
                        height: 24px; 
                    }
                    .badge-custom {
                        position: absolute;
                        top: 10px; 
                        right: 15px; 
                        transform: translate(50%, -50%); 
                        background-color: #dc3545; 
                        color: white; 
                        padding: 5px 10px; 
                        border-radius: 50%; 
                        font-size: 0.75rem; 
                      }
                      

                    /* Media queries */
                    @media (max-width: 768px) {
                        .card {
                            margin: 0.3rem;
                        }
                    }
                    @media (min-width: 769px) {
                        .card {
                            margin: 0.4rem;
                        }
                    }
           
                    .btn-mandp {
                        background-color: transparent;
                        color: red;
                        font-size: 40px;
                        transition: color 0.3s; /* เพิ่มเอฟเฟค transition ให้กับการเปลี่ยนสี */

                      }
                      .btn-mandp:hover {
                        color: red; /* เปลี่ยนสีตัวหนังสือเป็นสีแดงเมื่อ hover */
                      }
                      
                      .btn-mandp:not(:hover) {
                        color: black; /* เปลี่ยนสีตัวหนังสือเป็นสีดำเมื่อไม่ hover */
                      }
                    @media (max-width: 1200px) {
                        .modal-90w {
                            max-width: 80%;
                        }
                    }
                    @media (max-width: 500px) {
                        .modal-90w {
                            max-width: 100%;
                        }
                    }

                      
                      
                `}
                </style>
                <div className="page-body-wrapper null sidebar-icon">
                    <Sidebar />
                    <div className="page-body">
                        <div className="fixed-cart-button">
                            <button
                                type="button"
                                className="btn rounded-circle position-relative"
                                onClick={(e) => this.setState({ addPopup: true })}
                            >
                                <img src="/images/cart.png" alt="Shopping Cart" className="custom-cart-icon" />
                                {this.calculateTotalQuantity() > 0 && (
                                    <span className="badge-custom">
                                        {this.calculateTotalQuantity()}
                                    </span>
                                )}
                            </button>
                        </div>
                        <div className="card" id="container" style={{ backgroundColor: '#f6f6f6' }}>
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="container-fluid">
                                        <div className="page-title">
                                            <div className="row">
                                                <div className="col-8">
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 row m-auto p-0 d-flex flex-wrap">
                                                {this.state.dataM.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <div className={styles.cardcontainer} onClick={() => this.handleTabChange(`tab${index + 1}`)} style={{ cursor: 'pointer' }}>
                                                            <Card className={styles.customCard}>
                                                                <Card.Img className={styles.cardImage} variant="top" src={item.image} alt="1" />
                                                                <Card.Body className={styles.cardBody}>
                                                                    <Card.Text>
                                                                        <label className={styles.mitrregular}>{item.title}</label>
                                                                    </Card.Text>
                                                                </Card.Body>
                                                            </Card>
                                                        </div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card" id="container">
                            <div className="card-body">
                                <div className="d-flex justify-content-end">
                                    <div className="col-md-3 col-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="ค้นหา..."
                                            onChange={(e) => this.handleSearch(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card" id="container" style={{ backgroundColor: '#f6f6f6' }} >
                            <div className="card-body">
                                <div className="tab-content">
                                    <div id="tab1" className={`tab-pane fade ${activeTab === 'tab1' ? 'show active' : ''}`}>
                                        <h1 className={styles.texthead}>ทั้งหมด</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData.map((item, index) => (
                                                item.image && (
                                                    <React.Fragment key={index}>
                                                        <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                            <Card className={styles.customCardlist}>
                                                                <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                <Card.Body className={styles.cardBody}>
                                                                    <Card.Text>
                                                                        <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                    </Card.Text>
                                                                </Card.Body>
                                                            </Card>
                                                        </div>
                                                    </React.Fragment>
                                                )
                                            ))}
                                        </div>
                                    </div>

                                    <div className={`tab-pane fade ${activeTab === 'tab2' ? 'show active' : ''}`} id="tab2">
                                        <h1 className={styles.texthead}>กระดาษ</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G001')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab3' ? 'show active' : ''}`} id="tab3">
                                        <h1 className={styles.texthead}>ซองเอกสาร</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G002')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab4' ? 'show active' : ''}`} id="tab4">
                                        <h1 className={styles.texthead}>เครื่องเขียน</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G003')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab5' ? 'show active' : ''}`} id="tab5">
                                        <h1 className={styles.texthead}>สมุด</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G004')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab6' ? 'show active' : ''}`} id="tab6">
                                        <h1 className={styles.texthead}>กาว</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G005')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab7' ? 'show active' : ''}`} id="tab7">
                                        <h1 className={styles.texthead}>แฟ้ม&อุปกรณ์เข้าเล่ม</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G006')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab8' ? 'show active' : ''}`} id="tab8">
                                        <h1 className={styles.texthead}>อุปกรณ์ตัด</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G007')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab9' ? 'show active' : ''}`} id="tab9">
                                        <h1 className={styles.texthead}>อุปกรณ์สำนักงานเบ็ดเตล็ด</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G008')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab10' ? 'show active' : ''}`} id="tab10">
                                        <h1 className={styles.texthead}>แท่นประทับตรา</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G009')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab11' ? 'show active' : ''}`} id="tab11">
                                        <h1 className={styles.texthead}>หมึกเติมตรายางหมึกในตัว</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G010')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab12' ? 'show active' : ''}`} id="tab12">
                                        <h1 className={styles.texthead}>อุปกรณ์ทำความสะอาด</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G011')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab13' ? 'show active' : ''}`} id="tab13">
                                        <h1 className={styles.texthead}>ผลิตภัณฑ์ทำความสะอาด</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G012')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab14' ? 'show active' : ''}`} id="tab14">
                                        <h1 className={styles.texthead}>ถุงขยะและกระดาษทิชชู่</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G013')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab15' ? 'show active' : ''}`} id="tab15">
                                        <h1 className={styles.texthead}>ถ่าน</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G014')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab16' ? 'show active' : ''}`} id="tab16">
                                        <h1 className={styles.texthead}>ยา</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G015')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab17' ? 'show active' : ''}`} id="tab17">
                                        <h1 className={styles.texthead}>น้ำดื่ม</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G016')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab18' ? 'show active' : ''}`} id="tab18">
                                        <h1 className={styles.texthead}>อาหารและเครื่องดื่ม</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G017')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                    <div className={`tab-pane fade ${activeTab === 'tab19' ? 'show active' : ''}`} id="tab19">
                                        <h1 className={styles.texthead}>กาว</h1>
                                        <hr />
                                        <div className="col-12 col-sm-12 row m-auto p-0" style={{ justifyContent: "lelf" }}>
                                            {this.state.filteredData && this.state.filteredData
                                                .filter(item => item.Grop_Code === 'G018')
                                                .map((item, index) => (
                                                    item.image && (
                                                        <React.Fragment key={index}>
                                                            <div className={styles.cardcontainer} style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(item)}>
                                                                <Card className={styles.customCardlist}>
                                                                    <Card.Img className={styles.cardImagelist} variant="top" src={item.image} alt='1' />
                                                                    <Card.Body>
                                                                        <Card.Text>
                                                                            <label className={styles.textlabel}>{item.Item_Name}</label>
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ตะกร้า */}
                <Modal
                    size='xl'
                    style={{ fontSize: '16px' }}
                    show={this.state.addPopup}
                    onHide={() => this.setState({ addPopup: false })}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <Modal.Header closeButton>
                        <Modal.Title className={styles.textlabelshop} id="example-custom-modal-styling-title">
                            ตะกร้า
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card" style={{ backgroundColor: '#95191F' }}>
                            <div className="card-body">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-6">
                                            {/* โครงการ */}
                                            <div className="form-group">
                                                <label className={styles.textlabelcart}>โครงการ <span className="text-white">*</span></label>
                                                <Select
                                                    className={styles.formcontrol}
                                                    options={this.state.optionProject}
                                                    value={this.state.selectProject}
                                                    onChange={this.onChangeProject}
                                                    placeholder="กรุณาเลือกโครงการ"
                                                    isSearchable={false}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className={styles.textlabelcart}>สถานที่ <span className="text-white">*</span></label>
                                                <Select
                                                    className={styles.formcontrol}
                                                    options={this.state.optionLocation}
                                                    value={this.state.selectLocation}
                                                    onChange={this.onChangeLocation}
                                                    placeholder="กรุณาเลือกสถานที่"
                                                    isDisabled={!this.state.selectProject}
                                                    isSearchable={false}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className={styles.textlabelcart}>รอบเบิกเดือน <span className="text-white">*</span></label>
                                                <Select
                                                    className={styles.formcontrol}
                                                    options={monthYearOptions}
                                                    value={selectedMonthYear}
                                                    onChange={this.handleMonthYearChange}
                                                    placeholder="เลือกเดือนและปี"
                                                    isSearchable={false}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <div className="form-group">
                                                <label className={styles.textlabelcart}>หมายเหตุ</label>
                                                <textarea
                                                    className={styles.formcontrol}
                                                    rows="3"
                                                    style={{ resize: "none" }}
                                                    value={this.state.remark}
                                                    onChange={this.handleRemarkChange}
                                                ></textarea>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container mt-4">
                            <label className={styles.textlabel}>
                                อุปกรณ์สำนักงาน {this.state.costCodeType1 && <span>(Cost Center: {this.state.costCodeType1})</span>}
                            </label>
                        </div>
                        <div className="container mt-4">
                            <table className="table table-bordered table-rounded">
                                <thead style={{ backgroundColor: '#95191F', color: 'white' }}>
                                    <tr>
                                        <th className={styles.textlabel} scope="col" style={{ width: '1%', color: 'white' }}>ลำดับ</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '80%', textAlign: 'center', color: 'white' }}>รายการ</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '10%', textAlign: 'center', color: 'white' }}>จำนวน</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '10%', textAlign: 'center', color: 'white' }}>หน่วย</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '10%', color: 'white' }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.cart
                                        .filter(item => parseInt(item.Grop_Type) === 1)
                                        .map((item, index) => (
                                            <tr key={item.รายการ}>
                                                <td className={styles.textlabel}>{index + 1}</td>
                                                <td className={styles.textlabel}>{item.รายการ}</td>
                                                <td>
                                                    <input
                                                        className={styles.formcontrol}
                                                        type="number"
                                                        value={item.จำนวน}
                                                        onChange={(e) => this.handleQuantityChange(e, item)}
                                                    />
                                                </td>
                                                <td className={styles.textlabel}>{item.หน่วย}</td>
                                                <td>
                                                    <button className="btn btn-danger" onClick={() => this.handleRemoveItem(item)}>
                                                        ลบ
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="container mt-4">
                            <label className={styles.textlabel}>
                                อุปกรณ์สิ้นเปลือง {this.state.costCodeType2 && <span>(Cost Center: {this.state.costCodeType2})</span>}
                            </label>
                        </div>
                        <div className="container mt-4">
                            <table className="table table-bordered">
                                <thead style={{ backgroundColor: '#95191F', color: 'white' }}>
                                    <tr>
                                        <th className={styles.textlabel} scope="col" style={{ width: '1%', color: 'white' }}>ลำดับ</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '80%', textAlign: 'center', color: 'white' }}>รายการ</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '10%', textAlign: 'center', color: 'white' }}>จำนวน</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '10%', textAlign: 'center', color: 'white' }}>หน่วย</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '10%', color: 'white' }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.cart
                                        .filter(item => parseInt(item.Grop_Type) === 2)
                                        .map((item, index) => (
                                            <tr key={item.รายการ}>
                                                <td className={styles.textlabel}>{index + 1}</td>
                                                <td className={styles.textlabel}>{item.รายการ}</td>
                                                <td>
                                                    <input
                                                        className={styles.formcontrol}
                                                        type="number"
                                                        value={item.จำนวน}
                                                        onChange={(e) => this.handleQuantityChange(e, item)}
                                                    />
                                                </td>
                                                <td className={styles.textlabel}>{item.หน่วย}</td>
                                                <td>
                                                    <button className="btn btn-danger" onClick={() => this.handleRemoveItem(item)}>
                                                        ลบ
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ฟอร์มกรอกข้อมูล "รายการอื่นๆ เพิ่มเติม" */}
                        <div className="container mt-4">
                            <label className={styles.textlabel}>รายการอื่นๆ เพิ่มเติม</label>
                            <div className="row">
                                <div className="col-md-5">
                                    <input
                                        type="text"
                                        className={styles.formcontrol}
                                        placeholder="ชื่อรายการ"
                                        value={this.state.customItemName}
                                        onChange={(e) => this.setState({ customItemName: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="number"
                                        className={styles.formcontrol}
                                        placeholder="จำนวน"
                                        value={this.state.customItemQuantity}
                                        onChange={(e) => this.setState({ customItemQuantity: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        className={styles.formcontrol}
                                        placeholder="หน่วย"
                                        value={this.state.customItemUnit}
                                        onChange={(e) => this.setState({ customItemUnit: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-1">
                                    <button className="btn btn-success" onClick={this.handleAddCustomItem}>เพิ่ม</button>
                                </div>
                            </div>
                        </div>

                        {/* แสดง "รายการอื่นๆ" ในตาราง */}
                        <div className="container mt-4">
                            <table className="table table-bordered">
                                <thead style={{ backgroundColor: '#95191F', color: 'white' }}>
                                    <tr>
                                        <th className={styles.textlabel} scope="col" style={{ width: '1%', color: 'white' }}>ลำดับ</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '70%', textAlign: 'center', color: 'white' }}>รายการ</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '10%', textAlign: 'center', color: 'white' }}>จำนวน</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '10%', textAlign: 'center', color: 'white' }}>หน่วย</th>
                                        <th className={styles.textlabel} scope="col" style={{ width: '10%', color: 'white' }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.customItemsList.map((item, index) => (
                                        <tr key={index}>
                                            <td className={styles.textlabel}>{index + 1}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.formcontrol}
                                                    value={item.รายการ}
                                                    onChange={(e) => this.handleEditCustomItem(index, "รายการ", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className={styles.formcontrol}
                                                    value={item.จำนวน}
                                                    onChange={(e) => this.handleEditCustomItem(index, "จำนวน", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className={styles.formcontrol}
                                                    value={item.หน่วย}
                                                    onChange={(e) => this.handleEditCustomItem(index, "หน่วย", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-danger" onClick={() => this.handleRemoveCustomItem(index)}>ลบ</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>



                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                        <button
                            className="btn btn-light"
                            onClick={() => {
                                Swal.fire({
                                    title: "คุณต้องการลบรายการทั้งหมด ?",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#28a745",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "ลบ",
                                    cancelButtonText: "ยกเลิก"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        this.setState({ cart: [] });
                                        localStorage.removeItem('cart');
                                        Swal.fire({
                                            title: "ลบเรียบร้อย!",
                                            icon: "success"
                                        });
                                    }
                                });
                            }}
                        >
                            ลบรายการทั้งหมด
                        </button>

                        <button className="btn btn-danger" onClick={this.OnSubmit}>ขออนุมัติ</button>
                        {/* <button className="btn btn-success" onClick={this.submitForm}>Submit</button> */}

                    </Modal.Footer>
                </Modal>

                {/* สินค้า*/}
                <Modal
                    style={{ fontSize: '16px' }}
                    show={this.state.cardPopup}
                    onHide={() => this.setState({ cardPopup: false })}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title className={styles.textlabelshop} id="example-custom-modal-styling-title">
                            สินค้า
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ textAlign: 'center' }}>
                        {this.state.selectedItem && (
                            <div>
                                <Image src={this.state.selectedItem.image} alt='1' width={170} height={170} />
                                <form style={{ textAlign: 'center' }}>
                                    <div className="form-group">
                                        <h5 className={styles.textlabelshop} style={{ marginTop: '10px' }}>{this.state.selectedItem.Item_Name}</h5>
                                    </div>
                                    <div className="form-group">
                                        <div className="row justify-content-center align-items-center">
                                            <div className="col-3">
                                                <button
                                                    type="button"
                                                    aria-hidden="false"
                                                    className="btn btn-mandp"
                                                    onClick={() => this.setState((prevState) => ({
                                                        quantity: prevState.quantity > 1 ? prevState.quantity - 1 : 1
                                                    }))}
                                                >
                                                    -
                                                </button>
                                            </div>
                                            <div className="col-4">
                                                <input
                                                    type="number"
                                                    className={styles.formcontrol}
                                                    style={{ textAlign: 'center' }}
                                                    size="lg"
                                                    value={this.state.quantity}
                                                    onChange={(e) => this.setState({
                                                        quantity: Math.max(1, parseInt(e.target.value) || 1)
                                                    })}
                                                    min="1"
                                                />
                                            </div>

                                            <div className="col-3">
                                                <button type="button" className="btn btn-mandp" onClick={() => this.setState({ quantity: this.state.quantity + 1 })}>+</button>
                                            </div>
                                        </div>
                                    </div>


                                </form>

                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                        <button style={{ backgroundColor: '#95191F' }} className="btn" onClick={this.handleSubmit}>ตกลง</button>
                    </Modal.Footer>
                </Modal>




            </>
        );
    }
}
