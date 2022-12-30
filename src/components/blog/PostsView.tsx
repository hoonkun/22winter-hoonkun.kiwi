import React, { CSSProperties, useCallback, useEffect, useMemo, useRef } from "react";
import { Post } from "../../utils/Posts";
import { Category } from "../../utils/Categories";
import styled from "@emotion/styled";
import MaterialIcon from "../MaterialIcon";
import { Breakpoint, not, OverlayOverflow, ScaleBreakpoint } from "../../../styles/globals";
import Link from "next/link";
import { css } from "@emotion/react";

export type PostPaginator = {
  next: () => void
  previous: () => void
  navigate: (page: number) => void
  maxPage: number
  page: number
}

type Props = {
  posts: Post[]
  categories: Category[]
  paginator: PostPaginator
  requestSplash: (request: boolean) => void
}

const PostsView: React.FC<Props> = ({ posts, paginator, requestSplash, categories }) => {

  const top = useRef<HTMLDivElement>(null)

  const paginate = useCallback((action: () => void) => {
    return () => {
      requestSplash(true)
      action()
    }
  }, [requestSplash])

  useEffect(() => {
    if (paginator.page === 1) return;

    requestSplash(false)
    top.current?.scrollIntoView({ behavior: "smooth" });
  }, [paginator.page, requestSplash])

  return (
    <PostsViewRoot>
      <div ref={top}/>
      <PostsViewLimitedWidth>
        <PostListContainer>
          {posts.map((it, index) => <PostItemView key={it.key} categories={categories} post={it} latest={paginator.page === 1 && index === 0} />)}
        </PostListContainer>
        <Pager>
          <PagerArrow i={"chevron_left"} onClick={paginate(paginator.previous)} enabled={paginator.page > 1} />
          <PagerPageText>
            <PagerCurrent>{paginator.page}</PagerCurrent>
            <PagerMax>&nbsp;/&nbsp;{paginator.maxPage}</PagerMax>
          </PagerPageText>
          <PagerArrow i={"chevron_right"} onClick={paginate(paginator.next)} enabled={paginator.page < paginator.maxPage} />
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
  
  padding: 40px 20px 20px 20px;

  ${Breakpoint} {
    padding: 80px;
  }
  
  ${ScaleBreakpoint} {
    padding: 35px;
  }
`

const PostListContainer = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 100%;
  grid-row-gap: 10px;
  
  ${Breakpoint} {
    grid-template-rows: unset;
    grid-auto-rows: 250px;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }

  ${ScaleBreakpoint} {
    grid-auto-rows: 200px;
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

const PagerArrow = styled(MaterialIcon)<{ enabled: boolean }>`
  padding: 7px;
  cursor: pointer;
  
  pointer-events: ${({ enabled }) => enabled ? "auto" : "none"};
  opacity: ${({ enabled }) => enabled ? 1 : 0.35}
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

const PostItemView: React.FC<{ post: Post, categories: Category[], latest: boolean }> = ({ post, categories, latest }) => {

  const previewStyle = useMemo<CSSProperties>(() => ({ rotate: `z ${post.key.randomize(-1, 2)}deg` }), [post.key])
  const contentStyle = useMemo<CSSProperties>(() => ({ rotate: `z ${-1 * post.key.randomize(-1, 2)}deg` }), [post.key])

  const firstCategoryIndicatorStyle = useMemo<CSSProperties>(() => ({
    [post.key.randomize(0, 2, 4.12) === 0 ? "left" : "right"]: -20,
    [post.key.randomize(0, 2, 0.47) === 0 ? "top" : "bottom"]: 20,
    rotate: `${post.key.randomize(-3, 3, 0.21)}deg`
  }), [post.key]);
  const secondCategoryIndicatorStyle = useMemo<CSSProperties>(() => ({
    [post.key.randomize(0, 2, 0.78) === 0 ? "left" : "right"]: -20,
    [post.key.randomize(0, 2, 0.31) === 0 ? "top" : "bottom"]: 50,
    rotate: `${post.key.randomize(-3, 3, 0.52)}deg`
  }), [post.key]);

  const Root = latest ? LatestPostItemViewRoot : NormalPostItemViewRoot
  const PreviewContainer = latest ? LatestPostPreviewContainer : NormalPostPreviewContainer
  const PostTitle = latest ? LatestPostTitle : NormalPostTitle
  const PostExcerpt = latest ? LatestPostExcerpt : NormalPostExcerpt

  return (
    <Root expand={post.expand}>
      <Link href={`/post/${post.key}`}>
        <PreviewContainer style={previewStyle}>
          <LatestPostPreview src={require(`./../../../_posts/${post.key}/preview.png`).default.src} />
          <LatestPostPreviewOverlay>
            <LatestPostPreviewContent style={contentStyle}>
              <PostTitle>{ post.data.title }</PostTitle>
              <PostExcerpt>{ post.excerpt }</PostExcerpt>
            </LatestPostPreviewContent>
          </LatestPostPreviewOverlay>
          {post.data.categories[0] &&
            <CategoryIndicator color={categories.find(it => it.name === post.data.categories[0])!.color.dark} style={firstCategoryIndicatorStyle}/>
          }
          {post.data.categories[1] &&
            <CategoryIndicator color={categories.find(it => it.name === post.data.categories[1])!.color.dark} style={secondCategoryIndicatorStyle} second/>
          }
        </PreviewContainer>
      </Link>
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
  text-shadow: 0 0 5px #00000099;
  
  ${Breakpoint} {
    font-size: 40px;
  }

  ${ScaleBreakpoint} {
    font-size: 35px;
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

  ${ScaleBreakpoint} {
    font-size: 15px;
  }
`

const LatestPostExcerpt = styled.div`
  width: 75%;
  word-break: keep-all;
  text-align: center;
  font-size: 10px;
  opacity: 1;
  text-shadow: 0 0 5px #000000;
  
  ${Breakpoint} {
    font-size: 18px;
  }

  ${ScaleBreakpoint} {
    font-size: 15px;
    width: 85%;
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
    font-size: 15px;
  }
  
  ${ScaleBreakpoint} {
    font-size: 10px;
  }
`

const LatestPostItemViewRoot = styled.div<{ expand?: { columns: number, rows: number } }>`
  align-self: center;
  justify-self: stretch;
  
  width: 100%;
  height: 100%;
  
  position: relative;
  
  ${Breakpoint} {
    &:hover {
      transform: scale(1.05);
      z-index: 100;
    }
    ${({ expand }) => expand ? css`grid-column: span ${expand.columns};grid-row: span ${expand.rows};` : ""}
  }
  ${ScaleBreakpoint} {
    &:hover {
      transform: scale(1);
    }
  }

  transition: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1);
`

const NormalPostItemViewRoot = styled(LatestPostItemViewRoot)`
  height: 200px;
  
  ${Breakpoint} {
    height: 100%;
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
  ${ScaleBreakpoint} {
    &:hover ${NormalPostTitle} {
      transform: translate(0, 0);
    }
    &:hover ${NormalPostExcerpt} {
      transform: translate(0, 0);
    }
    & ${NormalPostTitle} {
      position: relative;
      top: unset;
      left: unset;
      transform: translate(0, 0);
    }
    & ${NormalPostExcerpt} {
      position: relative;
      top: unset;
      left: unset;
      transform: translate(0, 0);
      opacity: 0.75;
    }
  }
`

const LatestPostPreviewContainer = styled.div`
  border: 5px solid #eeeeee;
  width: 100%;
  aspect-ratio: 4 / 2.5;
  position: relative;
  
  cursor: pointer;
  
  ${Breakpoint} {
    border: none;
    aspect-ratio: unset;
    height: 100%;
    rotate: none !important;
  }
`

const NormalPostPreviewContainer = styled(LatestPostPreviewContainer)`
  border: 5px solid #eeeeee;
  width: unset;
  aspect-ratio: unset;
  height: 100%;
  
  ${Breakpoint} {
    border: none;
  }
`

const LatestPostPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(0.3);
`

const LatestPostPreviewOverlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

const LatestPostPreviewContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  ${Breakpoint} {
    rotate: none !important;
  }
`

const CategoryIndicator = styled.div<{ color: string, second?: boolean }>`
  position: absolute;
  width: 50px;
  height: 20px;
  background-color: ${({ color }) => color};
  box-shadow: 0 0 5px #00000035;

  filter: contrast(0.65);
  
  ${Breakpoint} {
    rotate: none !important;
    left: 0 !important;
    height: 15px;
    width: 40px;
    top: ${({ second }) => second ? 40 : 20}px !important;
  }
`

export default PostsView
