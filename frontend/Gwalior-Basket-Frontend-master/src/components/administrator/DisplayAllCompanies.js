import { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { getData, postData, ServerURL } from "../services/ServerServices";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Switch,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Swal from "sweetalert2";
import { useStyles } from "./DisplayAllCompaniesCss";

export default function DisplayAllCompanies() {
  var classes = useStyles();
  var navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [btnStatus, setBtnStatus] = useState(false);
  const [oldPicture, setOldPicture] = useState("");

  const [companyLogo, setCompanyLogo] = useState({
    fileName: "/assets/watermark.png",
    bytes: "",
  });
  const [message, setMessage] = useState("");

  const fetchAllStates = async () => {
    var result = await getData("statecity/fetch_all_states");
    setStates(result.data);
  };
  useEffect(function () {
    fetchAllStates();
  }, []);

  const handleImage = (event) => {
    setCompanyLogo({
      fileName: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
    setBtnStatus(true);
  };

  const fillStates = () => {
    return states.map((item) => {
      return <MenuItem value={item.stateid}>{item.statename}</MenuItem>;
    });
  };

  const fetch_all_cities = async (stateid) => {
    var body = { stateid: stateid };
    var result = await postData("statecity/fetch_all_cities", body);
    setCities(result.data);
  };

  const fillCities = () => {
    return cities.map((item) => {
      return <MenuItem value={item.cityid}>{item.cityname}</MenuItem>;
    });
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
    fetch_all_cities(event.target.value);
  };
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleOpenDialog = (rowData) => {
    fetch_all_cities(rowData.state);
    setCompanyId(rowData.companyid);
    setCompanyName(rowData.companyname);
    setOwnerName(rowData.ownername);
    setEmailAddress(rowData.emailaddress);
    setMobileNumber(rowData.mobilenumber);
    setAddress(rowData.address);
    setState(rowData.state);
    setCity(rowData.city);
    setStatus(rowData.status);

    setCompanyLogo({
      fileName: `${ServerURL}/images/${rowData.logo}`,
      bytes: "",
    });

    setOldPicture(rowData.logo);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStatus = (temp) => {
    if (temp === "Pending") {
      setStatus("Verified");
    }
    if (temp === "Verified") {
      setStatus("Pending");
    }
  };

  const handleEditData = async () => {
    var cd = new Date();

    var dd =
      cd.getFullYear() +
      "/" +
      (cd.getMonth() + 1) +
      "/" +
      cd.getDate() +
      " " +
      cd.getHours() +
      ":" +
      cd.getMinutes() +
      ":" +
      cd.getSeconds();

    var body = {
      companyid: companyId,
      companyname: companyName,
      ownername: ownerName,
      emailaddress: emailAddress,
      mobilenumber: mobileNumber,
      address: address,
      state: state,
      city: city,
      updateat: dd,
      createdby: "ADMIN",
      status: status,
    };

    var result = await postData("company/edit_company_data", body);

    if (result.status) {
      setOpen(false);
      Swal.fire({
        icon: "success",
        title: result.message,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: result.message,
      });
    }

    fetchAllCompanies();
  };

  const handleCancel = () => {
    setCompanyLogo({
      fileName: `${ServerURL}/images/${oldPicture}`,
      bytes: "",
    });
    setOldPicture("");
    setBtnStatus(false);
    setMessage("");
  };

  const handleDelete = async (rowData) => {
    setOpen(false);

    Swal.fire({
      title: "Do you want to delete company?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var res = await postData("company/delete_company_data", {
          companyid: rowData.companyid,
        });

        if (res.status) {
          Swal.fire("Deleted!", "", "Success");
          fetchAllCompanies();
        } else
          Swal.fire({
            icon: "error",
            title: result.message,
          });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handleSaveLogo = async () => {
    var formData = new FormData();

    formData.append("companyid", companyId);
    formData.append("logo", companyLogo.bytes);

    var result = await postData("company/edit_company_logo", formData);

    if (result.status) {
      setMessage("assets/tick.gif");
    } else {
      setMessage("");
    }

    fetchAllCompanies();
    setBtnStatus(false);
  };

  const PictureButton = () => {
    return (
      <div>
        {btnStatus ? (
          <div style={{ display: "flex", padding: 10 }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSaveLogo}>Save</Button>
          </div>
        ) : (
          <div style={{ fontSize: 20, color: "green", fontWeight: "bold" }}>
            <img src={`${message}`} alt={`${message}`} width="60" />
          </div>
        )}
      </div>
    );
  };

  const showCompanyDetails = () => {
    return (
      <div>
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src="/assets/logo.png" alt="/assets/logo.png" width="40" />
              Edit Company
            </div>
            <div>
              <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
            </div>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ marginTop: 5 }}>
              <Grid item xs={6}>
                <TextField
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  fullWidth
                  label="Company Name"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={ownerName}
                  fullWidth
                  onChange={(event) => setOwnerName(event.target.value)}
                  label="Owner Name"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  value={emailAddress}
                  fullWidth
                  onChange={(event) => setEmailAddress(event.target.value)}
                  label="Email Address"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={mobileNumber}
                  fullWidth
                  onChange={(event) => setMobileNumber(event.target.value)}
                  label="Mobile Number"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  value={address}
                  fullWidth
                  onChange={(event) => setAddress(event.target.value)}
                  label="Address"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">State</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={state}
                    label="State"
                    onChange={handleStateChange}
                  >
                    <MenuItem value={"Choose State..."}>
                      Choose State...
                    </MenuItem>
                    {fillStates()}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={city}
                    label="City"
                    onChange={handleCityChange}
                  >
                    <MenuItem value={"Choose City..."}>Choose City...</MenuItem>
                    {fillCities()}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {status === "Pending" ? (
                  <Switch onChange={() => handleStatus(status)} />
                ) : (
                  <Switch
                    onChange={() => handleStatus(status)}
                    defaultChecked
                  />
                )}
                {status}
              </Grid>

              <Grid item xs={6} className={classes.rowStyle}>
                <IconButton
                  fullWidth
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImage}
                  />
                  <PhotoCamera />
                </IconButton>

                <Avatar
                  alt="Remy Sharp"
                  variant="rounded"
                  src={companyLogo.fileName}
                  sx={{ width: 56, height: 56 }}
                />
                <PictureButton />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditData}>Edit</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  const fetchAllCompanies = async () => {
    var result = await getData("company/fetch_all_company");
    setCompanies(result.data);
  };
  useEffect(function () {
    fetchAllCompanies();
  }, []);

  function showAllCompany() {
    return (
      <MaterialTable
        title={<span className={classes.headingStyle}>Company List</span>}
        columns={[
          {
            title: "Company Name",
            field: "companyname",
            render: (rowData) => (
              <div>
                {rowData.companyname}
                <br />
                {rowData.ownername}
              </div>
            ),
          },

          {
            title: "Address",
            field: "cityname",
            render: (rowData) => (
              <div>
                {rowData.address}
                <br />
                {rowData.cityname},{rowData.statename}
              </div>
            ),
          },
          {
            title: "Contact Details",
            render: (rowData) => (
              <div>
                {rowData.emailaddress}
                <br />
                {rowData.mobilenumber}
              </div>
            ),
          },
          { title: "Status", field: "status" },
          {
            title: "Last Updation",
            field: "createdby",
            render: (rowData) => (
              <div>
                {rowData.createdat}
                <br />
                {rowData.updateat}
                <br />
                {rowData.createdby}
              </div>
            ),
          },
          {
            title: "Logo",
            render: (rowData) => (
              <Avatar
                src={`${ServerURL}/images/${rowData.logo}`}
                style={{ width: 70, height: 70 }}
                variant="rounded"
              />
            ),
          },
        ]}
        data={companies}
        actions={[
          {
            icon: "add",
            isFreeAction: true,
            tooltip: "Add Company",
            onClick: (event) => navigate("/company"),
          },
          {
            icon: "edit",
            tooltip: "Edit User",
            onClick: (event, rowData) => handleOpenDialog(rowData),
          },
          {
            icon: "delete",
            tooltip: "Delete User",
            onClick: (event, rowData) => handleDelete(rowData),
          },
        ]}
      />
    );
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>
        {showAllCompany()}
        {showCompanyDetails()}
      </div>
    </div>
  );
}
