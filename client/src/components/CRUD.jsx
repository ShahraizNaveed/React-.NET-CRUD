import axios from 'axios';
import { useEffect, useState } from 'react'
import { Button, Container, Table, Modal, Row, Col, Form } from "react-bootstrap"
import { Toaster, toast } from 'react-hot-toast'


function CRUD() {

    const employeeData = [
        {
            id: 1,
            name: 'Shahraiz',
            age: 23,
            isActive: 1
        },
        {
            id: 2,
            name: 'Shahzaib',
            age: 26,
            isActive: 0
        },
        {
            id: 3,
            name: 'Shakaib',
            age: 31,
            isActive: 1
        },
    ]

    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [isActive, setIsActive] = useState(0);

    // For Modal
    const [editId, setEditId] = useState("");
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState("");
    const [editIsActive, setEditIsActive] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios.get('https://localhost:7147/api/Employee').then((response) => {
            setData(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7147/api/Employee/${id}`)
            .then((response) => {
                setEditName(response.data.name);
                setEditAge(response.data.age);
                setEditIsActive(response.data.isActive);
                setEditId(id);
            })
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete') === true) {
            axios.delete(`https://localhost:7147/api/Employee/${id}`)
                .then((response) => {
                    if (response.status === 200) {
                        toast.success('Employess has been deleted successfully')
                        getData();
                    }
                }).catch((error) => {
                    toast.error(error)
                })
        }
    }

    const handleUpdate = () => {
        const URL = `https://localhost:7147/api/Employee/${editId}`
        const data = {
            "id": editId,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }

        axios.put(URL, data)
            .then((response) => {
                handleClose();
                getData();
                clear();
                toast.success('Employess has been updated successfully')
            }).catch((error) => {
                toast.error(error);
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const URL = 'https://localhost:7147/api/Employee';

        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }

        axios.post(URL, data)
            .then((response) => {
                getData();
                clear();
                toast.success('Employess has been created')
            }).catch((error) => {
                toast.error(error);
            })
    };

    const clear = () => {
        setName('');
        setAge('');
        setIsActive(0);
        setEditName('');
        setEditAge('');
        setEditIsActive(0);
        setEditId('');
    }

    const handleActiveChange = (e) => {
        if (e.target.checked) {
            setIsActive(1)
        } else {
            setIsActive(0);
        }
    }

    const handleEditActiveChange = (e) => {
        if (e.target.checked) {
            setEditIsActive(1)
        } else {
            setEditIsActive(0);
        }
    }

    return (
        <>
            <Container>
                <Toaster position='top-center' reverseOrder={false}></Toaster>

                <Form className='mt-5' onSubmit={handleSubmit}>
                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-3" con0trolId="formBasicEmail">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Age"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check
                                    type="checkbox"
                                    label="isActive"
                                    checked={isActive === 1 ? true : false}
                                    value={isActive}
                                    onChange={(e) => handleActiveChange(e)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>

            <br />

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>isActive</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.age}</td>
                                        <td>{item.isActive}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>
                                                Edit
                                            </button> &nbsp;
                                            <button className="btn btn-outline-danger" onClick={() => handleDelete(item.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }) :
                            "Loading..."
                    }

                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify / Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='mt-5'>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" con0trolId="formBasicEmail">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Name"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Age"
                                        value={editAge}
                                        onChange={(e) => setEditAge(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label="isActive"
                                        checked={editIsActive === 1 ? true : false}
                                        value={editIsActive}
                                        onChange={(e) => handleEditActiveChange(e)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CRUD
