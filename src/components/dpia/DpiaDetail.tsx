import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDpiaStore } from '../../store/dpiaStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { ArrowLeft, Edit, FileText, Clock, CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react';

const DpiaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDpia, fetchDpiaById, deleteDpia, loading, error } = useDpiaStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (id) {
      fetchDpiaById(id);
    }
  }, [id, fetchDpiaById]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getStatusIcon = () => {
    if (!currentDpia) return null;
    
    switch (currentDpia.status) {
      case 'draft':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'submitted':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    if (!currentDpia) return '';
    
    switch (currentDpia.status) {
      case 'draft':
        return 'Draft';
      case 'submitted':
        return 'Submitted for review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return '';
    }
  };
  
  const getStatusColor = () => {
    if (!currentDpia) return '';
    
    switch (currentDpia.status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };
  
  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this DPIA? This action cannot be undone.')) {
      return;
    }
    
    await deleteDpia(id);
    navigate('/dpias');
  };
  
  if (loading && !currentDpia) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <p className="text-red-700">Error loading DPIA: {error}</p>
      </div>
    );
  }
  
  if (!currentDpia) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 my-4">
        <p className="text-yellow-700">DPIA not found</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/dpias')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to DPIAs
        </Button>
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentDpia.title}</h1>
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </div>
            <p className="text-sm text-gray-500">
              Last updated: {formatDate(currentDpia.updated_at)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {currentDpia.status === 'draft' && (
            <>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/dpias/${id}/edit`)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
      
      {currentDpia.sections && currentDpia.sections.length > 0 ? (
        <div className="space-y-6">
          {formSteps.map((step) => {
            const section = currentDpia.sections?.find(s => s.section_name === step.id);
            
            if (!section) return null;
            
            return (
              <Card key={step.id}>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {step.fields.map((field) => {
                      const value = section.content[field.id];
                      
                      if (!value) return null;
                      
                      return (
                        <div key={field.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                          <h3 className="text-sm font-medium text-gray-500">{field.label}</h3>
                          <div className="mt-1">
                            {field.type === 'select' ? (
                              <p className="text-gray-900">
                                {field.options?.find(o => o.value === value)?.label || value}
                              </p>
                            ) : (
                              <p className="text-gray-900 whitespace-pre-line">{value}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No DPIA content yet</h3>
          {currentDpia.status === 'draft' ? (
            <>
              <p className="text-gray-600 mb-4">
                This DPIA is still in draft. Click the button below to start filling it out.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate(`/dpias/${id}/edit`)}
                className="flex items-center mx-auto"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit DPIA
              </Button>
            </>
          ) : (
            <p className="text-gray-600">
              This DPIA has been submitted but doesn't contain any sections.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Re-use the formSteps from DpiaForm
const formSteps = [
  {
    id: 'project-info',
    title: 'Project Information',
    fields: [
      { id: 'title', label: 'Project Title', type: 'text' },
      { id: 'description', label: 'Project Description', type: 'textarea' },
      { id: 'controller', label: 'Data Controller', type: 'text' },
      { id: 'dpo', label: 'Data Protection Officer', type: 'text' },
    ],
  },
  {
    id: 'data-processing',
    title: 'Data Processing Details',
    fields: [
      { id: 'dataCategories', label: 'Categories of Personal Data', type: 'textarea' },
      { id: 'dataSubjects', label: 'Data Subjects', type: 'textarea' },
      { id: 'processingPurposes', label: 'Processing Purposes', type: 'textarea' },
      { 
        id: 'legalBasis', 
        label: 'Legal Basis for Processing', 
        type: 'select',
        options: [
          { label: 'Consent', value: 'consent' },
          { label: 'Contract', value: 'contract' },
          { label: 'Legal obligation', value: 'legal_obligation' },
          { label: 'Vital interests', value: 'vital_interests' },
          { label: 'Public task', value: 'public_task' },
          { label: 'Legitimate interests', value: 'legitimate_interests' },
        ],
      },
      { id: 'dataRetention', label: 'Data Retention Period', type: 'textarea' },
    ],
  },
  {
    id: 'necessity-proportionality',
    title: 'Necessity and Proportionality',
    fields: [
      { id: 'necessityAssessment', label: 'Necessity Assessment', type: 'textarea' },
      { id: 'proportionalityAssessment', label: 'Proportionality Assessment', type: 'textarea' },
      { id: 'alternativesConsidered', label: 'Alternatives Considered', type: 'textarea' },
    ],
  },
  {
    id: 'risks-assessment',
    title: 'Risks Assessment',
    fields: [
      { id: 'identifiedRisks', label: 'Identified Risks', type: 'textarea' },
      { 
        id: 'riskLikelihood', 
        label: 'Overall Risk Likelihood', 
        type: 'select',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      },
      { 
        id: 'riskSeverity', 
        label: 'Overall Risk Severity', 
        type: 'select',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      },
      { id: 'mitigationMeasures', label: 'Mitigation Measures', type: 'textarea' },
    ],
  },
  {
    id: 'consultation',
    title: 'Consultation',
    fields: [
      { id: 'stakeholdersConsulted', label: 'Stakeholders Consulted', type: 'textarea' },
      { id: 'consultationSummary', label: 'Consultation Summary', type: 'textarea' },
      { 
        id: 'supervisoryAuthorityConsultation', 
        label: 'Is consultation with the supervisory authority required?', 
        type: 'select',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
          { label: 'Not determined yet', value: 'undetermined' },
        ],
      },
    ],
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    fields: [
      { 
        id: 'dpiaOutcome', 
        label: 'DPIA Outcome', 
        type: 'select',
        options: [
          { label: 'Processing can proceed', value: 'proceed' },
          { label: 'Processing can proceed with modifications', value: 'proceed_with_modifications' },
          { label: 'Processing should not proceed', value: 'do_not_proceed' },
        ],
      },
      { id: 'justification', label: 'Justification', type: 'textarea' },
      { id: 'reviewDate', label: 'Next Review Date', type: 'date' },
      { id: 'approver', label: 'Approved By', type: 'text' },
    ],
  },
];

export default DpiaDetail;
