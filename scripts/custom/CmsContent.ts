import {
    ExportedClass as CmsResource
} from './CmsResource';
import {
    ExportedClass as CmsAsset
} from './CmsAsset';
import {
    ExportedClass as CmsSection
} from './CmsSection';

interface CmsContent {
    id: string;
    content: string;
    title: string;
    summary: string;
    mediaTypeLength: string;
    video: CmsAsset;
    audio: CmsAsset;
    document: CmsAsset;
    refUrlOrImbed: string;
    resource: CmsResource;
    section: CmsSection;
}

export {
    CmsContent as ExportedClass
};