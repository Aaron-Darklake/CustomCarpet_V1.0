import React from 'react'







import classes from './index.module.scss'
import { Page } from '../../../../components/types/product-type'
import { Gutter } from '../../gutter/gutter'
import RichText from '../../RichText'
import { VerticalPadding } from '../../VerticalPadding'
import { CMSLink } from '../../Link'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CallToActionBlock: React.FC<
  Props & {
    id?: string
  }
> = ({ links, richText, invertBackground }) => {
  return (
    <Gutter className={classes.gutter}>
      <VerticalPadding
        className={[classes.callToAction, invertBackground && classes.invert]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.wrap}>
          <div className={classes.content}>
            <RichText className={classes.richText} content={(richText)} />
          </div>
          <div className={classes.linkGroup}>
            {(links || []).map(({ link }, i) => {
              return <CMSLink key={i} {...link} invert={invertBackground} />
            })}
          </div>
         
        </div>
      </VerticalPadding>
    </Gutter>
  )
}
