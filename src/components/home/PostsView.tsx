import React from "react";
import { Post } from "../../utils/Posts";
import styled from "@emotion/styled";

const PostsView: React.FC<{ items: Post[] }> = ({ items }) => {
  return (
    <PostsViewRoot>
      {items.map(it => <PostItemView key={it.key} item={it}/>)}
    </PostsViewRoot>
  )
}

const PostsViewRoot = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const PostItemView: React.FC<{ item: Post }> = ({ item }) => {
  return (
    <PostsItemViewRoot>
      {/* ToDo: 여기에서 item 가지고 무언가를 합시다 */}
      {item.key}
    </PostsItemViewRoot>
  )
}

const PostsItemViewRoot = styled.div`
  font-size: 17px;
`

export default PostsView
