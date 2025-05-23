import {
    ExportedClass as CmsResource
} from './CmsResource';
import {
    ExportedClass as CmsContent
} from './CmsContent';

interface CmsSection {
    id: string;
    title: string;
    resource: CmsResource;
    content: CmsContent[];
}

export {
    CmsSection as ExportedClass
};