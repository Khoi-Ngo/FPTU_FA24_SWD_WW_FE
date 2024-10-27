import { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const DynamicMenu = ({ categories, labelParent, labelChild, keyParent, keyChild }) => {
  const [activeParent, setActiveParent] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    console.log('DynamicMenu component rendered');
  }, []);

  // Handler for parent click
  const handleParentClick = (key) => {
    if (activeParent === key) {
      // If clicking on the same parent, toggle hide
      console.log(`Parent item clicked: ${keyParent}`);
      setActiveParent(null);
    } else {
      // Otherwise, set it as active and load the page
      setActiveParent(key);
      loadParentContentPage(key); // Only load on first click
    }
  };

  const loadParentContentPage = (key) => {
    // Navigate to the page associated with this parent key
    navigate(`/app/wines`)
    console.log('loadParentContentPage ', navigate(`/parent/${key}`))
  };

  const items = [
    {
      label: labelParent,
      icon: <UserOutlined />,
      key: keyParent,
      onClick: () => handleParentClick({ keyParent }),
      children: activeParent === keyParent ? categories.map(category => ({
        key: keyChild,
        label: labelChild,
        onClick: () => navigate(`/${keyParent}/${category.key}`), // Navigate to child content page
      })) : [],
    },
    // Add more menu items here if needed
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
    />
  );
};

export default DynamicMenu;
