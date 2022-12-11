// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Arrays } from "../../utils/Array";


const Randoms: Data[] = [
  // { text: "", image: "", duration: 0 },
  { text: "당신은 지금 배가 고픕니다...\n고기를 구워먹고싶어집니다...", image: "gogi.jpg", duration: 4500 },
  { text: "스타벅스 죽돌이던 때가 있었습니다.\n거의 매일 스타벅스에 앉아있었죠.", image: "starbucks.jpg", duration: 4000 },
  { text: "쓸만한 신발이 하나 갖고싶습니다.", image: "shoes.jpg", duration: 3000 },
  { text: "약 6년간 트위터 하면서\nRT를 타본 적이 딱 한 번 있습니다.", image: "rt_star.jpg", duration: 4000 },
  { text: "이런걸 파던 때도 있었습니다. 지금은 아니지만요.", image: "rhythm.jpg", duration: 4500 },
  { text: "지금까지 가끔이지만 즐겨하는 리듬겜입니다.\n아무도 안해서 대기가 없는게 쾌적해서 좋아요.", image: "rhythm_2.jpg", duration: 4500 },
  { text: "고훈 군은 라면을 좋아합니다.\n컵라면도, 봉지라면도 좋아합니다.\n싸고 간편하잖아요!", image: "ramyeon.jpg", duration: 5000 },
  { text: "지금까지 일본 여행을 세 번 다녀왔는데\n모두 오사카(쿄토)로 다녀왔습니다.\n도쿄에 가보고싶어요.", image: "oosaka_2.jpg", duration: 5500 },
  { text: "지금까지 일본 여행을 세 번 다녀왔는데\n모두 오사카(쿄토)로 다녀왔습니다.\n도쿄에 가보고싶어요.", image: "oosaka.jpg", duration: 5500 },
  { text: "마인크래프트에서 광질은 사진처럼 합니다.\n지하에서 하늘을 볼 수 있죠.", image: "minecraft.jpg", duration: 4500 },
  { text: "일본의 교자 만두는\n편의점에서 싸게 파는것도 맛있더군요.", image: "gyoja.jpg", duration: 3500 },
  { text: "학교 다닐 때는 엉뚱한 친구들이 곁에 있었습니다.", image: "friends.jpg", duration: 3500 },
  { text: "학교 다닐 때는 엉뚱한 친구들이 곁에 있었습니다.", image: "friends_2.jpg", duration: 3500 },
  { text: "컴공과는 이런거 찍는 직업이라던데요?\n물론 저는 컴공과가 아닙니다.", image: "comgong.jpg", duration: 4500 },
  { text: "짹. 짹짹.. 짹 짹짹 짹 짹짹짹! 삐약.", image: "chamsae.jpg", duration: 3500 },
  { text: "불닭을 좋아했습니다. 좋아했었습니다.\n지금도 좋아하고싶습니다.", image: "buldark.jpg", duration: 4500 },
  { text: "수능이 끝난지 꽤 시간이 지났지만,\n여전히 생명과학 II 문제를 푸는 걸 좋아합니다.", image: "biology_ii.jpg", duration: 5000 },
  { text: "통학 왕복 4시간이 걸리는\n학교에 다니던 시절이 있었습니다.", image: "amumal.jpg", duration: 4000 },
  { text: "고훈 군은 가끔 떡볶이를 좋아합니다.\n가끔이요.", image: "bbokki.png", duration: 3500 },
  { text: "고훈 군은 마인크래프트를 즐겨 합니다.\n같이할 사람 절찬리에 모집 중!", image: "command_block_front_big.png", duration: 5000 },
  { text: "감자튀김 최고! 너희도 같이 이 감자튀김 먹자!", image: "fries.png", duration: 4000 },
  { text: "이건 야채야, 야채라고! 그 몸에 좋다는 야채라고!!", image: "fries_2.png", duration: 4000 },
  { text: "가끔은 핫도그도 괜찮지.\n갈 때마다 가격이 올라있어서 슬플 뿐이야.", image: "hotdog.png", duration: 4500 },
  { text: "즐거운 밤샘코딩! Happy AllNight Hacking!!", image: "monster.png", duration: 3500 },
  { text: "고훈 군은 가끔 인싸들과 놀러갑니다.\n피곤하지만 재밌습니다.", image: "pegoen.png", duration: 4500 },
  { text: "비둘. 비둘비둘. 비둘빔 비둘비둘. 삐약.", image: "pigeon.png", duration: 3500 },
  { text: "고훈 군은 가끔 라멘을 좋아합니다.\n치지에 숙주만 빼고 나머지는 보통으로 해주세요!", image: "ramen.png", duration: 5000 },
  { text: "고훈 군은 가끔 라멘을 좋아합니다.\n치지에 숙주만 빼고 나머지는 보통으로 해주세요!", image: "ramen_2.png", duration: 5000 },
  { text: "영원히 고통받는 고훈 군입니다.", image: "suffering.png", duration: 3500 }
]

type Data = {
  text: string
  image: string
  duration: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(Arrays().random(Randoms))
}
