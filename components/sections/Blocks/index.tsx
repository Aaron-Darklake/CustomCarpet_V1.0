import React, { Fragment } from 'react'





import { Page } from '../../../components/types/product-type'
import { ArchiveBlock } from '../../../components/blocks/Blocks/ArchiveBlock/archive'
import { RelatedProducts, type RelatedProductsProps } from '../../../components/blocks/Blocks/RelatedProducts'
import { BackgroundColor } from '../../../components/blocks/BackgroundColor'
import { toKebabCase } from '../../../components/utils/toKebabCase'
import { VerticalPadding, VerticalPaddingOptions } from '../../../components/blocks/VerticalPadding'
import { CallToActionBlock } from '../../../components/blocks/Blocks/CallToAction'
import { ContentBlock } from '../../../components/blocks/Blocks/Content'
import { MediaBlock } from '../../../components/blocks/Blocks/MediaBlock'

const blockComponents = {
  cta: CallToActionBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
  archive: ArchiveBlock,
  relatedProducts: RelatedProducts,
}


export const Blocks: React.FC<{
  blocks: (Page['layout'][0] | RelatedProductsProps)[]
  disableTopPadding?: boolean
  disableBottomPadding?: boolean
}> = props => {
  const { disableTopPadding, blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            // the cta block is containerized, so we don't consider it to be inverted at the block-level
            const blockIsInverted =
              'invertBackground' in block && blockType !== 'cta' ? block.invertBackground : false
            const prevBlock = blocks[index - 1]

            const prevBlockInverted =
              prevBlock && 'invertBackground' in prevBlock && prevBlock?.invertBackground

            const isPrevSame = Boolean(blockIsInverted) === Boolean(prevBlockInverted)

            let paddingTop: VerticalPaddingOptions = 'large'
            let paddingBottom: VerticalPaddingOptions = 'large'

            if (prevBlock && isPrevSame) {
              paddingTop = 'none'
            }

            if (index === blocks.length - 1) {
              paddingBottom = 'large'
            }

            if (disableTopPadding && index === 0) {
              paddingTop = 'none'
            }

            if (Block) {
              return (
                <BackgroundColor key={index} invert={blockIsInverted || undefined}>
                  <VerticalPadding top={paddingTop} bottom={paddingBottom}>
                    <Block
                      // @ts-expect-error
                      id={toKebabCase(blockName)}
                      {...block}
                    />
                  </VerticalPadding>
                </BackgroundColor>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
