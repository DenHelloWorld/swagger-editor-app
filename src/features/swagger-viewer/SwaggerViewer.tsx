import { useSchema } from './hooks/useSchema';
import { EndpointList } from './components/EndpointList/EndpointList';

export function SwaggerViewer() {
  const { spec } = useSchema();
  return <EndpointList spec={spec} />;
}
