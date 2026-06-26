import { SplitView } from '@/features/swagger-editor/components/SplitView/SplitView';
import { SwaggerEditor } from '@/features/swagger-editor/SwaggerEditor';
import { SwaggerViewer } from '@/features/swagger-viewer/SwaggerViewer';

export default function Home() {
  return <SplitView left={<SwaggerEditor />} right={<SwaggerViewer />} />;
}
