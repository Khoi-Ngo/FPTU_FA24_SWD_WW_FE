import { Button, Input, Form, Select, notification } from "antd";
import { createUserApi } from "../../services/api-service/UserApiService";

export const AddUserForm = ({ setIsModalVisible, fetchUsers }) => {
    const [form] = Form.useForm();

    const handleAddUser = async (values) => {
        try {
            setIsModalVisible(false);
            await createUserApi(values);
            form.resetFields();
            await fetchUsers();
            notification.success({
                message: "Created user!"
            })
        } catch (error) {
            notification.error({
                message: "Cannot create user",
            })
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleAddUser}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input the user name!' }]}
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
                    <Select.Option value="1">MANAGER</Select.Option>
                    <Select.Option value="2">STAFF</Select.Option>
                    <Select.Option value="2">ADMIN</Select.Option>

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
