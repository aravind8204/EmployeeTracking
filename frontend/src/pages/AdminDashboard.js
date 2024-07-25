import React, { useEffect, useState } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IoCloseOutline } from "react-icons/io5";
import axios from 'axios';
import ViewTasks from '../components/ViewTasks';
import ViewStats from '../components/ViewStats';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import emailjs from '@emailjs/browser';
import { IoIosAdd } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { FaTasks, FaChartBar, FaArrowLeft,FaTrash} from 'react-icons/fa';
import { MdPeople, MdAssignment, MdWork } from 'react-icons/md';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const login = localStorage.getItem("login");

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [uopen, setUopen] = useState(false);
  const [empdata, setEmpdata] = useState([]);
  const [taskdata,setTaskdata]=useState([]);
  const [viewemp, setViewemp] = useState(true);
  const [viewtasks, setViewtasks] = useState(false);
  const [viewstats, setViewstats] = useState(false);
  const [search, setSearch] = useState("");
  const [id, setId] = useState('');

  

  const getdata = () => {
    if (login !== "true") {
      navigate("/");
    }
    axios.get("http://localhost:8080/emp/getdata")
      .then((res) => {
        setEmpdata(res.data);
      });
      axios.get("http://localhost:8080/emp/gettasks")
      .then((res)=>{
        setTaskdata(res.data)
      });
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setOpen(!open);
    const empid = "emp" + uuidv4().replace(/\D/g, '').substring(0, 4);
    const newData = { employeeId: empid, name, password: btoa(empid), role, email };
    const maildata = { emp_email: email, name, empid, password: empid, role };

    axios.post("http://localhost:8080/emp/add", newData)
      .then((res) => {
        console.log(res.data);
        emailjs.send('service_meyhyf7', 'template_o6tbk98', maildata, 'GzWI8GFdBI5n0kjHB').then(
          (response) => {
            console.log('SUCCESS!', response.status, response.text);
          },
          (error) => {
            console.log('FAILED...', error);
          },
        );
      });
    
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const handleTask = (employeeId) => {
    setId(employeeId);
    setViewtasks(!viewtasks);
    setViewemp(false);
    setViewstats(false);
  };

  const handleStats = (employeeId) => {
    setId(employeeId);
    setViewemp(false);
    setViewtasks(false);
    setViewstats(!viewstats);
  };

  const handleView = () => {
    setViewemp(true);
    setViewtasks(false);
    setViewstats(false);
  };

  const filterdata=empdata?.filter((item)=> item.name.includes(search) || item.employeeId.includes(search));

  const handleDelete = (key) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:8080/emp/deleteuser/${key}`)
        .then((res) => {
          console.log(res.data);
          getdata();
        })
        .catch((e) => { console.log(e); });
    }
  };

  const handleLogout = () => {
    localStorage.setItem("userid", "");
    localStorage.setItem("login", false);
    navigate("/");
  };

  const allemp=filterdata.filter((item)=>(item.role !== "admin"));
  const projects=[];
  taskdata.forEach(task =>{
    if(!projects.includes(task.project)){
      projects.push(task.project);
    }
  })
  console.log(projects)

  useEffect(() => {
    
    getdata();
  }, []);

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-blue-600 text-white p-4 text-center'>
        <h1 className='text-3xl font-semibold'>AN Solutions</h1>
      </header>
      <div className='flex justify-between items-center p-5'>
        <h2 className='text-2xl font-semibold'>Admin Dashboard</h2>
        <button 
          className='bg-red-500 flex justify-center items-center hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
          onClick={handleLogout}
        ><IoIosLogOut className='text-2xl' />
          Logout
        </button>
      </div>
      <div className='flex justify-center gap-5'>
    <div className='bg-white flex justify-start items-center shadow-lg w-48 rounded-md'>
        <div className='flex flex-col w-full p-3'>
            <div className='flex justify-between items-center w-full mb-2'>
                <p className='text-gray-700 font-semibold'>Total Employees</p>
                <MdPeople className='h-6 w-6 text-blue-500' />
            </div>
            <p className='ml-5 text-xl font-bold text-blue-500'>{allemp.length}</p>
        </div>
    </div>
    <div className='bg-white shadow-lg w-48 flex flex-col justify-start items-center rounded-md p-3'>
        <div className='flex justify-between items-center w-full mb-2'>
            <p className='text-gray-700 font-semibold'>Total Tasks</p>
            <MdAssignment className='h-6 w-6 text-green-500' />
        </div>
        <p className='text-xl font-bold text-green-500'>{taskdata.length}</p>
    </div>
    <div className='bg-white shadow-lg w-48 flex flex-col justify-start items-center rounded-md p-3'>
        <div className='flex justify-between items-center w-full mb-2'>
            <p className='text-gray-700 font-semibold'>Total Projects</p>
            <MdWork className='h-6 w-6 text-red-500' />
        </div>
        <p className='text-xl font-bold text-red-500'>{projects.length}</p>
    </div>
</div>
      <div className='p-5'>
        <div className='flex justify-center mb-4'>
          <button
            className='bg-green-500 flex justify-center items-center hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
            onClick={handleOpen}
          ><IoIosAdd className=' text-2xl' />&nbsp;
            Add Employee
          </button>
        </div>
        <div className='flex justify-center mb-4'>
          <input
            type='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full max-w-md p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Search by Employee ID or Name'
          />
        </div>

        {viewemp && (
          <div className='container mx-auto p-4'>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">S.No</th>
                  <th className="py-3 px-6 text-left">Employee ID</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Role</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filterdata?.filter((item) => item.role !== "admin").map((it) => (
                  <tr key={it.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{it.id}</td>
                    <td className="py-3 px-6 text-left">{it.employeeId}</td>
                    <td className="py-3 px-6 text-left">{it.name}</td>
                    <td className="py-3 px-6 text-left">{it.role}</td>
                    <td className="py-3 px-6 text-left">{it.email}</td>
                    <td className="py-3 px-6 text-left flex gap-2">
                      <button
                        onClick={() => handleTask(it.employeeId)}
                        className="bg-teal-500 flex justify-center items-center hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                      ><FaTasks />&nbsp;
                        View Task
                      </button>
                      <button
                        onClick={() => handleStats(it.employeeId)}
                        className="bg-purple-500 flex justify-center items-center hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                      ><FaChartBar />&nbsp;
                        View Stats
                      </button>
                      <button
                        onClick={() => handleDelete(it.id)}
                        className="bg-red-500 flex justify-center items-center hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      ><FaTrash />&nbsp;
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewtasks && (
          <div className='flex flex-col items-center'>
            <button
              className="bg-gray-500 flex justify-center items-center hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
              onClick={handleView}
            ><FaArrowLeft />&nbsp;
              Back
            </button>
            <ViewTasks id={id} />
          </div>
        )}

        {viewstats && (
          <div className='flex flex-col items-center'>
            <button
              className="bg-gray-500 flex justify-center items-center hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
              onClick={handleView}
            ><FaArrowLeft />&nbsp;
              Back
            </button>
            <ViewStats id={id} />
          </div>
        )}

        <Dialog open={open} onClose={handleOpen}>
          <div className='flex justify-between items-center p-4 border-b border-gray-300'>
            <DialogTitle>Add Employee</DialogTitle>
            <button
              className='text-gray-600 hover:text-gray-800'
              onClick={handleOpen}
            >
              <IoCloseOutline className='text-2xl' />
            </button>
          </div>
          <DialogContent>
            <form className='flex flex-col gap-3'>
              <label className='flex flex-col'>
                Name
                <input
                  className='border border-gray-300 p-2 rounded'
                  placeholder='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className='flex flex-col'>
                Email
                <input
                  type='email'
                  className='border border-gray-300 p-2 rounded'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className='flex flex-col'>
                Role
                <select
                  className='border border-gray-300 p-2 rounded'
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="associate">Associate</option>
                  <option value="dev">Developer</option>
                  <option value="tester">Tester</option>
                </select>
              </label>
              <button
                type='submit'
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4'
                onClick={handleClick}
              >
                Add Employee
              </button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={uopen} onClose={() => setUopen(false)}>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogContent>
            <form className='flex flex-col gap-3'>
              {/* Add your form fields here */}
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
