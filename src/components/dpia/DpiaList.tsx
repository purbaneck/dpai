import React, { useEffect } from 'react';
import { useDpiaStore } from '../../store/dpiaStore';
import DpiaCard from './DpiaCard';
import Button from '../ui/Button';
import { Plus, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const DpiaList: React.FC = () => {
  const { dpias, loading, error, fetchDpias, createDpia } = useDpiaStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchDpias();
  }, [fetchDpias]);
  
  const handleCreateDpia = async () => {
    if (!user) return;
    
    const dpiaId = await createDpia('New DPIA', user.id);
    if (dpiaId) {
      navigate(`/dpias/${dpiaId}/edit`);
    }
  };
  
  if (loading && dpias.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <p className="text-red-700">Error loading DPIAs: {error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My DPIAs</h2>
        <Button
          variant="primary"
          onClick={handleCreateDpia}
          className="flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Create new DPIA
        </Button>
      </div>
      
      {dpias.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No DPIAs yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first Data Protection Impact Assessment to get started.
          </p>
          <Button
            variant="primary"
            onClick={handleCreateDpia}
            className="flex items-center mx-auto"
          >
            <Plus className="h-5 w-5 mr-1" />
            Create new DPIA
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dpias.map((dpia) => (
            <DpiaCard key={dpia.id} dpia={dpia} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DpiaList;
