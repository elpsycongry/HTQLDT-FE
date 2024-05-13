import { Dialog, DialogTitle, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import RemoveIcon from '@mui/icons-material/Remove';
import BackspaceIcon from '@mui/icons-material/Backspace';
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

export default function DialogRecruitmentPlanFormCreate() {
  const [dateErr, setDateErr] = useState(false);
  const [techErr, setTechErr] = useState(false);
  const [quantityErr, setQuantityErr] = useState(false);
  // Xử lý số lượng nhân sự
  const checkValid = (dateSet, techArr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 75);
    const errTech = techArr.map(item => {
      if (item.type === "" || item.type === "default") {
        return true;
      } else {
        return false;
      }
    })
    const hasErrTech = errTech.some(item => item === true);
    setTechErr(hasErrTech);
    const errQuantity = techArr.map(item => {
      if (item.quantity == 0 || item.quantity === "" || item.quantity < 0) {
        return true;
      } else {
        return false;
      }
    })
    const hasErrQuantity = errQuantity.some(item => item === true);
    setQuantityErr(hasErrQuantity);



    if (dateSet < futureDate || dateSet == "Invalid Date") {
      setDateErr(true);
    } else {
      setDateErr(false);
    }


    if (dateSet < futureDate || dateSet == "Invalid Date" || hasErrTech || hasErrQuantity) {
      return false;
    } else {
      return true;
    }
  }

  const formData = useFormik({
    initialValues: {
      idUser: null,
      recruitmentRequest: {
        dateStart: "",
        dateEnd: "",
        name: "",
        status: "",
        details: [
          {
            type: "",
            quantity: "",
          },
        ],
      },
    },
    onSubmit: async (values, { setSubmitting }) => {
      const date = new Date(values.recruitmentRequest.dateEnd);
      if (!checkValid(date, tech)) {
        setSubmitting(false);
        return;
      } else {
        // Dữ liệu hợp lệ, tiến hành gửi dữ liệu
        values.details = [...tech];
        values.idUser = 1;
        try {
          await axios.post("http://localhost:8080/api/recruitmentRequests", values).then(res => {
            swal("tạo nhu cầu nhân sự thành công", {
              icon: "success",
              buttons: false,
              timer: 2000
            }).then(() => {
              window.location.href = "/recruitment/personalNeeds";
            });
          });
        } catch (error) {
          swal("tạo nhu cầu nhân sự thất bại", {
            icon: "error",
            buttons: false,
            timer: 2000
          });
        }
      }
    }
  });
  // Call api
  const [recuitments, setRecuitment] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/api/recruitmentRequests").then((res) => {
      setRecuitment(res.data);
    });
  }, []);





  // Xử lý mở form
  const listTechnology = [
    { id: 1, text: "PHP" },
    { id: 2, text: "Laravel" },
    { id: 3, text: "React" },
    { id: 4, text: "React Native" },
    { id: 5, text: "Agular" },
    { id: 6, text: "Python - Django" },
    { id: 7, text: "VueJs" },
    { id: 8, text: "Android" },
    { id: 9, text: "IOS" },
    { id: 10, text: "JAVA" },
    { id: 11, text: ".NET" }
  ]
  const [openForm, setOpenForm] = useState(false);
  const handleClickFormOpen = () => {
    setOpenForm(true);
  }
  const handleClickFormClose = () => {
    setOpenForm(false);
  }
  // Xử lý thêm công nghệ
  const [tech, setTech] = useState([{ type: "", numberOfPersonnelNeeded: "", numberOfOutputPersonnel: "" }]);
  const addTech = () => {
    setTech((prevTech) => [...prevTech, { type: "", numberOfPersonnelNeeded: "", numberOfOutputPersonnel: "" }]);
  };

  const removeTech = (index) => {
    const updateTech = tech.filter((_, idx) => idx !== index);
    setTech(updateTech);
  };
  const handleChangeSelect = (e, index) => {
    const updateTech = [...tech];
    updateTech[index] = { ...updateTech[index], type: e.target.value };
    setTech(updateTech);
  }


  function NumberOfOutputPersonnel({ number, onQuantityChange }) {
    if (number === "" || number == 0) {
      number = 0;
    }
    const [count, setCount] = useState(number);
    const handleClickCountPlus = () => {
      setCount(count + 1);
      onQuantityChange(count + 1);
    };
    const handleInputChange = (e) => {
      const newCount = parseInt(e.target.value);
      setCount(newCount);
      onQuantityChange(newCount);
    };
    const handleClickCountMinus = () => {
      if (!count <= 0) {
        setCount(count - 1);
        onQuantityChange(count - 1);
      }
    };
    return (
      <div className="d-flex justify-content-center align-items-center">
        <RemoveIcon onClick={handleClickCountMinus} className="me-1" />
        <input
          value={count}
          style={{ fontSize: "15px", height: "36px" }}
          className="form-control w-25 border-clr-grey border text-center"
          type="number"
          onChange={handleInputChange}
        />
        <AddIcon onClick={handleClickCountPlus} className="ms-1" />
      </div>
    );
  }
  const handleQuantityChangeOutput = (newQuantity, index) => {
    const updatedTech = [...tech];
    updatedTech[index].numberOfOutputPersonnel = newQuantity;
    setTech(updatedTech);
    handleQuantityOffPersonal(newQuantity * 3, index);
  };

  function NumberOfPersonnelNeeded({ number, onQuantityChange }) {
    if (number === "" || number == 0) {
      number = 0;
    }
    const [countOf, setCountOf] = useState(number);
    const handleClickCountPlus = () => {
      setCountOf(countOf + 1);
      onQuantityChange(countOf + 1);
    };
    const handleInputChange = (e) => {
      const newCount = parseInt(e.target.value);
      setCountOf(newCount);
      onQuantityChange(newCount);
    };
    const handleClickCountMinus = () => {
      if (!countOf <= 0) {
        setCountOf(countOf - 1);
        onQuantityChange(countOf - 1);
      }
    };
    return (
      <div className="d-flex justify-content-center align-items-center">
        <RemoveIcon onClick={handleClickCountMinus} className="me-1" />
        <input
          value={countOf}
          style={{ fontSize: "15px", height: "36px" }}
          className="form-control w-25 border-clr-grey border text-center"
          type="number"
          onChange={handleInputChange}
        />
        <AddIcon onClick={handleClickCountPlus} className="ms-1" />
      </div>
    );
  }
  const handleQuantityOffPersonal = (newQuantity, index) => {
    const updatedTech = [...tech];
    updatedTech[index].numberOfPersonnelNeeded = newQuantity;
    setTech(updatedTech);
  };
  const Dlt = ({ index }) => {
    if (tech.length > 1) {
      return (
        <BackspaceIcon className="position-absolute oc-08 clr-danger hover-danger" sx={{ right: '55px', top: '6px' }} onClick={() => removeTech(index)} />
      )
    }
  }
  return (
    <>
      <div className=" min-width position-relative " style={{ width: '280px' }} onClick={handleClickFormOpen}>
        <button className="hover-btn btn-create w-100  text-right clr-white font-w-1 non-outline">Thêm kế hoạch tuyển dụng</button>
        <AddIcon className=" position-absolute plus-icon clr-white" />
      </div>
      <Dialog
        id="formCreateRecruitmentPlan"
        open={openForm}
        onClose={handleClickFormClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <form className="row g-3" onSubmit={formData.handleSubmit}>
            <div className="col-md-12">
              <h2 className="grey-text" style={{ paddingBottom: 3 }}>
                Thêm kế hoạch tuyển dụng
              </h2>
              <IconButton
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
                onClick={handleClickFormClose}
              >
                <ClearIcon />
              </IconButton>
            </div>
            <div className="col-md-12">
              <label htmlFor="name" className="form-label grey-text">
                Từ nhu cầu nhân sự
              </label>
              <select
                className="form-select grey-text"
                aria-label="Default select example"
                defaultValue="default"
              >
                <option value="default">Chọn nhu cầu nhân sự</option>
                {recuitments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-12">
              <label htmlFor="name" className="form-label grey-text">
                Tên kế hoạch tuyển dụng <span className="color-red">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: DECEN - Kế hoạch tuyển dụng quý 3/2021"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur} // Thêm onBlur để kiểm tra lỗi khi trường dữ liệu bị mất trỏ
                className={`form-control`}
                id="recruitmentRequest.name"
                name="recruitmentRequest.name"
              />
            </div>
            <div className="col-md-12  d-flex">
              <div className="col-md-4 mb-0">
                <label className="form-label grey-text">
                  Công nghệ <span className="color-red">*</span>
                </label>
              </div>
              <div className="col-md-4 mb-0 text-center">
                <label className="form-label grey-text">
                  Số lượng nhân sự cần tuyển <span className="color-red">*</span>
                </label>
              </div>
              <div className="col-md-4 mb-0 text-center ">
                <label className="form-label grey-text">
                  Số lượng nhân sự đầu ra <span className="color-red">*</span>
                </label>
              </div>
            </div>
            {tech.map((tech, index) => (
              <>
                <div key={index} className="col-md-4 mt-0 mb-2 child">
                  <select
                    className="form-select grey-text"
                    aria-label="Default select example"
                    defaultValue="default"
                    onChange={(e) => handleChangeSelect(e, index)}
                    name={`tech[${index}].type`}
                  >
                    <option value="default">Chọn công nghệ...</option>
                    {listTechnology.map((item) => (
                      <option key={item.id} value={item.text}>
                        {item.text}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 text-center mt-0 mb-2   align-item-center">
                  <NumberOfPersonnelNeeded
                    number={tech.numberOfPersonnelNeeded}
                    key={tech.numberOfPersonnelNeeded}
                    onQuantityChange={(newQuantity) =>
                      handleQuantityOffPersonal(newQuantity, index)
                    }
                  />
                </div>
                <div className="col-md-4 text-center mt-0 mb-2  position-relative align-item-center">
                  <NumberOfOutputPersonnel
                    number={tech.numberOfOutputPersonnel}
                    key={tech.numberOfOutputPersonnel}
                    onQuantityChange={(newQuantity) =>
                      handleQuantityChangeOutput(newQuantity, index)
                    }
                  />
                  <Dlt index={index} />
                </div>
              </>
            ))}
            <div className=" col-md-12 d-flex justify-content-between mt-0">
              <div>
                {techErr && <p style={{ whiteSpace: 'nowrap' }} className="err-valid col-md-6">Công nghệ không được để rỗng</p>}
              </div>
              <div>
                {quantityErr && <p style={{ whiteSpace: 'nowrap' }} className="err-valid justify-content-end col-md-6">Số lượng phải bé hơn 0</p>}
              </div>
            </div>


            <div className="col-md-12 mt-2" onClick={addTech}>
              <p className="grey-text plusTech mb-0">Thêm công nghệ +</p>
            </div>
            <div className="col-md-12  d-flex">
              <div className="col-md-4 mb-0">
                <label className="form-label grey-text">
                  Công nghệ <span className="color-red">*</span>
                </label>
              </div>
              <div className="col-md-4 mb-0 text-center">
                <label className="form-label grey-text">
                  Số lượng nhân sự cần tuyển <span className="color-red">*</span>
                </label>
              </div>
              <div className="col-md-4 mb-0 text-center">
                <label className="form-label"></label>
              </div>
            </div>
            <div className="col-md-4 mt-0 mb-2 child">
              <input
                type="date"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                className={`form-control text-center grey-text`}
                defaultValue={'2021-01-01'}
                id="recruitmentRequest.dateEnd"
                name="recruitmentRequest.dateEnd"
              />
              {dateErr && <p className="err-valid ">Thời hạn bàn giao phải tối thiểu 75 ngày</p>}
            </div>
            <div className="col-md-4 mt-0 mb-2 child">
              <input
                type="date"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                className={`form-control text-center grey-text`}
                id="recruitmentRequest.dateEnd"
                name="recruitmentRequest.dateEnd"
                defaultValue={'2021-01-03'}
              />
              {dateErr && <p className="err-valid ">Thời hạn bàn giao phải tối thiểu 75 ngày</p>}
            </div>

            <div className="col-md-4 mb-2 mt-0">
              <div className="send text-right mt-0">
                <div className="send-child position-relative">
                  <button type="submit" className="btn send-btn btn-success ">
                    Gửi
                    <SendIcon className="iconSend position-absolute" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </DialogTitle>
      </Dialog >
    </>
  )
}