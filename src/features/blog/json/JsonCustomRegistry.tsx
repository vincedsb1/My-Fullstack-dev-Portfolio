import type { CustomModule } from '@/lib/blog/json-types';
import { BlogModuleFrame } from '../design-system/BlogUI';

/** Registre explicite, sans eval, import dynamique ou élément HTML injecté depuis JSON. */
export function JsonCustomModule({module}:{module:CustomModule}) {
  switch(module.component){
    case 'metric-panel':return <BlogModuleFrame title={module.props.label} tone="info" note={module.props.caption}>
      <div className="blog-ds__json-metric">{module.props.value}</div>
    </BlogModuleFrame>;
  }
}
