import './App.css';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const baseUrl = "http://localhost:9000";
const apiImages = baseUrl + "/images"
const apiContacts = baseUrl + "/contacts"

function Example({ contactId }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const data = {
      firstName: document.getElementById("formControlFirstName").value,
      lastName: document.getElementById("formControlLastName").value,
      email: document.getElementById("formControlEmail").value,
      phoneNumber: document.getElementById("formControlPhoneNumber").value,
    };

    const formData = new FormData();

    for (const name in data) {
      formData.append(name, data[name]);
    }

    formData.append("image", document.getElementById("formImage").files[0]);


    console.log(formData);


    fetch(apiContacts + "/" + contactId, {
      method: "POST",
      body: formData,
    }).then(window.location.reload());
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {contactId ? "Edit" : "Create"} contact
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{contactId ? "Edit" : "Create"} contact</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit} encType="multipart/form-data" method="POST" action={contactId ? apiContacts + "/" + contactId : apiContacts} className="">
          <Modal.Body>
            <div class="mb-3">
              <div class="row g-3">

                <div class="col-md-6">
                  <label for="formControlFirstName" class="form-label">First Name</label>
                  <input type="text" class="form-control" id="formControlFirstName" name="firstName" required={contactId == null} />
                </div>
                <div class="col-md-6">
                  <label for="formControlLastName" class="form-label">Last Name</label>
                  <input type="text" class="form-control" id="formControlLastName" name="lastName" required={contactId == null} />
                </div>
              </div>
            </div>


            <div class="mb-3">
              <label for="formControlEmail" class="form-label">Email address</label>
              <input type="email" class="form-control" id="formControlEmail" name="email" placeholder="name@example.com" required={contactId == null} />
            </div>
            <div class="mb-3">
              <label for="formControlPhoneNumber" class="form-label">Phone Number</label>
              <input type="number" class="form-control" id="formControlPhoneNumber" name="phoneNumber" required={contactId == null} />
            </div>
            <div class="mb-3">
              <label for="formImage" class="form-label">Image</label>
              <input class="form-control" type="file" id="formImage" name="image" required={contactId == null} />
            </div>


          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

async function deleteContact(id) {
  const response = await fetch(apiContacts + "/" + id, {
    method: "DELETE",
  });

  return response;
}

async function getContacts() {
  const response = await fetch(apiContacts, {
    method: "GET",
  });

  return response.json();
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: {
        1: {
          _id: 1,
          firstName: "firstName",
          lastName: "lastName",
          email: "email@email.com",
          phoneNumber: "234-345-2345"
        }
      }
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(event) {
    console.log(event.target.id)
    deleteContact(event.target.id).then(data => {
      this.setState(prevState => {
        let contacts = Object.assign({}, prevState.contacts);  // creating copy of state variable jasper
        delete contacts[event.target.id];
        return {
          contacts: contacts
        }
      })
    });
  }
  componentDidMount() {
    getContacts().then(data => {
      console.log(data.list);
      data.list.forEach(item => {
        this.setState(prevState => {
          let contacts = Object.assign({}, prevState.contacts);  // creating copy of state variable jasper
          contacts[item._id] = item;
          return {
            contacts: contacts
          }
        })
      })
    })
  }


  render() {

    return (
      <div className="container-sm">
        <Example />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.state.contacts).map((myKey, i) => {
              return <tr key={this.state.contacts[myKey]._id}>
                <th scope="row">{i + 1}</th>
                <td>{this.state.contacts[myKey].firstName + " " + this.state.contacts[myKey].lastName}</td>
                <td>{this.state.contacts[myKey].email}</td>
                <td>{this.state.contacts[myKey].phoneNumber}</td>
                <td><Example contactId={myKey} /></td>
                <td><button type="button" class="btn btn-danger" onClick={this.handleDelete} id={myKey}>Danger</button></td>
              </tr>
            })}
          </tbody>
        </table>

      </div>

    );
  }
}

export default App;
