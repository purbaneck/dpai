import React from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { FileText, Shield, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

const HelpPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">DPIA Help Guide</h1>
        <p className="text-gray-600 mt-2">
          Learn how to create effective Data Protection Impact Assessments
        </p>
      </div>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">What is a DPIA?</h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              A Data Protection Impact Assessment (DPIA) is a process designed to help you systematically analyze, identify and minimize the data protection risks of a project or plan. It is a key part of your accountability obligations under GDPR, and when done properly helps you assess and demonstrate how you comply with all of your data protection obligations.
            </p>
            <p className="text-gray-700">
              DPIAs are important tools for accountability, as they help organizations not only to comply with requirements of the GDPR, but also to demonstrate that appropriate measures have been taken to ensure compliance.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">When is a DPIA required?</h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Under the GDPR, you must carry out a DPIA when processing is likely to result in a high risk to individuals. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Systematic and extensive profiling with significant effects</li>
              <li>Large scale use of sensitive data</li>
              <li>Public monitoring</li>
              <li>When using new technologies</li>
              <li>When processing on a large scale</li>
              <li>When matching or combining datasets</li>
              <li>When processing data concerning vulnerable subjects</li>
              <li>When using innovative technology or organizational solutions</li>
            </ul>
            <p className="text-gray-700">
              If you're unsure whether your processing requires a DPIA, it's generally good practice to conduct one anyway as it helps ensure compliance with data protection principles.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">How to complete a DPIA</h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Our DPIA tool guides you through the following key steps:
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-900">1. Project Information</h3>
                <p className="text-gray-700">Describe the nature, scope, context and purposes of the processing.</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-900">2. Data Processing Details</h3>
                <p className="text-gray-700">Document what data you're collecting, from whom, and how it will be used.</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-900">3. Necessity and Proportionality</h3>
                <p className="text-gray-700">Assess whether the processing is necessary and proportionate to your purposes.</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-900">4. Risk Assessment</h3>
                <p className="text-gray-700">Identify potential risks to individuals and their severity and likelihood.</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-900">5. Risk Mitigation</h3>
                <p className="text-gray-700">Identify measures to reduce or eliminate the identified risks.</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-900">6. Conclusion</h3>
                <p className="text-gray-700">Document your decision on whether to proceed with the processing.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Best Practices</h2>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2 mt-0.5">✓</span>
                <span>Start the DPIA early in the project planning stage</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2 mt-0.5">✓</span>
                <span>Be thorough and honest in your risk assessment</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2 mt-0.5">✓</span>
                <span>Consult with relevant stakeholders, including data subjects where appropriate</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2 mt-0.5">✓</span>
                <span>Document all decisions and justifications</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2 mt-0.5">✓</span>
                <span>Implement risk mitigation measures before beginning processing</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2 mt-0.5">✓</span>
                <span>Review and update the DPIA regularly, especially when changes occur</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2 mt-0.5">✓</span>
                <span>Integrate DPIA outcomes into your broader data protection framework</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <HelpCircle className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Can I reuse parts of previous DPIAs?</h3>
                <p className="text-gray-700 mt-1">
                  Yes, you can reuse elements of previous DPIAs where the processing operations are similar. However, you should always review and update the content to ensure it's relevant to the current project.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Do I need to publish my DPIA?</h3>
                <p className="text-gray-700 mt-1">
                  The GDPR doesn't require you to publish your DPIA, but doing so can help demonstrate transparency. You may choose to publish a summary rather than the full document.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">What if the DPIA identifies high risks that cannot be mitigated?</h3>
                <p className="text-gray-700 mt-1">
                  If you cannot sufficiently mitigate the risks, you must consult your data protection authority before proceeding with the processing.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">How often should I review my DPIA?</h3>
                <p className="text-gray-700 mt-1">
                  You should review your DPIA whenever there is a change in the risk of the processing activity. As a best practice, schedule regular reviews (e.g., annually) even if no obvious changes have occurred.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Who should be involved in creating a DPIA?</h3>
                <p className="text-gray-700 mt-1">
                  Ideally, a DPIA should involve input from various stakeholders including your Data Protection Officer (if you have one), IT security team, legal team, business owners, and sometimes representatives of data subjects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
