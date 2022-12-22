import React from "react";
import { Post } from "../../utils/Posts";
import styled from "@emotion/styled";

export type PostPaginator = {
  next: () => void
  previous: () => void
  navigate: (page: number) => void
  maxPage: number
}

type Props = {
  items: Post[]
  paginator: PostPaginator
}

const PostsView: React.FC<Props> = ({ items, paginator }) => {
  return (
    <PostsViewRoot>
      {items.map(it => <PostItemView key={it.key} item={it}/>)}
      <div onClick={paginator.next}>다음페이지</div>
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
  
  padding: 80px 20px 20px 20px;
  pointer-events: auto;
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
