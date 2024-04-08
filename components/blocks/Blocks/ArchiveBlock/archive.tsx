import React from 'react'



import { ArchiveBlockProps } from './type'

import classes from './index.module.scss'
import { Gutter } from '../../gutter/gutter'
import CollectionArchive from '../../collectionArchive/collectionArchive'
import RichText from '../../RichText'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = props => {
  const {
    introContent,
    id,
    relationTo,
    populateBy,
    limit,
    populatedDocs,
    populatedDocsTotal,
    categories,
  } = props

  return (
    <div id={`block-${id}`} className={classes.archiveBlock}>
      {introContent && (
        <Gutter className={classes.introContent}>
          <RichText content={introContent} />
        </Gutter>
      )}
      <CollectionArchive
        populateBy={populateBy || undefined}
        relationTo={relationTo || undefined}
        populatedDocs={populatedDocs}
        populatedDocsTotal={populatedDocsTotal}
        categories={categories}
        limit={limit || undefined}
      />
    </div>
  )
}
