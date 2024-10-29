import { Button, Input, Form, Select, notification } from "antd";
import { createUserApi } from "../../services/api-service/UserApiService";
import { useContext } from "react";
import { AuthContext } from "../auth-context";

export const AddUserForm = ({ setIsModalVisible, fetchUsers }) => {
    const [form] = Form.useForm();
    const { userLogin, setUserLogin } = useContext(AuthContext);

    const handleAddUser = async (values) => {
        try {
            setIsModalVisible(false);
            await createUserApi(values);
            await fetchUsers();
            notification.success({
                message: "Created user!"
            });
        } catch (error) {
            notification.error({
                message: "Cannot create user",
            });
        } finally {
            form.resetFields();
        }
    };

    // Define the options based on user role
    const roleOptions = userLogin.role === "MANAGER"
        ? [<Select.Option key="3" value="3">STAFF</Select.Option>]
        : [
            <Select.Option key="1" value="1">ADMIN</Select.Option>,
            <Select.Option key="2" value="2">MANAGER</Select.Option>,
            <Select.Option key="3" value="3">STAFF</Select.Option>
        ];

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleAddUser}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input the username!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please input the first name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please input the last name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input the email!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: 'Please input the phone number!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Role"
                name="roleId"
                rules={[{ required: true, message: 'Please select the role!' }]}
            >
                <Select placeholder="Select a role">
                    {roleOptions}
                </Select>
            </Form.Item>
            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                        Save
                    </Button>
                    <Button onClick={() => { setIsModalVisible(false); form.resetFields(); }}>
                        Cancel
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};
