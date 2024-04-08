import React from 'react'






import classes from './index.module.scss'
import { Page } from '../../../../components/types/product-type'
import { Gutter } from '../../gutter/gutter'
import RichText from '../../RichText'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  Props & {
    id?: string
  }
> = props => {
  const { columns } = props

  return (
    <Gutter className={classes.content}>
      <div className={classes.grid}>
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, richText, link, size } = col

            return (
              <div key={index} className={[classes.column, classes[`column--${size}`]].join(' ')}>
                <RichText content={richText} />
              </div>
            )
          })}
      </div>
    </Gutter>
  )
}
