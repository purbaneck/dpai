import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDpiaStore } from '../../store/dpiaStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Card, { CardContent } from '../ui/Card';
import { Plus, FileText, Clock, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
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
  
  // Count DPIAs by status
  const dpiaCounts = {
    draft: dpias.filter(d => d.status === 'draft').length,
    submitted: dpias.filter(d => d.status === 'submitted').length,
    approved: dpias.filter(d => d.status === 'approved').length,
    rejected: dpias.filter(d => d.status === 'rejected').length,
  };
  
  // Get recent DPIAs
  const recentDpias = [...dpias]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome{user?.full_name ? `, ${user.full_name}` : ''}! Manage your Data Protection Impact Assessments.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={handleCreateDpia}
            className="flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Create new DPIA
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Draft DPIAs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{dpiaCounts.draft}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted DPIAs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{dpiaCounts.submitted}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Approved DPIAs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{dpiaCounts.approved}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected DPIAs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{dpiaCounts.rejected}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent DPIAs</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dpias')}
                  className="flex items-center"
                >
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {loading && recentDpias.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : recentDpias.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No DPIAs created yet</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCreateDpia}
                    className="mt-4"
                  >
                    Create your first DPIA
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentDpias.map((dpia) => {
                    const statusIcons = {
                      draft: <Clock className="h-5 w-5 text-yellow-500" />,
                      submitted: <AlertTriangle className="h-5 w-5 text-blue-500" />,
                      approved: <CheckCircle className="h-5 w-5 text-green-500" />,
                      rejected: <XCircle className="h-5 w-5 text-red-500" />,
                    };
                    
                    const statusColors = {
                      draft: 'bg-yellow-100 text-yellow-800',
                      submitted: 'bg-blue-100 text-blue-800',
                      approved: 'bg-green-100 text-green-800',
                      rejected: 'bg-red-100 text-red-800',
                    };
                    
                    return (
                      <div key={dpia.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 truncate max-w-xs">{dpia.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Last updated: {new Date(dpia.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${statusColors[dpia.status]}`}>
                              {statusIcons[dpia.status]}
                              <span className="ml-1 capitalize">{dpia.status}</span>
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/dpias/${dpia.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">What is a DPIA?</h3>
                  <p className="text-sm text-blue-700">
                    A Data Protection Impact Assessment (DPIA) helps organizations identify and minimize data protection risks in projects that process personal data.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-2">When is a DPIA required?</h3>
                  <p className="text-sm text-green-700">
                    A DPIA is required when processing is likely to result in a high risk to individuals, especially when using new technologies or for systematic monitoring.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">How to complete a DPIA</h3>
                  <p className="text-sm text-purple-700">
                    Describe the processing, assess necessity and proportionality, identify and assess risks, and identify measures to mitigate those risks.
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/help')}
                  className="mt-2"
                >
                  View full help guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
