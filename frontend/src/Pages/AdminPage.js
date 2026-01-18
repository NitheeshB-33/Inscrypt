import React, { useContext, useEffect } from 'react';
import AdminHome from '../Components/Admin/AdminHome';
import { AdminContext } from '../Context/AdminContext';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();
  const { admin } = useContext(AdminContext);

  useEffect(() => {
    if (!admin) {
      navigate('/AdminLogin');
    }
  }, [admin, navigate]);

  return (
    <div>
      {admin && <AdminHome />}
    </div>
  );
}

export default AdminPage;