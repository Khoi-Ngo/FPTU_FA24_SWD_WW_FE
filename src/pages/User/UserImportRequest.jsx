import React, { useState, useEffect } from 'react';
import '../../styles/UserImportRequest.css';

const UserImportRequest = () => {
    const [requests, setRequests] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newRequest, setNewRequest] = useState({
        name: '',
        recipient: '',
        content: '',
        file: null
    });
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        // Simulate fetching data from server
        setRequests([
            { id: 1, name: 'Request 1', recipient: 'Admin', content: 'Content 1', fileName: 'users1.csv', status: 'Processing' },
            { id: 2, name: 'Request 2', recipient: 'Manager', content: 'Content 2', fileName: 'users2.xlsx', status: 'Completed' },
        ]);
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewRequest({ ...newRequest, [name]: value });
    };

    const handleFileChange = (event) => {
        setNewRequest({ ...newRequest, file: event.target.files[0] });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newRequest.file) {
            const createdRequest = {
                id: requests.length + 1,
                ...newRequest,
                fileName: newRequest.file.name,
                status: 'Processing'
            };
            setRequests([...requests, createdRequest]);
            setNewRequest({ name: '', recipient: '', content: '', file: null });
            setShowPopup(false);
        } else {
            alert('Please select a file to upload');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            setRequests(requests.filter(request => request.id !== id));
        }
    };

    const handleUpdate = (id) => {
        const requestToUpdate = requests.find(request => request.id === id);
        setSelectedRequest(requestToUpdate);
    };

    const handleUpdateSubmit = (event) => {
        event.preventDefault();
        const updatedRequests = requests.map(request =>
            request.id === selectedRequest.id ? selectedRequest : request
        );
        setRequests(updatedRequests);
        setSelectedRequest(null);
    };

    return (
        <div className="user-import-request">
            <h2>User Import Requests</h2>
            <button className="btn-create" onClick={() => setShowPopup(true)}>Create New Request</button>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Create New Request</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Request Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newRequest.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="recipient">Recipient:</label>
                                <input
                                    type="text"
                                    id="recipient"
                                    name="recipient"
                                    value={newRequest.recipient}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">Content:</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={newRequest.content}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="file-upload">Select File:</label>
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    accept=".csv, .xlsx"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-submit">Submit Request</button>
                                <button type="button" className="btn-cancel" onClick={() => setShowPopup(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h3>Request List</h3>
            <table className="request-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Request Name</th>
                        <th>Recipient</th>
                        <th>Content</th>
                        <th>File Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{request.name}</td>
                            <td>{request.recipient}</td>
                            <td>{request.content}</td>
                            <td>{request.fileName}</td>
                            <td>{request.status}</td>
                            <td>
                                <button className="btn-update" onClick={() => handleUpdate(request.id)}>Update</button>
                                <button className="btn-delete" onClick={() => handleDelete(request.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedRequest && (
                <div className="update-form">
                    <h3>Update Request</h3>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="form-group">
                            <label htmlFor="update-name">Request Name:</label>
                            <input
                                type="text"
                                id="update-name"
                                value={selectedRequest.name}
                                onChange={(e) => setSelectedRequest({ ...selectedRequest, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="update-recipient">Recipient:</label>
                            <input
                                type="text"
                                id="update-recipient"
                                value={selectedRequest.recipient}
                                onChange={(e) => setSelectedRequest({ ...selectedRequest, recipient: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="update-content">Content:</label>
                            <textarea
                                id="update-content"
                                value={selectedRequest.content}
                                onChange={(e) => setSelectedRequest({ ...selectedRequest, content: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="update-status">Status:</label>
                            <input
                                type="text"
                                id="update-status"
                                value={selectedRequest.status}
                                onChange={(e) => setSelectedRequest({ ...selectedRequest, status: e.target.value })}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-submit">Update</button>
                            <button type="button" className="btn-cancel" onClick={() => setSelectedRequest(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserImportRequest;