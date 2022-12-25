import React, { CSSProperties, useCallback, useEffect, useMemo, useRef } from "react";
import { Post } from "../../utils/Posts";
import styled from "@emotion/styled";
import MaterialIcon from "../MaterialIcon";
import { Breakpoint, OverlayOverflow } from "../../../styles/globals";

import PostsTitle from "./../../resources/images/posts_title.jpg"

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

  const scrollable = useRef<HTMLDivElement>(null)

  const paginate = useCallback((action: () => void) => {
    return () => {
      requestSplash(true)
      action()
    }
  }, [requestSplash])

  useEffect(() => {
    requestSplash(false)
    scrollable.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [items, requestSplash])

  return (
    <PostsViewRoot ref={scrollable}>
      <PostsViewLimitedWidth>
        {paginator.page === 1 &&
          <PostsViewTitle>
            <PostsViewTitleImageContainer>
              <PostsViewTitleImage src={PostsTitle.src} />
              <PostsViewTitleOverlay>
                <PostsViewTitleText>키위새의 아무말 집합소</PostsViewTitleText>
                <PostsViewSubtitleList>
                  <li>코딩</li>
                  <li>생명과학II</li>
                  <li>게임</li>
                  <li>일상</li>
                </PostsViewSubtitleList>
              </PostsViewTitleOverlay>
              <PostsViewTitleClip/>
            </PostsViewTitleImageContainer>
          </PostsViewTitle>
        }
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
  ${OverlayOverflow};
`

const PostsViewLimitedWidth = styled.div`
  width: 100%;
  
  display: flex;
  flex-direction: column;
  align-items: stretch;
  
  max-width: 400px;
  padding: 80px 20px 20px 20px;

  ${Breakpoint} {
    max-width: 1000px;
    padding: 80px 20px 20px 20px;
  }
`

const PostsViewTitle = styled.div`
  width: calc(100% + 40px);
  margin: 0 -20px;
  padding-bottom: 20px;
  
  ${Breakpoint} {
    padding-bottom: 30px;
  }
`

const PostsViewTitleImageContainer = styled.div`
  width: 100%;
  rotate: z 2deg;
  transform: scale(0.95);
  border: 5px solid white;
  aspect-ratio: 4 / 2.5;
  overflow: hidden;
  position: relative;
  
  ${Breakpoint} {
    rotate: z 1deg;
    aspect-ratio: 4 / 1.5;
  }
`

const PostsViewTitleImage = styled.img`
  width: 100%;
  object-fit: cover;
  display: block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`

const PostsViewTitleOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-15deg, #000000B0, transparent);
  
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  
  padding: 15px;
  
  ${Breakpoint} {
    padding: 25px;
  }
`

const PostsViewTitleClip = styled.div`
  position: absolute;
  right: -10px;
  top: 20px;
  width: 60px;
  height: 25px;
  background-color: #fdd835;
`

const PostsViewTitleText = styled.div`
  font-size: 25px;
  font-weight: bold;
  
  ${Breakpoint} {
    font-size: 40px;
  }
`

const PostsViewSubtitleList = styled.ul`
  list-style-type: none;
  display: flex;
  margin: 0 0 -3px 0;
  opacity: 0.75;

  ${Breakpoint} {
    font-size: 20px;
  }
  
  & > li:nth-of-type(n+2):before {
    content: "/";
    margin: 0 5px;
    opacity: 0.5;
  }
`

const PostListContainer = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 100%;
  grid-row-gap: 10px;
  
  ${Breakpoint} {
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 40px;
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
        <PostExcerptContainer dangerouslySetInnerHTML={{ __html: item.excerpt }}/>
      </PostDataContainer>
    </PostsItemViewRoot>
  )
}

const PostsItemViewRoot = styled.div`
  font-size: 17px;
  position: relative;
  height: 175px;
  
  ${Breakpoint} {
    height: 350px;
  }
`

const PostPreviewContainer = styled.div`
  position: absolute;
  height: 150px;
  aspect-ratio: 3.75 / 3;
  left: 0;
  top: 0;
  border: 4px solid white;
  
  ${Breakpoint} {
    height: 250px;
    border: 8px solid white;
  }
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
  color: #ffffffA0;
  
  font-size: 10px;
  padding: 2px 4px;
  
  ${Breakpoint} {
    font-size: 14px;
    padding: 4px 8px;
  }
`

const PostDataContainer = styled.div`
  position: absolute;
  right: 0;
  width: 70%;

  bottom: 14px;
  
  ${Breakpoint} {
    bottom: 28px;
    padding-top: 10px;
  }
  
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const PostTitle = styled.div`
  font-weight: bold;
  text-align: right;
  word-break: keep-all;
  padding-top: 14px;
  padding-left: 15%;
  padding-bottom: 7px;
  
  text-shadow: 0 0 4px #000000;
  
  font-size: 12px;
  background: radial-gradient(farthest-side at 50% 100%, black 0, transparent 100%);

  line-height: 150%;
  
  ${Breakpoint} {
    font-size: 20px;
    padding-left: 0;
    padding-bottom: 14px;
    padding-top: 40px;
    width: 100%;
    background:
      radial-gradient(farthest-side at 50% 100%, #00000075 0, #00000060 50%, transparent 100%),
      radial-gradient(50% 50% at 60% 100%, #00000075 0, #00000060 50%, transparent 100%),
      radial-gradient(50% 50% at 70% 100%, #00000075 0, #00000060 50%, transparent 100%);
  }
`

const PostExcerptContainer = styled.div`
  background-color: #272727;
  padding: 10px;
  
  font-size: 12px;
  
  line-height: 150%;
  
  ${Breakpoint} {
    padding: 15px;
    font-size: 14px;
    line-height: 150%;
  }
`

export default PostsView
