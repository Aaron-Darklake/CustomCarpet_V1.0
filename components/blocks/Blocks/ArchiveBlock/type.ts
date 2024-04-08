import { Page } from "../../../../components/types/product-type";


export type ArchiveBlockProps = Extract<Page['layout'][0], { blockType: 'archive' }>
