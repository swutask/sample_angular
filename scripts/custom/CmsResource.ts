import {
    ExportedClass as CmsAsset
} from './CmsAsset';
import {
    ExportedClass as CmsAuthors
} from './CmsAuthors';
import {
    ExportedClass as CmsSection
} from './CmsSection';

interface CmsResource {
    id: string;
    title: string;
    subTitle: string;
    about: string;
    image: CmsAsset;
    authors: CmsAuthors;
    sections: CmsSection[],
    updatedAt: Date;
    userAccess: string;
    accessTags: string;
}

export {
    CmsResource as ExportedClass
};