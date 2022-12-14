import { Post } from "../../utils/Posts";
import { Breakpoint } from "../../../styles/globals";
import styled from "@emotion/styled";
import Router from "next/router";
import React, { CSSProperties, useMemo } from "react";

const PostItemView: React.FC<{ item: Post }> = ({ item }) => {

  const previewStyle = useMemo<CSSProperties>(() => ({ rotate: `z ${item.key.randomize(-4, 4)}deg` }), [item.key])

  return (
    <PostsItemViewRoot onClick={() => Router.push(`/post/${item.key}`)}>
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
  
  cursor: pointer;
  
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
    bottom: 75px;
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
