import axios from 'axios';

var config = { headers: { "Accept": "application/json" } };
const Url = process.env.API_URL1;
// const Url = process.env.API_URL2;

export default class Service {
    // Get Token JWT
    gettoken = async (emp_code, emp_pass) => {
        let data = '';
        let formData = new FormData();
        formData.append("method", "tokeninfo");
        formData.append("emp_code", emp_code);
        formData.append("emp_pass", emp_pass);
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    // Get Authen
    getuserinfo = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getuserinfo");
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    // Get Permission
    getpermission = async (token, menu, url) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getpermission");
        formData.append("menu", menu);
        formData.append("url", url);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    // Reset Password
    resetPassword = async (user, pass) => {
        let data = '';
        let formData = new FormData();
        formData.append("method", "resetPassword");
        formData.append("user", user);
        formData.append("pass", pass);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getUserAll = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getUserAll");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getFormAll = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getFormAll");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getAddUser = async (token, employeeID, name, password, position) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getAddUser");
        formData.append("employeeID", employeeID);
        formData.append("name", name);
        formData.append("password", password);
        formData.append("position", position);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getUpdateUser = async (token, employeeID, name, position) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getUpdateUser");
        formData.append("employeeID", employeeID);
        formData.append("name", name);
        formData.append("position", position);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getUpdateView = async (token, employeeID, view) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getUpdateView");
        formData.append("employeeID", employeeID);
        formData.append("view", view);
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getEditUserAcsess = async (token, employeeID) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getEditUserAcsess");
        formData.append("employeeID", employeeID);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getViewUserAcsess = async (token, employeeID) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getViewUserAcsess");
        formData.append("employeeID", employeeID);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getUpdateUserAccess = async (token, employeeID, formID) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getUpdateUserAccess");
        formData.append("employeeID", employeeID);
        formData.append("formID", formID);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getUserView = async (token, employeeID, name, view) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getUserView");
        formData.append("employeeID", employeeID);
        formData.append("name", name);
        formData.append("view", view);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDeleteUser = async (token, employeeID) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDeleteUser");
        formData.append("employeeID", employeeID);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getResetExpiredDate = async (token, employeeID) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getResetExpiredDate");
        formData.append("employeeID", employeeID);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    /////GetData/////
    getDataProduct = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataProduct");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataItemMS = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataItemMS");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataGroup = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataGroup");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataProjectMS = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataProjectMS");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataLocationMS = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataLocationMS");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataCostMS = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataCostMS");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataLocationGroup = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataLocationGroup");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataUserTrello = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataUserTrello");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataListMenu = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataListMenu");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataMenu = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataMenu");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    getDataLocation = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getDataLocation");

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    /////ADDData/////
    addDataOrder = async (token, selectProject, EmployeeDisplayName, selectedMonthYear, selectLocation, costCodeType1, costCodeType2, remark, cart, customItemsList) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "addDataOrder");
        formData.append("selectProject", selectProject);
        formData.append("EmployeeDisplayName", EmployeeDisplayName);
        formData.append("selectedMonthYear", selectedMonthYear);
        formData.append("selectLocation", selectLocation);
        formData.append("costCodeType1", costCodeType1);
        formData.append("costCodeType2", costCodeType2);
        formData.append("remark", remark);
        formData.append("cart", JSON.stringify(cart));
        formData.append("customItemsList", JSON.stringify(customItemsList));
        try {
            data = await axios.post(Url, formData, config);
            return data;
        } catch (e) {
            console.error('Error posting data:', e);
            throw e;
        }
    }


    //Product
    addDataItem = async (token, SKU, Item_Code, Item_Grop, productName, description, Unit, divisionID, division, groupID, group, subGroupID, subGroup, typeID, type, classID, className, subClassID, subClass, Asset_Code_Group, Brand, imageFile) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "addDataItem");
        formData.append("SKU", SKU);
        formData.append("Item_Code", Item_Code);
        formData.append("Item_Grop", Item_Grop);
        formData.append("productName", productName);
        formData.append("description", description);
        formData.append("Unit", Unit);
        formData.append("divisionID", divisionID);
        formData.append("division", division);
        formData.append("groupID", groupID);
        formData.append("group", group);
        formData.append("subGroupID", subGroupID);
        formData.append("subGroup", subGroup);
        formData.append("typeID", typeID);
        formData.append("type", type);
        formData.append("classID", classID);
        formData.append("className", className);
        formData.append("subClassID", subClassID);
        formData.append("subClass", subClass);
        formData.append("Asset_Code_Group", Asset_Code_Group);
        formData.append("Brand", Brand);
        formData.append("imageFile", imageFile);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    updateProduct = async (token, SKU, Item_Code, Item_Name, Item_Detail, Unit, Division_ID, Division, GroupID, Group_Name, Sub_Group_ID, Sub_Group, Type_ID, Type, Class_ID, Class, Sub_Class_ID, Sub_Class, Asset_Code_Group, Brand, imageFile, Show_Default) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "updateProduct");
        formData.append("SKU", SKU);
        formData.append("Item_Code", Item_Code);
        formData.append("Item_Name", Item_Name);
        formData.append("Item_Detail", Item_Detail);
        formData.append("Unit", Unit);
        formData.append("Division_ID", Division_ID);
        formData.append("Division", Division);
        formData.append("GroupID", GroupID);
        formData.append("Group_Name", Group_Name);
        formData.append("Sub_Group_ID", Sub_Group_ID);
        formData.append("Sub_Group", Sub_Group);
        formData.append("Type_ID", Type_ID);
        formData.append("Type", Type);
        formData.append("Class_ID", Class_ID);
        formData.append("Class", Class);
        formData.append("Sub_Class_ID", Sub_Class_ID);
        formData.append("Sub_Class", Sub_Class);
        formData.append("Asset_Code_Group", Asset_Code_Group);
        formData.append("Brand", Brand);
        formData.append("imageFile", imageFile);
        formData.append("Show_Default", Show_Default);
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    //Group
    updateProductGroup = async (token, Grop_Code, Code_Type, Type, Type_Name, Grop_Name, Show_Default, imageFile) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "updateProductGroup");
        formData.append("Grop_Code", Grop_Code);
        formData.append("Code_Type", Code_Type);
        formData.append("Type", Type);
        formData.append("Type_Name", Type_Name);
        formData.append("Grop_Name", Grop_Name);
        formData.append("Show_Default", Show_Default);
        formData.append("imageFile", imageFile);
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    addDataGroup = async (token, group_code, codes_type, types, types_name, groups_name, imageFile) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "addDataGroup");
        formData.append("group_code", group_code);
        formData.append("codes_type", codes_type);
        formData.append("types", types);
        formData.append("types_name", types_name);
        formData.append("groups_name", groups_name);
        formData.append("imageFile", imageFile);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    //Location
    updateLocation = async (token, Project_Code, Locate_Code, Locate_Name, Locate_Desc, Cost_Type_CON, Cost_Type_OFF, Show_Default) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "updateLocation");
        formData.append("Project_Code", Project_Code);
        formData.append("Locate_Code", Locate_Code);
        formData.append("Locate_Name", Locate_Name);
        formData.append("Locate_Desc", Locate_Desc);
        formData.append("Cost_Type_CON", Cost_Type_CON);
        formData.append("Cost_Type_OFF", Cost_Type_OFF);
        formData.append("Show_Default", Show_Default);
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    addDataLocation = async (token, Locate_Code_add, Locate_Name_add, Locate_Desc_add, Cost_Type_CON_add, Cost_Type_OFF_add, Project_Code_add) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "addDataLocation");
        formData.append("Locate_Code_add", Locate_Code_add);
        formData.append("Locate_Name_add", Locate_Name_add);
        formData.append("Locate_Desc_add", Locate_Desc_add);
        formData.append("Cost_Type_CON_add", Cost_Type_CON_add);
        formData.append("Cost_Type_OFF_add", Cost_Type_OFF_add);
        formData.append("Project_Code_add", Project_Code_add);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    //Projact
    updateProjact = async (token, Proj_Code, Proj_Name, Proj_Desc, Show_Default) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "updateProjact");
        formData.append("Proj_Code", Proj_Code);
        formData.append("Proj_Name", Proj_Name);
        formData.append("Proj_Desc", Proj_Desc);
        formData.append("Show_Default", Show_Default);
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    addDataProjact = async (token, project_Code_add, project_Name_add, project_Desc_add) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "addDataProjact");
        formData.append("project_Code_add", project_Code_add);
        formData.append("project_Name_add", project_Name_add);
        formData.append("project_Desc_add", project_Desc_add);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    //Trello
    updateTrello = async (token, Proj_Code, Trello_Desc, API_Key, ID_Token, ID_Board, ID_List) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "updateTrello");
        formData.append("Proj_Code", Proj_Code);
        formData.append("Trello_Desc", Trello_Desc);
        formData.append("API_Key", API_Key);
        formData.append("ID_Token", ID_Token);
        formData.append("ID_Board", ID_Board);
        formData.append("ID_List", ID_List);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    addDataTrello = async (token, API_Key_add, Token_add, ID_Board_add, ID_List_add, Proj_Code_add, Trello_Desc_add) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "addDataTrello");
        formData.append("API_Key_add", API_Key_add);
        formData.append("Token_add", Token_add);
        formData.append("ID_Board_add", ID_Board_add);
        formData.append("ID_List_add", ID_List_add);
        formData.append("Proj_Code_add", Proj_Code_add);
        formData.append("Trello_Desc_add", Trello_Desc_add);

        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }


    DeleteData = async (token, Item_Code) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "DeleteData");
        formData.append("Item_Code", Item_Code);
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
}
