import {
    ExportedClass as CmsAsset
} from './CmsAsset';
import {
    ExportedClass as CmsFooterCta
} from './CmsFooterCta';
import {
    ExportedClass as CmsAuthor
} from './CmsAuthor';

interface CmsPost {
    id: string;
    title: string;
    coverImage: CmsAsset;
    content: string;
    footerCta: CmsFooterCta;
    author: CmsAuthor;
    updatedAt: Date;
    dateAndTime: Date;
}

export {
    CmsPost as ExportedClass
};