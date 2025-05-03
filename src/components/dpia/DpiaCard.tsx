import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import type { DPIA } from '../../types';

type DpiaCardProps = {
  dpia: DPIA;
};

const DpiaCard: React.FC<DpiaCardProps> = ({ dpia }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const getStatusIcon = () => {
    switch (dpia.status) {
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
    switch (dpia.status) {
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
    switch (dpia.status) {
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

  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900 truncate max-w-xs">{dpia.title}</h3>
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(dpia.updated_at)}
              </p>
            </div>
          </div>
          
          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dpias/${dpia.id}`)}
          >
            View
          </Button>
          
          {dpia.status === 'draft' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/dpias/${dpia.id}/edit`)}
            >
              Continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DpiaCard;
