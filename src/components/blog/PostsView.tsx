import React, { CSSProperties, useCallback, useEffect, useMemo, useRef } from "react";
import { Post } from "../../utils/Posts";
import styled from "@emotion/styled";
import MaterialIcon from "../MaterialIcon";
import { Breakpoint, not, OverlayOverflow } from "../../../styles/globals";

export type PostPaginator = {
  next: () => void
  previous: () => void
  navigate: (page: number) => void
  maxPage: number
  page: number
}

type Props = {
  items: Post[]
  paginator: PostPaginator
  requestSplash: (request: boolean) => void
}

const PostsView: React.FC<Props> = ({ items, paginator, requestSplash }) => {

  const top = useRef<HTMLDivElement>(null)

  const paginate = useCallback((action: () => void) => {
    return () => {
      requestSplash(true)
      action()
    }
  }, [requestSplash])

  useEffect(() => {
    requestSplash(false)
    top.current?.scrollIntoView({ behavior: "smooth" });
  }, [items, requestSplash])

  return (
    <PostsViewRoot>
      <div ref={top}/>
      <PostsViewLimitedWidth>
        <PostListContainer>
          {items.map((it, index) => <PostItemView key={it.key} item={it} latest={paginator.page === 1 && index === 0} />)}
        </PostListContainer>
        <Pager>
          <PagerArrow i={"chevron_left"} onClick={paginate(paginator.previous)} />
          <PagerPageText>
            <PagerCurrent>{paginator.page}</PagerCurrent>
            <PagerMax>&nbsp;/&nbsp;{paginator.maxPage}</PagerMax>
          </PagerPageText>
          <PagerArrow i={"chevron_right"} onClick={paginate(paginator.next)} />
        </Pager>
      </PostsViewLimitedWidth>
    </PostsViewRoot>
  )
}

const PostsViewRoot = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
  
  ${Breakpoint} {
    ${OverlayOverflow};
  }
`

const PostsViewLimitedWidth = styled.div`
  width: 100%;
  
  display: flex;
  flex-direction: column;
  align-items: stretch;
  
  padding: 80px 20px 20px 20px;

  ${Breakpoint} {
    padding: 80px;
  }
`

const PostListContainer = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 100%;
  grid-row-gap: 10px;
  
  ${Breakpoint} {
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 80px;
    grid-row-gap: 60px;
  }
`

const Pager = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  justify-content: flex-end;
  
  ${Breakpoint} {
    font-size: 20px;
  }
`

const PagerArrow = styled(MaterialIcon)`
  padding: 7px;
  cursor: pointer;
`

const PagerPageText = styled.div`
  display: flex;
  align-items: flex-end;
`

const PagerCurrent = styled.div`
  font-weight: bold;
  font-size: 16px;
  
  ${Breakpoint} {
    font-size: 26px;
  }
`

const PagerMax = styled.div`
  padding-bottom: 1.5px;
  opacity: 0.75;
`

const PostItemView: React.FC<{ item: Post, latest: boolean }> = ({ item, latest }) => {

  const previewStyle = useMemo<CSSProperties>(() => ({ rotate: `z ${item.key.randomize(-5, 5)}deg` }), [item.key])
  const contentStyle = useMemo<CSSProperties>(() => ({ rotate: `z ${-1 * item.key.randomize(-5, 5)}deg` }), [item.key])

  const Root = latest ? LatestPostItemViewRoot : NormalPostItemViewRoot
  const PreviewContainer = latest ? LatestPostPreviewContainer : NormalPostPreviewContainer
  const PostTitle = latest ? LatestPostTitle : NormalPostTitle
  const PostExcerpt = latest ? LatestPostExcerpt : NormalPostExcerpt

  return (
    <Root>
      <PreviewContainer style={previewStyle}>
        <LatestPostPreview src={require(`./../../../_posts/${item.key}/preview.png`).default.src} />
        <LatestPostPreviewOverlay>
          <LatestPostPreviewContent style={contentStyle}>
            <PostTitle>{ item.data.title }</PostTitle>
            <PostExcerpt>{ item.excerpt }</PostExcerpt>
          </LatestPostPreviewContent>
        </LatestPostPreviewOverlay>
      </PreviewContainer>
    </Root>
  )
}

const LatestPostTitle = styled.div`
  color: #eeeeee;
  font-size: 16px;
  font-weight: bold;
  width: 85%;
  text-align: center;
  word-break: keep-all;
  margin-bottom: 15px;
  
  ${Breakpoint} {
    font-size: 40px;
  }
`

const NormalPostTitle = styled(LatestPostTitle)`
  font-size: 16px;
  margin-bottom: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1);
  
  ${Breakpoint} {
    font-size: 20px;
  }
`

const LatestPostExcerpt = styled.div`
  width: 75%;
  word-break: keep-all;
  text-align: center;
  font-size: 10px;
  opacity: 0.8;
  
  ${Breakpoint} {
    font-size: 18px;
  }
`

const NormalPostExcerpt = styled(LatestPostExcerpt)`
  font-size: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -25%);
  opacity: 0;
  transition: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.15s linear;
  
  ${Breakpoint} {
    font-size: 11px;
  }
`

const LatestPostItemViewRoot = styled.div`
  align-self: center;
  justify-self: stretch;
  
  ${Breakpoint} {
    grid-column: 1 / 3;
    grid-row: 1 / 3;

    &:hover {
      transform: scale(1.05);
    }
  }

  transition: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1);
`

const NormalPostItemViewRoot = styled(LatestPostItemViewRoot)`
  height: 200px;
  
  ${Breakpoint} {
    grid-row: unset;
    grid-column: unset;

    height: 300px;
  }

  ${Breakpoint} {
    &:hover ${NormalPostTitle} {
      transform: translate(-50%, -100%);
    }
    &:hover ${NormalPostExcerpt} {
      transform: translate(-50%, calc(8px));
      opacity: 1;
    }
  }
  ${not(Breakpoint)} {
    & ${NormalPostTitle} {
      transform: translate(-50%, -100%);
    }
    & ${NormalPostExcerpt} {
      transform: translate(-50%, calc(8px));
      opacity: 1;
    }
  }
`

const LatestPostPreviewContainer = styled.div`
  border: 5px solid #eeeeee;
  height: 100%;
  position: relative;
  
  ${Breakpoint} {
    border: 12.5px solid #eeeeee;
  }
`

const NormalPostPreviewContainer = styled(LatestPostPreviewContainer)`
  border: 5px solid #eeeeee;
  
  ${Breakpoint} {
    border: 8px solid #eeeeee;
  }
`

const LatestPostPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const LatestPostPreviewOverlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000A0;
`

const LatestPostPreviewContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default PostsView
