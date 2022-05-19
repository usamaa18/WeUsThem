import './App.css';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const baseUrl = "http://localhost:9000";
const apiImages = baseUrl + "/images/"
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

    if (document.getElementById("formImage").files[0]) {
      formData.append("image", document.getElementById("formImage").files[0]);
    }


    console.log(formData);

    let url = contactId ? apiContacts + "/" + contactId : apiContacts;
    fetch(url, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: formData,
    }).then(data => {
      // if (contactId) {
      window.location.reload()
      // }
    });
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {contactId ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg> : "Create contact"}
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
              <input type="text" class="form-control" id="formControlPhoneNumber" name="phoneNumber" pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$" required={contactId == null} />
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
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  return response;
}

async function getContacts() {
  const response = await fetch(apiContacts, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  return response.json();
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: {
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
        <div style = {{ padding : 20 }}>
        <Example/>

        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"> </th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone Number</th>
              <th scope="col"> </th>
              <th scope="col"> </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.state.contacts).map((myKey, i) => {
              return <tr key={this.state.contacts[myKey]._id}>
                <th scope="row">
                  <img src={apiImages + myKey + ".jpg"} class="rounded " style={{ maxHeight: 2 + 'em' }} />

                </th>
                <td>{this.state.contacts[myKey].firstName + " " + this.state.contacts[myKey].lastName}</td>
                <td>{this.state.contacts[myKey].email}</td>
                <td>{this.state.contacts[myKey].phoneNumber}</td>
                <td><Example contactId={myKey} /></td>
                <td><button type="button" class="btn btn-danger" onClick={this.handleDelete} id={myKey}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                  </svg>
                </button></td>
              </tr>
            })}
          </tbody>
        </table>

      </div>

    );
  }
}

export default App;
