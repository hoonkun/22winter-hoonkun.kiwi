import React, { CSSProperties, useCallback, useMemo, useRef } from "react";
import { Post } from "../../utils/Posts";
import styled from "@emotion/styled";
import MaterialIcon from "../MaterialIcon";

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
}

const PostsView: React.FC<Props> = ({ items, paginator }) => {

  const scrollable = useRef<HTMLDivElement>(null)

  const paginate = useCallback((action: () => void) => {
    return () => {
      scrollable.current?.scrollTo({ top: 0, behavior: "smooth" })
      action()
    }
  }, [])

  return (
    <PostsViewRoot ref={scrollable}>
      <PostListContainer>
        {items.map(it => <PostItemView key={it.key} item={it}/>)}
      </PostListContainer>
      <Pager>
        <PagerArrow i={"chevron_left"} onClick={paginate(paginator.previous)} />
        <PagerPageText>
          <PagerCurrent>{paginator.page}</PagerCurrent>
          <PagerMax>&nbsp;/&nbsp;{paginator.maxPage}</PagerMax>
        </PagerPageText>
        <PagerArrow i={"chevron_right"} onClick={paginate(paginator.next)} />
      </Pager>
    </PostsViewRoot>
  )
}

const PostsViewRoot = styled.div`
  width: 100%;
  height: 100%;
  max-width: 400rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  
  padding: 80px 20px 20px 20px;
  pointer-events: auto;
`

const PostListContainer = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 100%;
  grid-row-gap: 10px;
`

const Pager = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  justify-content: flex-end;
`

const PagerArrow = styled(MaterialIcon)`
  padding: 7px;
`

const PagerPageText = styled.div`
  display: flex;
  align-items: flex-end;
`

const PagerCurrent = styled.div`
  font-weight: bold;
  font-size: 16px;
`

const PagerMax = styled.div`
  padding-bottom: 1.5px;
  opacity: 0.75;
`

const PostItemView: React.FC<{ item: Post }> = ({ item }) => {

  const previewStyle = useMemo<CSSProperties>(() => ({ rotate: `z ${item.key.randomize(-5, 5)}deg` }), [item.key])

  return (
    <PostsItemViewRoot>
      <PostPreviewContainer style={previewStyle}>
        <PostPreview src={require(`./../../../_posts/${item.key}/preview.png`).default.src}/>
        <PostPreviewOverlay>
          <PostCreatedDate>{ item.data.date }</PostCreatedDate>
        </PostPreviewOverlay>
      </PostPreviewContainer>
      <PostDataContainer>
        <PostTitle>{item.data.title}</PostTitle>
        <PostExcerptContainer>
          {item.excerpt.truncateByteSize(113).let(it => it === item.excerpt ? it : `${it}...`)}
        </PostExcerptContainer>
      </PostDataContainer>
    </PostsItemViewRoot>
  )
}

const PostsItemViewRoot = styled.div`
  font-size: 17px;
  position: relative;
  height: 125px;
`

const PostPreviewContainer = styled.div`
  position: absolute;
  height: 100%;
  aspect-ratio: 3.75 / 3;
  left: 0;
  top: 0;
  border: 4px solid white;
`

const PostPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const PostCreatedDate = styled.div`
  transform: scale(0.75);
  transform-origin: 0 100%;
`

const PostPreviewOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 3.75 / 3;
  background: linear-gradient(to top, #00000099 0, transparent 30%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: 10px;
  padding: 2px 4px;
  color: #ffffffA0;
`

const PostDataContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 7px;
  width: 70%;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const PostTitle = styled.div`
  font-weight: bold;
  text-align: right;
  word-break: keep-all;
  width: 74%;
  margin-bottom: 7px;
`

const PostExcerptContainer = styled.div`
  background-color: #272727;
  padding: 10px;
`

export default PostsView
