import { 
  FiHome, 
  FiPieChart, 
  FiUsers, 
  FiSettings, 
  FiLayers,
  FiBox,
  FiFileText
} from 'react-icons/fi';
import { AiOutlinePicture } from "react-icons/ai";

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <FiHome />,
  },
   {
    title: 'Portfolio',
    path: '/Allprojects',
    icon: <AiOutlinePicture />,
  },
  {
    title: 'Projects',
    path: '#', // '#' indicates it's a parent menu
    icon: <FiLayers />,
    iconClosed: <span className="text-xs">▼</span>, // You can use FiChevronDown here
    iconOpened: <span className="text-xs">▲</span>,
    subNav: [
      {
        title: 'Active Projects',
        path: '/projects/active',
        icon: <FiBox />,
      },
      {
        title: 'Completed',
        path: '/projects/completed',
        icon: <FiFileText />,
      },
    ],
  },
  {
    title: 'Team',
    path: '/staff',
    icon: <FiUsers />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <FiSettings />,
  },
];