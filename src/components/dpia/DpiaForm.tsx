import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDpiaStore } from '../../store/dpiaStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import { Save, ArrowLeft, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import AiAssistant from '../ai/AiAssistant';

// Define the form steps and fields
const formSteps = [
  {
    id: 'project-info',
    title: 'Project Information',
    description: 'Provide basic information about the project or processing activity',
    fields: [
      {
        id: 'title',
        type: 'text' as const,
        label: 'Project Title',
        required: true,
        helpText: 'Name of the project or processing activity',
      },
      {
        id: 'description',
        type: 'textarea' as const,
        label: 'Project Description',
        required: true,
        helpText: 'Describe the nature, scope, context and purposes of the processing',
      },
      {
        id: 'controller',
        type: 'text' as const,
        label: 'Data Controller',
        required: true,
        helpText: 'Organization responsible for determining the purposes and means of processing',
      },
      {
        id: 'dpo',
        type: 'text' as const,
        label: 'Data Protection Officer',
        helpText: 'Name and contact details of your DPO (if applicable)',
      },
    ],
  },
  {
    id: 'data-processing',
    title: 'Data Processing Details',
    description: 'Describe what personal data will be processed and how',
    fields: [
      {
        id: 'dataCategories',
        type: 'textarea' as const,
        label: 'Categories of Personal Data',
        required: true,
        helpText: 'List all types of personal data that will be processed',
      },
      {
        id: 'dataSubjects',
        type: 'textarea' as const,
        label: 'Data Subjects',
        required: true,
        helpText: 'Describe the individuals whose data will be processed',
      },
      {
        id: 'processingPurposes',
        type: 'textarea' as const,
        label: 'Processing Purposes',
        required: true,
        helpText: 'Explain why the data is being processed',
      },
      {
        id: 'legalBasis',
        type: 'select' as const,
        label: 'Legal Basis for Processing',
        required: true,
        options: [
          { label: 'Consent', value: 'consent' },
          { label: 'Contract', value: 'contract' },
          { label: 'Legal obligation', value: 'legal_obligation' },
          { label: 'Vital interests', value: 'vital_interests' },
          { label: 'Public task', value: 'public_task' },
          { label: 'Legitimate interests', value: 'legitimate_interests' },
        ],
      },
      {
        id: 'dataRetention',
        type: 'textarea' as const,
        label: 'Data Retention Period',
        required: true,
        helpText: 'How long will the data be kept for?',
      },
    ],
  },
  {
    id: 'necessity-proportionality',
    title: 'Necessity and Proportionality',
    description: 'Assess whether the processing is necessary and proportionate',
    fields: [
      {
        id: 'necessityAssessment',
        type: 'textarea' as const,
        label: 'Necessity Assessment',
        required: true,
        helpText: 'Explain why the processing is necessary to achieve your purpose',
      },
      {
        id: 'proportionalityAssessment',
        type: 'textarea' as const,
        label: 'Proportionality Assessment',
        required: true,
        helpText: 'Explain why the processing is proportionate to your purpose',
      },
      {
        id: 'alternativesConsidered',
        type: 'textarea' as const,
        label: 'Alternatives Considered',
        required: true,
        helpText: 'What alternatives to this processing have been considered?',
      },
    ],
  },
  {
    id: 'risks-assessment',
    title: 'Risks Assessment',
    description: "Identify and assess risks to individuals' rights and freedoms",
    fields: [
      {
        id: 'identifiedRisks',
        type: 'textarea' as const,
        label: 'Identified Risks',
        required: true,
        helpText: "List all potential risks to individuals' rights and freedoms",
      },
      {
        id: 'riskLikelihood',
        type: 'select' as const,
        label: 'Overall Risk Likelihood',
        required: true,
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      },
      {
        id: 'riskSeverity',
        type: 'select' as const,
        label: 'Overall Risk Severity',
        required: true,
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      },
      {
        id: 'mitigationMeasures',
        type: 'textarea' as const,
        label: 'Mitigation Measures',
        required: true,
        helpText: 'Describe measures to reduce or eliminate the identified risks',
      },
    ],
  },
  {
    id: 'consultation',
    title: 'Consultation',
    description: 'Document any consultation with stakeholders',
    fields: [
      {
        id: 'stakeholdersConsulted',
        type: 'textarea' as const,
        label: 'Stakeholders Consulted',
        helpText: 'List any stakeholders who have been consulted (e.g., data subjects, DPO)',
      },
      {
        id: 'consultationSummary',
        type: 'textarea' as const,
        label: 'Consultation Summary',
        helpText: 'Summarize the feedback received from stakeholders',
      },
      {
        id: 'supervisoryAuthorityConsultation',
        type: 'select' as const,
        label: 'Is consultation with the supervisory authority required?',
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
    description: 'Summarize findings and document the decision',
    fields: [
      {
        id: 'dpiaOutcome',
        type: 'select' as const,
        label: 'DPIA Outcome',
        required: true,
        options: [
          { label: 'Processing can proceed', value: 'proceed' },
          { label: 'Processing can proceed with modifications', value: 'proceed_with_modifications' },
          { label: 'Processing should not proceed', value: 'do_not_proceed' },
        ],
      },
      {
        id: 'justification',
        type: 'textarea' as const,
        label: 'Justification',
        required: true,
        helpText: 'Explain the reasoning behind the outcome',
      },
      {
        id: 'reviewDate',
        type: 'date' as const,
        label: 'Next Review Date',
        required: true,
        helpText: 'When should this DPIA be reviewed?',
      },
      {
        id: 'approver',
        type: 'text' as const,
        label: 'Approved By',
        helpText: 'Name and role of the person approving this DPIA',
      },
    ],
  },
];

const DpiaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDpia, fetchDpiaById, updateDpia, saveDpiaSection, loading, error } = useDpiaStore();
  const { user } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, Record<string, any>>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchDpiaById(id);
    }
  }, [id, fetchDpiaById]);
  
  useEffect(() => {
    if (currentDpia && currentDpia.sections) {
      const initialData: Record<string, Record<string, any>> = {};
      
      // Initialize with project info (title from DPIA)
      initialData['project-info'] = {
        title: currentDpia.title,
      };
      
      // Add data from sections
      currentDpia.sections.forEach(section => {
        initialData[section.section_name] = section.content;
      });
      
      setFormData(initialData);
    }
  }, [currentDpia]);
  
  const handleInputChange = (
    stepId: string,
    fieldId: string,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        [fieldId]: value,
      },
    }));
  };
  
  const validateStep = (stepIndex: number) => {
    const step = formSteps[stepIndex];
    const stepData = formData[step.id] || {};
    const errors: string[] = [];
    
    step.fields.forEach(field => {
      if (field.required && !stepData[field.id]) {
        errors.push(`${field.label} is required`);
      }
    });
    
    setFormErrors(prev => ({
      ...prev,
      [step.id]: errors,
    }));
    
    return errors.length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      handleSave();
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleSave = async () => {
    if (!id || !user) return;
    
    setIsSaving(true);
    
    try {
      // Update DPIA title if it's changed
      const currentStepId = formSteps[currentStep].id;
      if (currentStepId === 'project-info' && formData['project-info']?.title) {
        await updateDpia(id, {
          title: formData['project-info'].title,
        });
      }
      
      // Save current section data
      await saveDpiaSection(id, currentStepId, formData[currentStepId] || {});
    } catch (err) {
      console.error('Error saving DPIA:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!id) return;
    
    if (validateStep(currentStep)) {
      setIsSaving(true);
      
      try {
        // Save current section
        await saveDpiaSection(id, formSteps[currentStep].id, formData[formSteps[currentStep].id] || {});
        
        // Update DPIA status to submitted
        await updateDpia(id, {
          status: 'submitted',
        });
        
        navigate(`/dpias/${id}`);
      } catch (err) {
        console.error('Error submitting DPIA:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handlePreFill = (fieldId: string, value: string) => {
    const currentStepId = formSteps[currentStep].id;
    handleInputChange(currentStepId, fieldId, value);
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
  
  const currentStepData = formSteps[currentStep];
  const stepFormData = formData[currentStepData.id] || {};
  const stepErrors = formErrors[currentStepData.id] || [];

  // Get available fields for the current step
  const availableFields = currentStepData.fields.map(field => ({
    id: field.id,
    label: field.label
  }));
  
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
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {currentDpia?.title || 'New DPIA'}
        </h1>
        <div className="bg-gray-100 h-2 rounded-full">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Step {currentStep + 1} of {formSteps.length}</span>
          <span>{Math.round(((currentStep + 1) / formSteps.length) * 100)}% complete</span>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
          <p className="text-gray-600 mt-1">{currentStepData.description}</p>
        </CardHeader>
        
        <CardContent>
          {stepErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
                  <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                    {stepErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {currentStepData.fields.map((field) => {
              switch (field.type) {
                case 'text':
                  return (
                    <Input
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      value={stepFormData[field.id] || ''}
                      onChange={(e) => handleInputChange(currentStepData.id, field.id, e.target.value)}
                      required={field.required}
                      helpText={field.helpText}
                    />
                  );
                case 'textarea':
                  return (
                    <TextArea
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      value={stepFormData[field.id] || ''}
                      onChange={(e) => handleInputChange(currentStepData.id, field.id, e.target.value)}
                      required={field.required}
                      helpText={field.helpText}
                      rows={5}
                    />
                  );
                case 'select':
                  return (
                    <Select
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      options={field.options || []}
                      value={stepFormData[field.id] || ''}
                      onChange={(e) => handleInputChange(currentStepData.id, field.id, e.target.value)}
                      required={field.required}
                      helpText={field.helpText}
                      placeholder="Select an option"
                    />
                  );
                case 'date':
                  return (
                    <Input
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      type="date"
                      value={stepFormData[field.id] || ''}
                      onChange={(e) => handleInputChange(currentStepData.id, field.id, e.target.value)}
                      required={field.required}
                      helpText={field.helpText}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isSaving}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            
            {currentStep < formSteps.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={isSaving}
                className="flex items-center"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center"
              >
                <Check className="h-4 w-4 mr-1" />
                Submit DPIA
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* AI Assistant */}
      <AiAssistant 
        dpiaId={id}
        currentSection={currentStepData.id}
        onPreFill={handlePreFill}
        availableFields={availableFields}
      />
    </div>
  );
};

export default DpiaForm;
