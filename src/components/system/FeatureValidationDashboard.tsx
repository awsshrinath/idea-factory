
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, Play, Loader2 } from 'lucide-react';
import { featureValidator } from '@/utils/featureValidation';

interface ValidationResult {
  feature: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

interface ValidationSummary {
  total: number;
  success: number;
  warnings: number;
  errors: number;
}

export function FeatureValidationDashboard() {
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [summary, setSummary] = useState<ValidationSummary | null>(null);

  const runValidation = async () => {
    setIsValidating(true);
    try {
      const validation = await featureValidator.runFullValidation();
      setResults(validation.results);
      setSummary(validation.summary);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filterResults = (category: string) => {
    return results.filter(result => result.feature.includes(category));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Feature Validation Dashboard
            <Button
              onClick={runValidation}
              disabled={isValidating}
              size="sm"
              className="ml-auto"
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isValidating ? 'Validating...' : 'Run Validation'}
            </Button>
          </CardTitle>
          <CardDescription>
            Comprehensive validation of backend, AI, and UI features
          </CardDescription>
        </CardHeader>
        
        {summary && (
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
                <div className="text-sm text-gray-500">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.success}</div>
                <div className="text-sm text-gray-500">Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.warnings}</div>
                <div className="text-sm text-gray-500">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.errors}</div>
                <div className="text-sm text-gray-500">Errors</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {results.length > 0 && (
        <Tabs defaultValue="backend" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backend">Backend APIs</TabsTrigger>
            <TabsTrigger value="ai">AI Features</TabsTrigger>
            <TabsTrigger value="ui">UI Components</TabsTrigger>
          </TabsList>

          <TabsContent value="backend">
            <Card>
              <CardHeader>
                <CardTitle>Backend API Validation</CardTitle>
                <CardDescription>
                  Express.js setup, authentication, database schema, and 30+ endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filterResults('Backend').map((result, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{result.feature}</span>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Intelligence Validation</CardTitle>
                <CardDescription>
                  RAG vector database, OpenAI embeddings, MCP character system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filterResults('AI').map((result, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{result.feature}</span>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ui">
            <Card>
              <CardHeader>
                <CardTitle>UI/UX Validation</CardTitle>
                <CardDescription>
                  Premium dashboard, workflows, role-based navigation, user management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filterResults('UI').map((result, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{result.feature}</span>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
