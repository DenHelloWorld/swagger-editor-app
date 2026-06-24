// TEMP: dev preview route for SwaggerViewer
// TODO: Remove this file when SwaggerViewer is moved to its proper route
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SwaggerViewer } from '@/features/swagger-viewer/SwaggerViewer';

export default function SwaggerViewerDevPage() {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Swagger Viewer</CardTitle>
      </CardHeader>
      <CardContent className="h-[600px]">
        <SwaggerViewer />
      </CardContent>
    </Card>
  );
}
