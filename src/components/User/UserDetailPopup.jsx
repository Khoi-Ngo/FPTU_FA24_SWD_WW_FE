import { Avatar, Descriptions } from "antd";

export const UserDetailPopup = ({ selectedUser }) => {
    return (
        <div>
            {/* Display Avatar */}
            <div style={{ textAlign: 'center' }}>
                <Avatar
                    size={64}
                    src={selectedUser.profileImageUrl}
                    alt="User Avatar"
                    style={{
                        borderRadius: '50%',
                        border: '0.3px solid black',
                        marginBottom: '16px',
                    }}
                />
            </div>

            {/* Display User Name and Role */}
            <h2 style={{ textAlign: 'center' }}>
                {selectedUser.firstName} {selectedUser.lastName}
            </h2>
            <p className="user-role" style={{ textAlign: 'center', marginBottom: '16px' }}>
                {selectedUser.role}
            </p>

            {/* Display Descriptions without edit options */}
            <Descriptions bordered column={1} className="user-descriptions">
                <Descriptions.Item label="Username">{selectedUser.username}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{selectedUser.phoneNumber || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Status">{selectedUser.status || 'Active'}</Descriptions.Item>
                <Descriptions.Item label="Last Login">{new Date(selectedUser.lastLogin).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Created At">{new Date(selectedUser.createdAt).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Preferred Language">{selectedUser.preferredLanguage || 'English'}</Descriptions.Item>
                <Descriptions.Item label="Time Zone">{selectedUser.timeZone || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Bio">{selectedUser.bio || 'No bio available.'}</Descriptions.Item>
                        

            </Descriptions>
        </div>
    );
};
